function Mouse(world)
{
    this.world = world;
    this.x = 0;
    this.y = 0;
    this.leftReleased = false;
    this.leftPressed = false;
    this.rightReleased = false;
    this.rightPressed = false;
    this.leftDown = false;
    this.rightDown = false;
    this.focus = false;
    this.scrollY = 0;
    this.scale = 1;
    this.touchscreen = "ontouchstart" in document.documentElement;
}


Mouse.prototype.onCanvas = function()
{
	return this.focus &&
        this.x != null && this.y != null &&
        this.x >= 0 && this.x < this.world.canvas.width &&
        this.y >= 0 && this.y < this.world.canvas.height;
};

Mouse.prototype.start = function()
{
    let mouse = this;
    this.world.canvas.addEventListener('mousemove', function(evt)
	{
        let rect = mouse.world.canvas.getBoundingClientRect();
		this.x = (evt.clientX - rect.left) * this.scale;
		this.y = (evt.clientY - rect.top) * this.scale;
	}, false);

    if(this.touchscreen)
    {
        document.body.addEventListener("touchstart", function(ev)
        {
            mouse.leftMouseDownEvent();
        });
        document.body.addEventListener("touchend", function(ev)
        {
            mouse.leftMouseUpEvent();
        });
    }
    
    document.body.addEventListener("mouseup", function(ev)
	{
        if(ev.button === 0) //Left
        {
            mouse.leftMouseUpEvent();
        }
        else if(ev.button === 2) //Right
        {
            mouse.rightReleased = true;
            mouse.rightDown = false;
        }
	});
    document.body.addEventListener("mousedown", function(ev)
	{
        if(ev.button === 0) //Left
        {
            mouse.leftMouseDownEvent();
        }
        else if(ev.button === 2) //Right
        {
            mouse.rightPressed = true;
            mouse.rightDown = true;
        }
	});
    this.world.canvas.addEventListener ("mouseout", function()
    {
        mouse.focus = false;
    });
    this.world.canvas.addEventListener ("mouseover", function()
    {
        mouse.focus = true;
    });
    this.world.canvas.addEventListener('wheel', function(e)
    {
        mouse.scrollY = e.deltaY;
    });
    this.update();
};

Mouse.prototype.leftMouseDownEvent = function()
{
    this.leftPressed = true;
    this.leftDown = true;
};

Mouse.prototype.leftMouseUpEvent = function()
{
    this.leftReleased = true;
    this.leftDown = false;
};

Mouse.prototype.update = function()
{
    this.scale = this.world.canvas.width / this.world.canvas.clientWidth;
    this.leftReleased = false;
    this.leftPressed = false;
    this.rightReleased = false;
    this.rightPressed = false;
    this.scrollY = 0;
};