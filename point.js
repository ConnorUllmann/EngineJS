function Point(_x=0, _y=0)
{
	this.x = _x;
	this.y = _y;
}

Point.create = function(length, angleRadians)
{
	return new Point(length * Math.cos(angleRadians), length * Math.sin(angleRadians));
};

Point.prototype.clone = function()
{
	return new Point(this.x, this.y);
};

Point.prototype.toString = function()
{
    return JSON.stringify(
    {
        x: this.x.toFixed(1),
        y: this.y.toFixed(1)
    });
};

Point.prototype.lengthSq = function()
{
	return this.x * this.x + this.y * this.y;
};
Point.prototype.dot = function(b)
{
	return this.x * b.x + this.y * b.y;
};
Point.prototype.add = function(b)
{
	return new Point(this.x+b.x, this.y+b.y);
};
Point.prototype.subtract = function(b)
{
	return new Point(this.x-b.x, this.y-b.y);
};
Point.prototype.proj = function(b)
{
	return b.scale(this.dot(b) / Math.max(b.lengthSq(), 0.000001));
};
Point.prototype.normalized = function(length=1)
{
	if((this.x === 0 && this.y === 0) || length === 0)
		return new Point(0, 0);
	let temp = length / Math.sqrt(this.lengthSq());
	return new Point(this.x * temp, this.y * temp);
};
Point.prototype.scale = function(scale)
{
	return this.normalized(scale * Math.sqrt(this.lengthSq()));
};
Point.prototype.midpoint = function(b)
{
    return new Point((this.x + b.x) / 2, (this.y + b.y) / 2);
};
Point.midpoint = function(points)
{
    if(points == null || points.length <= 0)
        return null;
    const sum = new Point();
    points.forEach(point => { sum.x += point.x; sum.y += point.y; });
    return sum.scale(1/points.length);
};
Point.prototype.distanceSqTo = function(b)
{
    return Utils.distanceSq(this.x, this.y, b.x, b.y);
};
Point.prototype.distanceTo = function(b)
{
    return Utils.distance(this.x, this.y, b.x, b.y);
};

Point.prototype.angle = function()
{
	return Math.atan2(this.y, this.x);
};

Point.prototype.reflect = function(normal, origin=null)
{
	if(origin == null)
    {
        const reflectionPoint = this.closestPointOnLine(new Point(), normal);
        return reflectionPoint.subtract(this).scale(2).add(this);
    }

	const reflectionPoint = this.closestPointOnLine(origin, origin.add(normal));
	return reflectionPoint.subtract(this).scale(2).add(this);
};

// Point.prototype.insideLineSegmentIfColinear = function(a, b)
// {
// 	let ap = point.subtract(a);
// 	let ab = b.subtract(a);
// 	let v = ap.dot(ab);
// 	return v >= 0 && v <= ab.lengthSq();
// };

Point.prototype.closestPointOnLineSegment = function(a, b)
{
    let ab = b.subtract(a);
    let ret = this.subtract(a).proj(ab).add(a);
    let r = ret.subtract(a).dot(ab);
    if(r < 0) return a;
    if(r > ab.lengthSq()) return b;
    return ret;
};

Point.prototype.closestPointOnLine = function(a, b)
{
    return this.subtract(a).proj(b.subtract(a)).add(a);
};

Point.prototype.isInCircle = function(circlePosition, circleRadius)
{
    return this.distanceSqTo(circlePosition) <= circleRadius * circleRadius;
};

// Returns how much this point (as a vector) faces in the direction of the given point (as a vector)
// -1 = this point faces opposite the direction of argument "point"
// 0 = this point faces perpendicular to the direction of argument "point"
// 1 = this point faces the exact same direction as argument "point"
Point.prototype.towardness = function(point)
{
    return this.normalized().dot(point.normalized());
};

// t = 0 = this point
// t = 0.5 = midpoint between this point and the argument "point:
// t = 1 = the argument "point"
Point.prototype.lerp = function(point, t)
{
    return new Point((point.x - this.x) * t + this.x, (point.y - this.y) * t + this.y);
};

Point.linesIntersection = function(firstLineA, firstLineB, secondLineA, secondLineB, asSegments = true)
{
    const yFirstLineDiff = firstLineB.y - firstLineA.y;
    const xFirstLineDiff = firstLineA.x - firstLineB.x;
    const cFirst = firstLineB.x * firstLineA.y - firstLineA.x * firstLineB.y;
    const ySecondLineDiff = secondLineB.y - secondLineA.y;
    const xSecondLineDiff = secondLineA.x - secondLineB.x;
    const cSecond = secondLineB.x * secondLineA.y - secondLineA.x * secondLineB.y;

    const denominator = yFirstLineDiff * xSecondLineDiff - ySecondLineDiff * xFirstLineDiff;
    if (denominator === 0)
        return null;
    const intersectionPoint = new Point(
    	(xFirstLineDiff * cSecond - xSecondLineDiff * cFirst) / denominator,
		(ySecondLineDiff * cFirst - yFirstLineDiff * cSecond) / denominator);
    return asSegments && (
    	Math.pow(intersectionPoint.x - firstLineB.x, 2) + Math.pow(intersectionPoint.y - firstLineB.y, 2) > Math.pow(firstLineA.x - firstLineB.x, 2) + Math.pow(firstLineA.y - firstLineB.y, 2) ||
		Math.pow(intersectionPoint.x - firstLineA.x, 2) + Math.pow(intersectionPoint.y - firstLineA.y, 2) > Math.pow(firstLineA.x - firstLineB.x, 2) + Math.pow(firstLineA.y - firstLineB.y, 2) ||
		Math.pow(intersectionPoint.x - secondLineB.x, 2) + Math.pow(intersectionPoint.y - secondLineB.y, 2) > Math.pow(secondLineA.x - secondLineB.x, 2) + Math.pow(secondLineA.y - secondLineB.y, 2) ||
		Math.pow(intersectionPoint.x - secondLineA.x, 2) + Math.pow(intersectionPoint.y - secondLineA.y, 2) > Math.pow(secondLineA.x - secondLineB.x, 2) + Math.pow(secondLineA.y - secondLineB.y, 2))
    	? null
		: intersectionPoint;
};

Point.prototype.closest = function(points)
{
	return points.minOf(o => this.distanceSqTo(o));
};

Point.prototype.leftOfLine = function(a, b)
{
    return Math.sign((b.x - a.x) * (this.y - a.y) - (b.y - a.y) * (this.x - a.x)) > 0;
};

Point.prototype.rotate = function(angleRadians, center=null)
{
    const x = this.x - (center ? center.x : 0);
    const y = this.y - (center ? center.y : 0);
    return new Point(
        (center ? center.x : 0) + x * Math.cos(angleRadians) - y * Math.sin(angleRadians),
        (center ? center.y : 0) + y * Math.cos(angleRadians) + x * Math.sin(angleRadians)
    );
};

// returns a version of this point which is flipped over (rotated 180 degrees around) the given point
// (or the origin if none is provided). Provided because it is faster than using rotate/reflect.
Point.prototype.flip = function(center=null)
{
    return center != null
		? new Point(2 * center.x - this.x, 2 * center.y - this.y)
		: this.negative();
};

// same as rotating a vector 180 degrees
Point.prototype.negative = function()
{
    return new Point(-this.x, -this.y);
};

// rotates the point randomly in the range given (about the origin)
Point.prototype.wiggle = function(angleRangeMax)
{
    return this.rotate(angleRangeMax * (Math.random() - 0.5));
};
