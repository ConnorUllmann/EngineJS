function Circle(x=0, y=0, radius=0)
{
    Point.call(this, x, y);
    this.radius = radius;

    Object.defineProperty(this, 'diameter', {
        get: () => this.radius * 2,
        set: (diameter) => this.radius = diameter / 2
    });
    Object.defineProperty(this, 'area', {
        get: () => Math.PI * this.radius * this.radius,
        set: (area) => this.radius = Math.sqrt(area / Math.PI)
    });
    Object.defineProperty(this, 'circumference', {
        get: () => Utils.TAU * this.radius,
        set: (circumference) => this.radius = circumference / Utils.TAU
    });

}
Point.parents(Circle);

Circle.prototype.isInCircle = function(circle)
{
    return Utils.distance(this.x, this.y, circle.x, circle.y) + this.radius <= circle.radius;
};

Circle.prototype.collidesCircle = function(circle)
{
    return Utils.distanceSq(this.x, this.y, circle.x, circle.y) < (this.radius + circle.radius) * (this.radius + circle.radius);
};

Circle.prototype.collidesSegment = function(segmentPointA, segmentPointB)
{
    return this.closestPointOnLineSegment(segmentPointA, segmentPointB).isInCircle(this, this.radius);
};