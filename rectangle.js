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

Rectangle.boundingPoints = function(points)
{
    if(points == null || points.length <= 0)
        return new Rectangle();
    const xMin = points.min(o => o.x);
    const yMin = points.min(o => o.y);
    const xMax = points.max(o => o.x);
    const yMax = points.max(o => o.y);
    return new Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
};

Rectangle.boundingRectangles = function(rectangles)
{
    if(rectangles == null || rectangles.length <= 0)
        return new Rectangle();
    const xMin = rectangles.min(o => o.x);
    const yMin = rectangles.min(o => o.y);
    const xMax = rectangles.max(o => o.x + o.w);
    const yMax = rectangles.max(o => o.y + o.h);
    return new Rectangle(xMin, yMin, xMax - xMin, yMax - yMin);
};

Rectangle.boundingCircle = function(xCircle, yCircle, radiusCircle)
{
    return new Rectangle(xCircle - radiusCircle, yCircle - radiusCircle, radiusCircle * 2, radiusCircle * 2);
};

Rectangle.prototype.collidesRectangle = function(rectangle, xOffset=0, yOffset=0)
{
    return Rectangle.collide(this.x, this.y, this.w, this.h, rectangle.x + xOffset, rectangle.y + yOffset, rectangle.w, rectangle.h);
};

//https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
// The rectangle's (x, y) position is its top-left corner if it were not rotated,
// however the rectangle still rotates about its center (by "rectangleAngleRadians" radians)
Rectangle.prototype.collidesCircle = function(xCircle, yCircle, radius, rectangleAngleRadians=0, rectangleIsCentered=false)
{
    const circlePosition = rectangleAngleRadians === 0
        ? new Point(xCircle, yCircle)
        : new Point(xCircle, yCircle).rotate(-rectangleAngleRadians, rectangleIsCentered ? this : this.center);

    let xCircleDistance = Math.abs(circlePosition.x - (rectangleIsCentered ? this.x : this.x + this.w/2));
    let yCircleDistance = Math.abs(circlePosition.y - (rectangleIsCentered ? this.y : this.y + this.h/2));

    if (xCircleDistance > (this.w/2 + radius)) { return false; }
    if (yCircleDistance > (this.h/2 + radius)) { return false; }

    if (xCircleDistance <= (this.w/2)) { return true; }
    if (yCircleDistance <= (this.h/2)) { return true; }

    let cornerDistanceSq =
        (xCircleDistance - this.w/2) * (xCircleDistance - this.w/2) +
        (yCircleDistance - this.h/2) * (yCircleDistance - this.h/2);

    return cornerDistanceSq <= (radius * radius);
};

// World.prototype.debugDrawRectangleCollidesCircleTopLeft = function()
// {
//     const angle = this.world.millisecondsSinceStart / 5000 * Utils.TAU;
//     const rectangle = new Rectangle(600, 450, 150, 100);
//     const rectanglePosition = this.world.camera.add(rectangle);
//     Draw.rectangle(this.world, rectanglePosition.x, rectanglePosition.y, rectangle.w, rectangle.h, new Color(255, 0, 0));
//     Draw.rectangleRotated(this.world, rectanglePosition.x + rectangle.w/2, rectanglePosition.y + rectangle.h/2, rectangle.w, rectangle.h, new Color(0, 255, 0), angle);
//
//     const circlePosition = this.world.camera.add(this.world.mouse);
//     const circleRadius = 50;
//     const circleTranslatedPosition = circlePosition.rotate(-angle, rectanglePosition.add(new Point(rectangle.w/2, rectangle.h/2)));
//
//     Draw.circle(this.world, rectanglePosition.x, rectanglePosition.y, 6, new Color(255, 255, 0));
//
//     const circleLocal = circlePosition.subtract(this.world.camera);
//     const collides = rectangle.collidesCircle(circleLocal.x, circleLocal.y, circleRadius, angle, false);
//     Draw.circle(this.world, circlePosition.x, circlePosition.y, circleRadius, collides ? new Color(255, 255, 255) : new Color(0, 0, 255));
//     Draw.circle(this.world, circleTranslatedPosition.x, circleTranslatedPosition.y, circleRadius, collides ? new Color(255, 200, 255) : new Color(255, 0, 255));
// };
//
// World.prototype.debugDrawRectangleCollidesCircleCentered = function()
// {
//     const angle = this.world.millisecondsSinceStart / 5000 * Utils.TAU;
//     const rectangle = new Rectangle(600, 450, 150, 100);
//     const rectanglePosition = this.world.camera.add(rectangle);
//     Draw.rectangle(this.world, rectanglePosition.x - rectangle.w/2, rectanglePosition.y - rectangle.h/2, rectangle.w, rectangle.h, new Color(255, 0, 0));
//     Draw.rectangleRotated(this.world, rectanglePosition.x, rectanglePosition.y, rectangle.w, rectangle.h, new Color(0, 255, 0), angle);
//
//     const circlePosition = this.world.camera.add(this.world.mouse);
//     const circleRadius = 50;
//     const circleTranslatedPosition = circlePosition.rotate(-angle, rectanglePosition);
//
//     Draw.circle(this.world, rectanglePosition.x, rectanglePosition.y, 6, new Color(255, 255, 0));
//
//     const circleLocal = circlePosition.subtract(this.world.camera);
//     const collides = rectangle.collidesCircle(circleLocal.x, circleLocal.y, circleRadius, angle, true);
//     Draw.circle(this.world, circlePosition.x, circlePosition.y, circleRadius, collides ? new Color(255, 255, 255) : new Color(0, 0, 255));
//     Draw.circle(this.world, circleTranslatedPosition.x, circleTranslatedPosition.y, circleRadius, collides ? new Color(255, 200, 255) : new Color(255, 0, 255));
// };

Rectangle.prototype.corners = function()
{
    return [
        new Point(this.x, this.y),
        new Point(this.x, this.y + this.h),
        new Point(this.x + this.w, this.y + this.h),
        new Point(this.x + this.w, this.y)
    ];
};