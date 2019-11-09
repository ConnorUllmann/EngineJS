function Rectangle(x=0, y=0, w=0, h=0)
{
    Point.call(this, x, y);
    this.w = w;
    this.h = h;

    Object.defineProperty(this, 'xLeft', {
        get: function() { return this.x; },
        set: function(x) { this.x = x; }
    });
    Object.defineProperty(this, 'xRight', {
        get: function() { return this.x + this.w; },
        set: function(x) { this.x = x - this.w; }
    });
    Object.defineProperty(this, 'yTop', {
        get: function() { return this.y; },
        set: function(y) { this.y = y; }
    });
    Object.defineProperty(this, 'yBottom', {
        get: function() { return this.y + this.h; },
        set: function(y) { this.y = y - this.h; }
    });
    Object.defineProperty(this, 'xCenter', {
        get: function() { return this.x + this.w/2; },
        set: function(x) { this.x = x - this.w/2; }
    });
    Object.defineProperty(this, 'yCenter', {
        get: function() { return this.y + this.h/2; },
        set: function(y) { this.y = y - this.h/2; }
    });
    Object.defineProperty(this, 'center', {
        get: () => new Point(this.xCenter, this.yCenter),
        set: (point) => { this.x = point.x - this.w/2; this.y = point.y - this.h/2; }
    });
}
Point.parents(Rectangle);

Rectangle.prototype.collidesPoint = function(x, y)
{
    return x >= this.x &&
           y >= this.y &&
           x < this.x + this.w &&
           y < this.y + this.h;
};

Rectangle.collide = function(ax, ay, aw, ah, bx, by, bw, bh)
{
    return ax + aw > bx &&
           ay + ah > by &&
           ax < bx + bw &&
           ay < by + bh;
};

Rectangle.prototype.collidesRectangle = function(rectangle)
{
    return Rectangle.collide(this.x, this.y, this.w, this.h, rectangle.x, rectangle.y, rectangle.w, rectangle.h);
};

//https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
// The rectangle's (x, y) position is its top-left corner if it were not rotated,
// however the rectangle still rotates about its center (by "rectangleAngleRadians" radians)
Rectangle.prototype.collidesCircle = function(xCircle, yCircle, radius, rectangleAngleRadians=0)
{
    const circlePosition = rectangleAngleRadians === 0
        ? new Point(xCircle, yCircle)
        : new Point(xCircle, yCircle).rotate(-rectangleAngleRadians, this.center);

    let xCircleDistance = Math.abs(circlePosition.x - this.xCenter);
    let yCircleDistance = Math.abs(circlePosition.y - this.yCenter);

    if (xCircleDistance > (this.w/2 + radius)) { return false; }
    if (yCircleDistance > (this.h/2 + radius)) { return false; }

    if (xCircleDistance <= (this.w/2)) { return true; }
    if (yCircleDistance <= (this.h/2)) { return true; }

    let cornerDistanceSq =
        (xCircleDistance - this.w/2) * (xCircleDistance - this.w/2) +
        (yCircleDistance - this.h/2) * (yCircleDistance - this.h/2);

    return cornerDistanceSq <= (radius * radius);
};

Rectangle.prototype.corners = function()
{
    return [
        new Point(this.x, this.y),
        new Point(this.x, this.y + this.h),
        new Point(this.x + this.w, this.y + this.h),
        new Point(this.x + this.w, this.y)
    ];
};