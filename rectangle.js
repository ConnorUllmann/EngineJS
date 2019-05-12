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

//https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
Rectangle.prototype.collidesCircle = function(xCircle, yCircle, radius)
{
    let xCircleDistance = Math.abs(xCircle - (this.x + this.w/2));
    let yCircleDistance = Math.abs(yCircle - (this.y + this.h/2));

    if (xCircleDistance > (this.w/2 + radius)) { return false; }
    if (yCircleDistance > (this.h/2 + radius)) { return false; }

    if (xCircleDistance <= (this.w/2)) { return true; }
    if (yCircleDistance <= (this.h/2)) { return true; }

    let cornerDistanceSq =
        (xCircleDistance - this.w/2) * (xCircleDistance - this.w/2) +
        (yCircleDistance - this.h/2) * (yCircleDistance - this.h/2);

    return cornerDistanceSq <= (radius * radius);
};