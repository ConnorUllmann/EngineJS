function Point(_x, _y)
{
	this.x = _x;
	this.y = _y;
}

Point.prototype.lengthSq = function()
{
	return this.x * this.x + this.y * this.y;
}
Point.prototype.dot = function(b)
{
	return this.x * b.x + this.y * b.y;
}
Point.prototype.add = function(b)
{
	return new Point(this.x+b.x, this.y+b.y);
}
Point.prototype.subtract = function(b)
{
	return new Point(this.x-b.x, this.y-b.y);
}
Point.prototype.proj = function(b)
{
	var dot = this.dot(b);
	var blen2 = b.lengthSq();
	var d = dot / Math.max(blen2, 0.000001);
	return new Point(d * b.x, d * b.y);
}


Point.prototype.insideLineSegmentIfColinear = function(a, b)
{
	var ap = point.subtract(a);
	var ab = b.subtract(a);
	var v = ap.dot(ab);
	return v >= 0 && v <= ab.lengthSq();
}
Point.prototype.closestPointOnLineSegment = function(a, b)
{
	var ab = b.subtract(a);
	var ret = this.subtract(a).proj(ab).add(a);
	var r = ret.subtract(a).dot(ab);
	if(r < 0) return a;
	if(r > ab.lengthSq()) return b;
	return ret;
}