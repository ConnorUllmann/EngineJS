function QuadTree(world, maxEntitiesPerNode, minNodeSideLength,
  x=-450000000,
  y=-450000000,
  w=900000000,
  h=900000000) // for some reason not all leaf rectangles seem to appear at larger scales, so I wouldn't recommend going larger
{
    this.world = world;
    this.root = new QuadNode(this, x, y, w, h);
    this.maxEntitiesPerNode = maxEntitiesPerNode;
    this.minNodeSideLength = minNodeSideLength;
    
    this.rectangles = {};
    
    // this.pool = new Pool(
    //     () => new QuadNode(0, 0, 0, 0, this),
    //     (quadNode, x, y, w, h) =>
    //     {
    //         quadNode.x = x;
    //         quadNode.y = y;
    //         quadNode.w = w;
    //         quadNode.h = h;
    //     }
    // );
}

QuadTree.prototype.reset = function()
{
    this.rectangles = {};
    const oldRoot = this.root;
    this.root = oldRoot.clone();
    oldRoot.destroy();
};

QuadTree.prototype.queryPoint = function(x, y)
{
    const ids = new Set();
    this.root.queryPoint(x, y, ids);
    return ids.map(id => this.world.entitiesById[id]);
};

QuadTree.prototype.queryRectangle = function(x, y, w, h)
{
    const ids = new Set();
    this.root.queryRectangle(x, y, w, h, ids);
    return ids
        .map(id => this.world.entitiesById[id])
        .filter(entity => entity); // some entities may not be found because they were destroyed this frame, so don't include them
};

QuadTree.prototype.insertEntity = function(entity, rectangle)
{
    this.root.insert(entity, rectangle);
};

QuadTree.prototype.insertActor = function(actor)
{
    this.insertEntity(actor, actor.boundingBox.add(actor));
};

QuadTree.prototype.getLeafRectangles = function()
{
    const rectangles = [];
    const gatherRectangles = (node) =>
    {
        if(node.hasChildren)
            node.children.forEach(o => gatherRectangles(o));
        else
            rectangles.push(new Rectangle(node.x, node.y, node.w, node.h));
    };
    gatherRectangles(this.root);
    return rectangles;
};

QuadTree.prototype.getDepth = function()
{
    let depth = 0;
    const applyNodeDepth = (node, depthTemp) =>
    {
        depth = Math.max(depth, depthTemp);
        node.children.forEach(o => applyNodeDepth(o, depthTemp + 1));
    };
    applyNodeDepth(this.root, 0);
    return depth;
};


// Intended to only be used by QuadTree internally
function QuadNode(tree, x, y, w, h, splitUsingMidpoint=true)
{
    Rectangle.call(this, x, y, w, h);
    this.tree = tree;
    this.children = []; // list of QuadNodes
    this.entityIds = new Set();
    this.splitUsingMidpoint = splitUsingMidpoint;

    Object.defineProperty(this, 'hasChildren', {
        get: () => this.children && this.children.length > 0
    });
}
Rectangle.parents(QuadNode);

QuadNode.prototype.clone = function()
{
    return new QuadNode(this.tree, this.x, this.y, this.w, this.h);
};

QuadNode.prototype.destroy = function()
{
    this.tree = null;
    this.children.forEach(o => o.destroy());
    this.children.clear();
    this.entityIds = null;
    // TODO: enqueue into pool
};

QuadNode.prototype.splitCenter = function()
{
    const wHalf = this.w/2;
    const hHalf = this.h/2;
    this.children = [
        new QuadNode(this.tree, this.x, this.y, wHalf, hHalf),
        new QuadNode(this.tree, this.x + wHalf, this.y, wHalf, hHalf),
        new QuadNode(this.tree, this.x, this.y + hHalf, wHalf, hHalf),
        new QuadNode(this.tree, this.x + wHalf, this.y + hHalf, wHalf, hHalf),
    ];
    this.passEntitiesToChildren();
};

QuadNode.prototype.splitMidpoint = function()
{
    const midpoint = Point.midpoint(this.entityIds.map(id => this.tree.world.entitiesById[id]));
    const xMin = this.x + this.tree.minNodeSideLength;
    const xMax = this.x + this.w - this.tree.minNodeSideLength;
    const yMin = this.y + this.tree.minNodeSideLength;
    const yMax = this.y + this.h - this.tree.minNodeSideLength;
    midpoint.x = xMin >= xMax ? (xMin + xMax) / 2 : Utils.clamp(midpoint.x, xMin, xMax);
    midpoint.y = yMin >= yMax ? (yMin + yMax) / 2 : Utils.clamp(midpoint.y, yMin, yMax);

    const wLeft = midpoint.x - this.x;
    const wRight = this.w - wLeft;
    const hTop = midpoint.y - this.y;
    const hBottom = this.h - hTop;
    this.children = [
        new QuadNode(this.tree, this.x, this.y, wLeft, hTop),
        new QuadNode(this.tree, midpoint.x, this.y, wRight, hTop),
        new QuadNode(this.tree, this.x, midpoint.y, wLeft, hBottom),
        new QuadNode(this.tree, midpoint.x, midpoint.y, wRight, hBottom),
    ];
    this.passEntitiesToChildren();
};

QuadNode.prototype.passEntitiesToChildren = function()
{
    for(let entityId of this.entityIds)
    {
        const entity = this.tree.world.entitiesById[entityId];
        const rectangle = this.tree.rectangles[entityId];
        for(let child of this.children)
            child.insert(entity, rectangle);
    }
    this.entityIds = null;
};

QuadNode.prototype.insert = function(entity, rectangle)
{
    if(!this.collidesRectangle(rectangle))
        return;

    if(this.hasChildren)
        this.children.forEach(o => o.insert(entity, rectangle));
    else
    {
        this.tree.rectangles[entity.id] = rectangle;
        this.entityIds.add(entity.id);
        const canSplit = this.entityIds.size > this.tree.maxEntitiesPerNode
            && this.w / 2 >= this.tree.minNodeSideLength
            && this.h / 2 >= this.tree.minNodeSideLength;
        if(canSplit)
        {
            if(this.splitUsingMidpoint)
                this.splitMidpoint();
            else
                this.splitCenter();
        }
    }
};

QuadNode.prototype.queryPoint = function(x, y, ids)
{
    if(!this.collidesPoint(x, y))
        return;

    if(this.hasChildren)
        this.children.forEach(o => o.queryPoint(x, y, ids));
    else
        this.entityIds.forEach(id => ids.add(id));
};

QuadNode.prototype.queryRectangle = function(x, y, w, h, ids)
{
    if(!Rectangle.collide(this.x, this.y, this.w, this.h, x, y, w, h))
        return;

    if(this.hasChildren)
        this.children.forEach(o => o.queryRectangle(x, y, w, h, ids));
    else
        this.entityIds.forEach(id => ids.add(id));
};
