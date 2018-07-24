function Range(_start, _end)
{
	if (_start > _end)
	{
		var temp = _start;
		_start = _end;
		_end = temp;
	}

	this.start = _start;
	this.end = _end;
	this.valid = _start != _end;
}

Range.prototype.Collides = function(range)
{
	if (!this.valid || !range.valid)
		return false;

	if (this.start < range.start)
	{
		if (this.end > range.start)
			return true;
	}
	else
	{
		if (this.start < range.end)
			return true;
	}
	return false;
}

function Ranges()
{
	this.ranges = [];
}

Ranges.prototype.handleCollisions = function()
{
	this.ranges.sort(function(a, b) { return a.start - b.start; });
	for(var i = 0; i < this.ranges.length-1; i++)
	{
		var range = this.ranges[i];
		var nextRange = this.ranges[i + 1];

		var collides = range.Collides(nextRange);
		if (collides || range.end == nextRange.start)
		{
			this.ranges[i] = new Range(Math.min(range.start, nextRange.start), Math.max(range.end, nextRange.end));
			this.ranges.removeAt(i + 1);
			i--;
			continue;
		}
	}
}

Ranges.prototype.Add = function(start, length)
{
	if (length <= 0)
		return;
	this.ranges.push(new Range(start, start + length));
	this.handleCollisions();
}

Ranges.prototype.Collides = function(start, length)
{
	if(length <= 0)
		return false;
	for(var i = 0; i < this.ranges.length; i++)
	{
		if(this.ranges[i].Collides(new Range(start, start + length)))
			return true;
	}
	return false;
}