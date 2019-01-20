function Timer(rate=1)
{
    this.rate = rate; // multiple for the value used to update the timer

    this.value = 0; // always in the range [0, 1]
    this.triggered = false; // whether or not the timer crossed the 1 threshold this frame
    this.started = false; //whether or not the timer has been updated yet;
}

Timer.prototype.reset = function()
{
    this.value = 0;
    this.triggered = false;
    this.started = false;
};

Timer.prototype.update = function()
{
    let nextValue = this.getNextValueRaw();
    this.triggered = nextValue >= 1;
    this.value = this.cleanValue(nextValue);
    this.started = true;
};

Timer.prototype.getNextValueRaw = function()
{
    return this.value + Entity.delta / 1000 * this.rate;
};

Timer.prototype.cleanValue = function(rawValue)
{
    return Math.max(0, Math.min(1, rawValue));
};

Timer.prototype.isFinished = function()
{
    return this.value >= 1;
};

Timer.prototype.toRange = function(min, max)
{
    return (max - min) * this.value + min;
};


function ZoomTimer(rate)
{
    Timer.call(rate);
}
ZoomTimer.prototype = Object.create(Timer.prototype);
ZoomTimer.prototype.constructor = ZoomTimer;

ZoomTimer.prototype.getNextValueRaw = function()
{
    return this.value + (1 - this.value) * this.rate;
};

ZoomTimer.prototype.isFinished = function()
{
    return this.value >= 0.999;
};


function LoopTimer(rate)
{
    Timer.call(this, rate);
}
LoopTimer.prototype = Object.create(Timer.prototype);
LoopTimer.prototype.constructor = LoopTimer;

LoopTimer.prototype.cleanValue = function(rawValue)
{
    return rawValue % 1;
};

LoopTimer.prototype.isFinished = function()
{
    return false;
};