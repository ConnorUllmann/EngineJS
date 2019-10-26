function Range(_start, _end)
{
	if (_start > _end)
	{
		let temp = _start;
		_start = _end;
		_end = temp;
	}

	this.start = _start;
	this.end = _end;
	this.valid = _start != _end;
}

Range.prototype.collides = function(range)
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
};

function Ranges()
{
	this.ranges = [];
}

Ranges.prototype._handleCollisions = function()
{
	this.ranges.sort(function(a, b) { return a.start - b.start; });
	for(let i = 0; i < this.ranges.length-1; i++)
	{
		let range = this.ranges[i];
		let nextRange = this.ranges[i + 1];

		let collides = range.collides(nextRange);
		if (collides || range.end == nextRange.start)
		{
			this.ranges[i] = new Range(Math.min(range.start, nextRange.start), Math.max(range.end, nextRange.end));
			this.ranges.removeAt(i + 1);
			i--;
		}
	}
};

Ranges.prototype.add = function(start, length)
{
	if (length <= 0)
		return;
	this.ranges.push(new Range(start, start + length));
	this._handleCollisions();
};

Ranges.prototype.collides = function(start, length)
{
	if(length <= 0)
		return false;
	for(let i = 0; i < this.ranges.length; i++)
	{
		if(this.ranges[i].collides(new Range(start, start + length)))
			return true;
	}
	return false;
};