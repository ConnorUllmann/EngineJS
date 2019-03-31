function Camera(_x, _y)
{
    Point.call(this, _x, _y);
}

Camera.prototype = Object.create(Point.prototype);
Camera.prototype.constructor = Camera;