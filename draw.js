function Draw(){}

Draw.circle = function(world, x, y, radius, fillStyle)
{
    world = world.context === undefined ? world : world.context; 
    world.beginPath();
    world.arc(x, y, radius, 0, 2 * Math.PI);
    world.fillStyle = fillStyle;
    world.fill();
};

Draw.circleOutline = function(world, x, y, radius, strokeStyle, lineWidth=1)
{
    world = world.context === undefined ? world : world.context; 
    world.beginPath();
    world.arc(x, y, radius, 0, 2 * Math.PI);
    world.strokeStyle = strokeStyle;
    world.lineWidth = lineWidth;
    world.stroke();
};

// same as circleOutline except you specify the inner and outer radii
Draw.ring = function(world, x, y, innerRadius, outerRadius, strokeStyle)
{
    const lineWidth = outerRadius - innerRadius;
    const radius = (outerRadius + innerRadius) / 2;
    Draw.circleOutline(world, x, y, radius, strokeStyle, lineWidth);
};

Draw.triangle = function(world, x1, y1, x2, y2, x3, y3, fillStyle)
{
    world = world.context === undefined ? world : world.context; 
    world.fillStyle = fillStyle;
    world.beginPath();
    world.moveTo(x1, y1);
    world.lineTo(x2, y2);
    world.lineTo(x3, y3);
    world.fill();
};

Draw.regularPolygon = function(world, x, y, radius, sides, fillStyle, angleRadians=0)
{
    if(sides <= 0)
        throw `Cannot draw a regular polygon with ${sides} sides`;
    world = world.context === undefined ? world : world.context; 
    world.beginPath();
    for(let i = 0; i < sides; i++)
    {
        let angleRadiansCorner = Math.PI * 2 * i / sides + angleRadians;
        let xCorner = x + radius * Math.cos(angleRadiansCorner);
        let yCorner = y + radius * Math.sin(angleRadiansCorner);
        if(i === 0)
            world.moveTo(xCorner, yCorner);
        else
            world.lineTo(xCorner, yCorner);
    }
    world.fillStyle = fillStyle;
    world.fill();
};

Draw.regularPolygonOutline = function(world, x, y, radius, sides, strokeStyle, angleRadians=0, lineWidth=1)
{
    if(sides <= 0)
        throw `Cannot draw a regular polygon with ${sides} sides`;
    world = world.context === undefined ? world : world.context; 
    world.beginPath();
    for(let i = 0; i < sides; i++)
    {
        let angleRadiansCorner = Math.PI * 2 * i / sides + angleRadians;
        let xCorner = x + radius * Math.cos(angleRadiansCorner);
        let yCorner = y + radius * Math.sin(angleRadiansCorner);
        if(i === 0)
            world.moveTo(xCorner, yCorner);
        else
            world.lineTo(xCorner, yCorner);
    }
    world.lineWidth = lineWidth;
    world.strokeStyle = strokeStyle;
    world.stroke();
};

Draw.rect = function(world, x, y, w, h, fillStyle)
{
    world = world.context === undefined ? world : world.context; 
    world.fillStyle = fillStyle;
    world.fillRect(x, y, w, h);
};

Draw.rectLines = function(world, x, y, w, h, strokeStyle, lineWidth=1)
{
    let points = [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
        [x, y]
    ];
    Draw.lines(world, points, strokeStyle, lineWidth);
};

Draw.line = function(world, x1, y1, x2, y2, strokeStyle, lineWidth=1)
{
    world = world.context === undefined ? world : world.context; 
    world.beginPath();
    world.moveTo(x1, y1);
    world.lineTo(x2, y2);
    world.lineWidth = lineWidth;
    world.strokeStyle = strokeStyle;
    world.stroke();
};

Draw.lines = function(world, points, strokeStyle, lineWidth=1)
{
    world = world.context === undefined ? world : world.context; 
    if(points.length <= 0) return;
    world.beginPath();
    world.moveTo(points[0][0], points[0][1]);
    for(let i = 1; i < points.length; i++)
        world.lineTo(points[i][0], points[i][1]);
    world.lineWidth = lineWidth;
    world.strokeStyle = strokeStyle;
    world.stroke();
};

Draw.text = function(world, text, x, y, fillStyle, font=null, halign="left", valign="top", rotationRadians=0)
{ //positive x is toward the top of the screen, positive y is to the left side of the screen
    world = world.context === undefined ? world : world.context; 
    Draw.textStyle(world, fillStyle, font, halign, valign);
    // if(rotationRadians !== 0)
    //     world.rotate(rotationRadians);
    world.fillText(text, x, y);
    // if(rotationRadians !== 0)
    //     world.rotate(-rotationRadians);
};

Draw.textStyle = function(world, fillStyle, font, halign, valign)
{
    world = world.context === undefined ? world : world.context; 
    world.font = font;
    world.fillStyle = fillStyle;
    world.textAlign = halign;
    world.textBaseline=valign;
};