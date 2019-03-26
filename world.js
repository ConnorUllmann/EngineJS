function World()
{
    this.canvas = null;
    this.context = null;
    this.backgroundColor = "#ccc";
    this.camera = new Camera(0, 0);
    this.mouse = new Mouse(this);
    this.keyboard = new Keyboard(this);

    this.entities = [];
    this.entitiesToAdd = [];
    this.entitiesToDestroy = [];
    this.entityID = 0;

    this.delta = 0;
    this.firstUpdate = null;
    this.lastUpdate = Date.now();
}
World.prototype.generateID = function()
{
    return this.entityID++;
};
World.prototype.start = function(canvasId)
{
    this.canvas = document.getElementById(canvasId);
    if (this.canvas == null)
        throw "Canvas doesn't exist!";
    if(!this.canvas.getContext)
        throw "Cannot retrieve canvas context!";

    //Need the lambda or else this.render() will have the Window instance as "this" inside the function scope
    setInterval(() => this.render(), 16);

    this.context = this.canvas.getContext('2d');
    this.mouse.start();
    this.keyboard.start();
};
World.prototype.clearCanvas = function(color)
{
    if(color == null)
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return;
    }
    this.context.fillStyle = color.toString();
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};
World.prototype.render = function()
{
    this.updateAll();
    this.clearCanvas(this.backgroundColor);
    this.renderAll();
    this.mouse.update();
    this.keyboard.update();
};


World.prototype.sortByUpdateOrder = function()
{
    this.entities.sort(this.compareUpdateOrders);
};
World.prototype.updateAll = function()
{
    if(this.firstUpdate == null)
        this.firstUpdate = Date.now();

    this.updateDelta();

    //Add the new entities that are queued to be created.
    while(this.entitiesToAdd.length > 0)
    {
        let e = this.entitiesToAdd.shift();
        this.entities.push(e);
        e.added();
    }

    this.sortByUpdateOrder();

    //Update all entities.
    let entities = this.entities.filter(o => o.active);
    for(let i = 0; i < entities.length; i++)
        entities[i].update();
    for(let i = 0; i < entities.length; i++)
        entities[i].postUpdate();

    //Destroy entities that are queued to be destroyed.
    while(this.entitiesToDestroy.length > 0)
    {
        let e = this.entitiesToDestroy.pop();
        let ind = this.entities.indexOf(e);
        if(ind > -1)
        {
            this.entities.splice(ind, 1);
            e.removed();
        }
    }
};

World.prototype.renderAll = function()
{
    //Render all entities.
    this.sortByUpdateOrder();
    let entities = this.entities.filter(o => o.visible);
    for(let i = 0; i < entities.length; i++)
        entities[i].render();
};

World.prototype.destroyAll = function()
{
    for(let i = 0; i < this.entities.length; i++)
        this.entities[i].destroy();
};

World.prototype.compareUpdateOrders = function(a, b)
{
    if(a.depth === b.depth)
        return a.id - b.id;
    return a.depth - b.depth;
};

World.prototype.updateDelta = function()
{
    let now = Date.now();
    this.delta = now - this.lastUpdate;
    this.lastUpdate = now;
};

World.prototype.timeSinceStart = function()
{
    return Date.now() - this.firstUpdate;
};