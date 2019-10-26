function Camera(_world, _x=0, _y=0)
{
    this.world = _world;
    Rectangle.call(this,
        _x, _y, 0, 0);
}
Camera.prototype = Object.create(Rectangle.prototype);
Camera.prototype.constructor = Camera;

Camera.prototype.start = function()
{
    this.update();
};

Camera.prototype.update = function()
{
    this.w = this.world.canvas.width;
    this.h = this.world.canvas.height;
};