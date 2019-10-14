function Actor(x, y, world, width, height)
{
    Entity.call(this, x, y, world);
    this.width = width;
    this.height = height;
    
    this.draggable = true;
    this.mouseOffset = new Point();
}
Actor.prototype = Object.create(Entity.prototype);
Actor.prototype.constructor = Actor;

Actor.prototype.update = function()
{
    if(this.draggable)
        this.updateMouseDrag();
};

Actor.prototype.render = function()
{
    if(this.world.debug)
        Draw.rectLines(this.world, this.getLeftX(), this.getTopY(), this.width, this.height, "#f00");
};

Actor.prototype.updateMouseDrag = function()
{
    if(this.isMouseHovering() && this.world.mouse.leftPressed)
    {
        this.mouseOffset.x = this.x - this.world.mouse.x;
        this.mouseOffset.y = this.y - this.world.mouse.y;
    }

    if(this.mouseOffset.lengthSq() > 0)
    {
        this.x = this.world.mouse.x + this.mouseOffset.x;
        this.y = this.world.mouse.y + this.mouseOffset.y;
    }

    if(this.world.mouse.leftReleased)
    {
        this.mouseOffset.x = 0;
        this.mouseOffset.y = 0;
    }
};

Actor.prototype.getLeftX = function() { return this.x - this.width/2; };
Actor.prototype.getRightX = function() { return this.x + this.width/2; };
Actor.prototype.getTopY = function() { return this.y - this.height/2; };
Actor.prototype.getBottomY = function() { return this.y + this.height/2; };
Actor.prototype.isMouseHovering = function() { return this.world.mouse.x >= this.getLeftX() && this.world.mouse.y >= this.getTopY() && this.world.mouse.x < this.getRightX() && this.world.mouse.y < this.getBottomY() };
Actor.prototype.distanceSqToMouse = function() { return this.world.mouse.distanceSqTo(this); };
Actor.prototype.collides = function(actor)
{
    return Rectangle.collide(this.getLeftX(), this.getTopY(), this.width, this.height, actor.getLeftX(), actor.getTopY(), actor.width, actor.height);
};