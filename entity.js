// Usage:
//
// function ExampleEntity(x, y, world)
// {
//     Entity.call(this, x, y, world);
// }
// Entity.parents(ExampleEntity);
//
// ExampleEntity.prototype.update = function()
// {
//	   // Call update function of a parent
//     Entity.prototype.update.call(this);
// }

function Entity(_x, _y, _world=null)
{
	Point.call(this, _x, _y);
	this.x = _x;
	this.y = _y;
	this.depth = 0;
	this.active = true;
	this.visible = true;
	this.destroyed = false;
	this.class = this.constructor.name;

    this.id = null;
    this.world = null;
	this.addToWorld(_world);
}
Point.parents(Entity);

Entity.prototype.addToWorld = function(world)
{
    if(this.world)
    {
        console.error("Cannot add entity to world! It is already a part of another world.");
        return;
    }
    if(world)
        world._addEntity(this);
};

Entity.prototype.toString = function()
{
	return JSON.stringify(
	{
        class: this.class,
        id: this.id,
        x: this.x.toFixed(1),
        y: this.y.toFixed(1)
    });
};

Entity.prototype.added = function() //Triggered when this entity is added to the world.
{
};
Entity.prototype.removed = function() //Triggered when this entity is removed from the world.
{
};

Entity.prototype.destroy = function() //Call this to destroy this entity (queues it up for removal at the next available point).
{
	this.world._destroyEntity(this);
};

Entity.prototype.update = function()
{
};
Entity.prototype.postUpdate = function()
{
};
Entity.prototype.render = function()
{
};