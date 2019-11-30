function QuadTree(world, maxEntitiesPerNode, minNodeSideLength, x, y, w, h)
//, x=-Number.MAX_SAFE_INTEGER/2, y=-Number.MAX_SAFE_INTEGER/2, w=Number.MAX_SAFE_INTEGER, h=Number.MAX_SAFE_INTEGER/2)
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
            rectangles.push(node.clone());
    };
    gatherRectangles(this.root);
    return rectangles;
};

function QuadNode(tree, x, y, w, h)
{
    Rectangle.call(this, x, y, w, h);
    this.tree = tree;
    this.children = []; // list of QuadNodes
    this.entityIds = new Set();

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

QuadNode.prototype.split = function()
{
    const wHalf = this.w/2;
    const hHalf = this.h/2;
    this.children = [
        new QuadNode(this.tree, this.x, this.y, wHalf, hHalf),
        new QuadNode(this.tree, this.x + wHalf, this.y, wHalf, hHalf),
        new QuadNode(this.tree, this.x, this.y + hHalf, wHalf, hHalf),
        new QuadNode(this.tree, this.x + wHalf, this.y + hHalf, wHalf, hHalf),
    ];
    for(let entityId of this.entityIds)
    {
        const entity = this.tree.world.entitiesById[entityId];
        const rectangle = this.tree.rectangles[entityId];
        for(let child of this.children)
        {
            child.insert(entity, rectangle);
        }
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
        if(this.entityIds.size > this.tree.maxEntitiesPerNode && this.w / 2 >= this.tree.minNodeSideLength)
            this.split();
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
