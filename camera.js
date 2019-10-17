function Camera(_x=0, _y=0)
{
    Point.call(this, _x, _y);
}
Camera.prototype = Object.create(Point.prototype);
Camera.prototype.constructor = Camera;