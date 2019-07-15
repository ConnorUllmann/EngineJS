function Timer(seconds=1)
{
    this.seconds = seconds;
    this.value = 0; // always in the range [0, 1]
    this.triggered = false; // whether or not the timer crossed the 1 threshold this frame
    this.started = false; //whether or not the timer has been updated yet
    this.paused = false;
}

Timer.prototype.reset = function(seconds=null)
{
    this.seconds = seconds != null ? seconds : this.seconds;
    this.value = this.seconds === 0 ? 1 : 0;
    this.triggered = false;
    this.started = false;
    this.paused = false;
};

Timer.prototype.update = function()
{
    if(this.paused)
        return;

    let nextValue = this.getNextValueRaw();
    this.triggered = nextValue >= 1;
    this.value = this.cleanValue(nextValue);
    this.started = true;
};

Timer.prototype.getNextValueRaw = function()
{
    if(this.seconds === 0)
        return 1;
    //TODO: can't use a global world reference here...but don't want to pass it in either :(
    return this.value + world.delta / 1000 / this.seconds;
};

Timer.prototype.cleanValue = function(rawValue)
{
    return Utils.clamp(rawValue, 0, 1);
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
    Timer.call(this, rate);
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


function LoopTimer(seconds)
{
    Timer.call(this, seconds);
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