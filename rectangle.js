function Rectangle(x=0, y=0, w=0, h=0)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

Rectangle.prototype.collidesPoint = function(x, y)
{
    return x >= this.x &&
           y >= this.y &&
           x < this.x + this.w &&
           y < this.y + this.h;
};

Rectangle.prototype.collidesRectangle = function(rectangle)
{
    return this.x + this.w > rectangle.x &&
           this.y + this.h > rectangle.y &&
           this.x < rectangle.x + rectangle.w &&
           this.y < rectangle.y + rectangle.h;
};