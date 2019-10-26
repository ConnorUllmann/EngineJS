function Actor(x, y, world, width, height)
{
    Entity.call(this, x, y, world);
    this.width = width;
    this.height = height;
    
    this.draggable = true;
    this.mouseOffset = new Point();
}
Entity.parents(Actor);

Actor.prototype.update = function()
{
    if(this.draggable)
        this.updateMouseDrag();
};

Actor.prototype.render = function()
{
    if(this.world.debug)
        Draw.rectangleOutline(this.world, this.xLeft(), this.yTop(), this.width, this.height, "#f00");
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

Actor.prototype.xLeft = function() { return this.x - this.width/2; };
Actor.prototype.xRight = function() { return this.x + this.width/2; };
Actor.prototype.yTop = function() { return this.y - this.height/2; };
Actor.prototype.yBottom = function() { return this.y + this.height/2; };
Actor.prototype.isMouseHovering = function() { return this.world.mouse.x >= this.xLeft() && this.world.mouse.y >= this.yTop() && this.world.mouse.x < this.xRight() && this.world.mouse.y < this.yBottom() };
Actor.prototype.distanceSqToMouse = function() { return this.world.mouse.distanceSqTo(this); };
Actor.prototype.collides = function(actor)
{
    return Rectangle.collide(this.xLeft(), this.yTop(), this.width, this.height, actor.xLeft(), actor.yTop(), actor.width, actor.height);
};