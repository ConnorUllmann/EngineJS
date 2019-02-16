Entity.entities = [];
Entity.toAdd = [];
Entity.toDestroy = [];
Entity.ID = 0;

// // To inherit:
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

function Entity(_x, _y)
{	
	this.x = _x;
	this.y = _y;
	this.depth = 0;
	this.id = Entity.generateID();
	this.active = true;
	this.visible = true;
	Entity.toAdd.push(this);
}
Entity.generateID = function()
{
	return Entity.ID++;
};

Entity.prototype.added = function() //Triggered when this entity is added to the scene.
{
};
Entity.prototype.removed = function() //Triggered when this entity is removed from the scene.
{
};

Entity.prototype.destroy = function() //Call this to destroy this entity (queues it up for removal at the next available point).
{
	Entity.toDestroy.push(this);
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
Entity.compareUpdateOrders = function(a, b)
{
	if(a.depth == b.depth)
		return a.id - b.id;
	return a.depth - b.depth;
}
Entity.sortByUpdateOrder = function()
{
	Entity.entities.sort(Entity.compareUpdateOrders);
}
Entity.updateAll = function()
{
	if(Entity.firstUpdate == null)
		Entity.firstUpdate = Date.now();

	Entity.updateDelta();

	//Add the new entities that are queued to be created.
	while(Entity.toAdd.length > 0)
	{
		let e = Entity.toAdd.shift();
		Entity.entities.push(e);
		e.added();
	}

	Entity.sortByUpdateOrder();
	
	//Update all entities.
	let entities = Entity.entities.filter(o => o.active);
	for(let i = 0; i < entities.length; i++)
		entities[i].update();
	for(let i = 0; i < entities.length; i++)
        entities[i].postUpdate();
	
	//Destroy entities that are queued to be destroyed.
	while(Entity.toDestroy.length > 0)
	{
		let e = Entity.toDestroy.pop();
		let ind = Entity.entities.indexOf(e);
		if(ind > -1)
		{
			Entity.entities.splice(ind, 1);
			e.removed();
		}
	}
};

Entity.renderAll = function()
{
	//Render all entities.
	Entity.sortByUpdateOrder();
	for(let i = 0; i < Entity.entities.length; i++)
	{
		if(Entity.entities[i].visible)
			Entity.entities[i].render();
	}
};

Entity.destroyAll = function()
{
	for(let i = 0; i < Entity.entities.length; i++)
	{
		Entity.entities[i].destroy();
	}
};

Entity.delta = 0;
Entity.lastUpdate = Date.now();
Entity.updateDelta = function()
{
	let now = Date.now();
    Entity.delta = now - Entity.lastUpdate;
    Entity.lastUpdate = now;
}
Entity.timeSinceStart = function() { return Date.now() - Entity.firstUpdate; }