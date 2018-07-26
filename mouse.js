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

Mouse.onCanvas = function()
{
	return Mouse.x != null && Mouse.y != null &&
		Mouse.x >= 0 && Mouse.x < world.canvas.width &&
		Mouse.y >= 0 && Mouse.y < world.canvas.height;
};

Mouse.start = function(_canvas)
{
	let scale = 1;// _canvas.width / parseInt(_canvas.style.width.replace("\"", "").replace("px", ""));
    _canvas.addEventListener('mousemove', function(evt)
	{
        let rect = _canvas.getBoundingClientRect();
		Mouse.x = (evt.clientX - rect.left) * scale;
		Mouse.y = (evt.clientY - rect.top) * scale;
	}, false);
    _canvas.addEventListener("mouseup", function(ev)
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
	_canvas.addEventListener("mousedown", function(ev)
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
};

Mouse.update = function()
{
    Mouse.leftReleased = false;
    Mouse.leftPressed = false;
    Mouse.rightReleased = false;
    Mouse.rightPressed = false;
};