// Usage:
//
// function ExampleEntity(x, y)
// {
//     Entity.call(this, x, y);
// }
// ExampleEntity.prototype = Object.create(Entity.prototype);
// ExampleEntity.prototype.constructor = ExampleEntity;
// ExampleEntity.prototype.update = function()
// {
//	   // Call update function of a parent
//     Entity.prototype.update.call(this);
// }

function Entity(_x, _y, _world=null)
{	
	this.x = _x;
	this.y = _y;
	this.depth = 0;
	this.active = true;
	this.visible = true;

    this.id = null;
    this.world = null;

	if(_world != null)
        _world._addEntity(this);
}

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