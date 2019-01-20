function Mouse() {}

Mouse.x = 0;
Mouse.y = 0;
Mouse.leftReleased = false;
Mouse.leftPressed = false;
Mouse.rightReleased = false;
Mouse.rightPressed = false;
Mouse.leftDown = false;
Mouse.rightDown = false;
Mouse.focus = false;
Mouse.scrollY = 0;
Mouse.scale = 1;
Mouse.touchscreen = "ontouchstart" in document.documentElement;

Mouse.onCanvas = function()
{
	return Mouse.focus &&
        Mouse.x != null && Mouse.y != null &&
		Mouse.x >= 0 && Mouse.x < canvas.width &&
		Mouse.y >= 0 && Mouse.y < canvas.height;
};

Mouse.start = function(_canvas)
{
    _canvas.addEventListener('mousemove', function(evt)
	{
        let rect = _canvas.getBoundingClientRect();
		Mouse.x = (evt.clientX - rect.left) * Mouse.scale;
		Mouse.y = (evt.clientY - rect.top) * Mouse.scale;
	}, false);
    document.body.addEventListener("mouseup", function(ev)
	{
        if(ev.button === 0) //Left
        {
            Mouse.leftReleased = true;
            Mouse.leftDown = false;
        }
        else if(ev.button === 2) //Right
        {
            Mouse.rightReleased = true;
            Mouse.rightDown = false;
        }
	});
    document.body.addEventListener("mousedown", function(ev)
	{
        if(ev.button === 0) //Left
        {
            Mouse.leftPressed = true;
            Mouse.leftDown = true;
        }
        else if(ev.button === 2) //Right
        {
            Mouse.rightPressed = true;
            Mouse.rightDown = true;
        }
	});
    _canvas.addEventListener ("mouseout", function()
    {
        Mouse.focus = false;
    });
    _canvas.addEventListener ("mouseover", function()
    {
        Mouse.focus = true;
    });
    _canvas.addEventListener('wheel', function(e)
    {
        Mouse.scrollY = e.deltaY;
    });
    Mouse.update();
};

Mouse.update = function()
{
    Mouse.scale = canvas.width / canvas.clientWidth;
    Mouse.leftReleased = false;
    Mouse.leftPressed = false;
    Mouse.rightReleased = false;
    Mouse.rightPressed = false;
    Mouse.scrollY = 0;
};