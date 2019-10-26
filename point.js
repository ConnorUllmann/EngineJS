function Point(_x=0, _y=0)
{
	this.x = _x;
	this.y = _y;
}

Point.create = function(length, angleRadians)
{
	return new Point(length * Math.cos(angleRadians), length * Math.sin(angleRadians));
};

Point.prototype.toString = function() { return "(" + this.x + "," + this.y + ")"; };

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
	let dot = this.dot(b);
	let blen2 = b.lengthSq();
	let d = dot / Math.max(blen2, 0.000001);
	return new Point(d * b.x, d * b.y);
};
Point.prototype.normalized = function(length=1)
{
	if(this.x === 0 && this.y === 0)
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

Point.prototype.closest = function(points)
{
	return points.minOf(o => this.subtract(o).lengthSq());
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
