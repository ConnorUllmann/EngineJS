function Actor(x, y, world, width, height)
{
    Entity.call(this, x, y, world);
    this.boundingBox = new Rectangle(-width/2, -height/2, width, height);
    Object.defineProperty(this, 'width', {
        get: () => this.boundingBox.w,
        set: (w) => this.boundingBox.w = w
    });
    Object.defineProperty(this, 'height', {
        get: () => this.boundingBox.h,
        set: (h) => this.boundingBox.h = h
    });

    this.canMove = true;
    this.draggable = false;
    this.mouseOffset = new Point();

    this.gravity = 0;
    this.friction = 1;

    //must be reset every frame as it is reset to the gravity vector after each physics update
    this.acceleration = new Point(0, this.gravity);
    this.velocity = new Point();

    this.xVelocityMin = null;
    this.xVelocityMax = null;
    this.yVelocityMin = null;
    this.yVelocityMax = null;

    Object.defineProperty(this, 'xLeft', {
        get: () => this.x + this.boundingBox.xLeft,
        set: (x) => this.x = x - this.boundingBox.xLeft
    });
    Object.defineProperty(this, 'xRight', {
        get: () => this.x + this.boundingBox.xRight,
        set: (x) => this.x = x - this.boundingBox.xRight
    });
    Object.defineProperty(this, 'yTop', {
        get: () => this.y + this.boundingBox.yTop,
        set: (y) => this.y = y - this.boundingBox.yTop
    });
    Object.defineProperty(this, 'yBottom', {
        get: () => this.y + this.boundingBox.yBottom,
        set: (y) => this.y = y - this.boundingBox.yBottom
    });
}
Entity.parents(Actor);

Actor.prototype.postUpdate = function()
{
    if(!this.canMove)
        return;

    this.velocity = this.velocity.add(this.acceleration.scale(this.world.delta))
        .scale(this.friction);

    this.velocity.x = Utils.clamp(this.velocity.x, this.xVelocityMin, this.xVelocityMax);
    this.velocity.y = Utils.clamp(this.velocity.y, this.yVelocityMin, this.yVelocityMax);

    const position = this.add(this.velocity.scale(this.world.delta));
    this.x = position.x;
    this.y = position.y;

    if (this.draggable)
        this.updateMouseDrag();

    this.acceleration.x = 0;
    this.acceleration.y = this.gravity;
};

Actor.prototype.render = function()
{
    if(this.world.debug)
        Draw.rectangleOutline(this.world, this.xLeft, this.yTop, this.width, this.height, "#f00");
};

Actor.prototype.updateMouseDrag = function()
{
    if(this.isMouseHovering() && this.world.mouse.leftPressed)
    {
        this.mouseOffset.x = this.x - (this.world.camera.x + this.world.mouse.x);
        this.mouseOffset.y = this.y - (this.world.camera.y + this.world.mouse.y);
    }

    if(this.mouseOffset.lengthSq() > 0)
    {
        this.x = this.world.camera.x + this.world.mouse.x + this.mouseOffset.x;
        this.y = this.world.camera.y + this.world.mouse.y + this.mouseOffset.y;
    }

    if(this.world.mouse.leftReleased)
    {
        this.mouseOffset.x = 0;
        this.mouseOffset.y = 0;
    }
};

Actor.prototype.isMouseHovering = function()
{
    return this.world.camera.x + this.world.mouse.x >= this.xLeft &&
        this.world.camera.y + this.world.mouse.y >= this.yTop &&
        this.world.camera.x + this.world.mouse.x < this.xRight &&
        this.world.camera.y + this.world.mouse.y < this.yBottom;
};

Actor.prototype.distanceSqToMouse = function() { return this.world.camera.add(this.world.mouse).distanceSqTo(this); };

Actor.prototype.collides = function(actor)
{
    return this.active &&
        actor.active &&
        Rectangle.collide(this.xLeft, this.yTop, this.width, this.height, actor.xLeft, actor.yTop, actor.width, actor.height);
};

// Returns true if the bounding box of this actor is visible on the screen
Actor.prototype.isVisibleOnScreen = function()
{
    return this.world.camera.collidesRectangle(this.boundingBox, this.x, this.y);
};