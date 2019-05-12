function Point(_x, _y)
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


Point.prototype.insideLineSegmentIfColinear = function(a, b)
{
	let ap = point.subtract(a);
	let ab = b.subtract(a);
	let v = ap.dot(ab);
	return v >= 0 && v <= ab.lengthSq();
};
Point.prototype.closestPointOnLineSegment = function(a, b)
{
	let ab = b.subtract(a);
	let ret = this.subtract(a).proj(ab).add(a);
	let r = ret.subtract(a).dot(ab);
	if(r < 0) return a;
	if(r > ab.lengthSq()) return b;
	return ret;
};
Point.prototype.closest = function(points)
{
	let minDistanceSq = null;
	let minPoint = null;
	points.forEach(o => {
        let distanceSq = this.subtract(o).lengthSq();
        if (minDistanceSq === null || distanceSq < minDistanceSq)
		{
            minDistanceSq = distanceSq;
            minPoint = o;
		}
	});
	return minPoint;
};