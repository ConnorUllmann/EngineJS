function Draw(){}

// Example:
// Draw.applyBlendMode(world, BlendMode.Overlay, () =>
// {
//     Draw.circle(world, 50, 50, 10, new Color(255, 0, 0));
// });
Draw.applyBlendMode = function(world, blendMode, drawCall)
{
    const context = world.context;
    const blendModeOriginal = context.globalCompositeOperation;
    context.globalCompositeOperation = blendMode;
    drawCall();
    context.globalCompositeOperation = blendModeOriginal;
};

BlendMode = {
    Default: 'source-over',
    SourceOver: 'source-over',
    SourceIn: 'source-in',
    SourceOut: 'source-out',
    SourceAtop: 'source-atop',
    DestinationOver: 'destination-over',
    DestinationIn: 'destination-in',
    DestinationOut: 'destination-out',
    DestinationAtop: 'destination-atop',
    Lighter: 'lighter',
    Copy: 'copy',
    Xor: 'xor',
    Multiply: 'multiply',
    Screen: 'screen',
    Overlay: 'overlay',
    Darken: 'darken',
    Lighten: 'lighten',
    ColorDodge: 'color-dodge',
    ColorBurn: 'color-burn',
    HardLight: 'hard-light',
    SoftLight: 'soft-light',
    Difference: 'difference',
    Exclusion: 'exclusion',
    Hue: 'hue',
    Saturation: 'saturation',
    Color: 'color',
    Luminosity: 'luminosity'
};

Draw.circle = function(world, x, y, radius, fillStyle)
{
    const context = world.context;
    context.beginPath();
    context.arc(x - world.camera.x, y - world.camera.y, radius, 0, 2 * Math.PI);
    context.fillStyle = fillStyle;
    context.fill();
};

Draw.circleOutline = function(world, x, y, radius, strokeStyle, lineWidth=1)
{
    const context = world.context;
    context.beginPath();
    context.arc(x - world.camera.x, y - world.camera.y, radius, 0, 2 * Math.PI);
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.stroke();
};

Draw.oval = function(world, x, y, xRadius, yRadius, fillStyle, angleRadians=0)
{
    const context = world.context;
    context.beginPath();
    context.ellipse(x - world.camera.x, y - world.camera.y, xRadius, yRadius, angleRadians, 0, 2 * Math.PI);
    context.fillStyle = fillStyle;
    context.fill();
};

Draw.ovalOutline = function(world, x, y, xRadius, yRadius, strokeStyle, angleRadians=0, lineWidth=1)
{
    const context = world.context;
    context.beginPath();
    context.ellipse(x - world.camera.x, y - world.camera.y, xRadius, yRadius, angleRadians, 0, 2 * Math.PI);
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.stroke();
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
    const context = world.context; 
    context.fillStyle = fillStyle;
    context.beginPath();
    context.moveTo(x1 - world.camera.x, y1 - world.camera.y);
    context.lineTo(x2 - world.camera.x, y2 - world.camera.y);
    context.lineTo(x3 - world.camera.x, y3 - world.camera.y);
    context.fill();
};

Draw.regularPolygon = function(world, x, y, radius, sides, fillStyle, angleRadians=0)
{
    if(sides <= 0)
        throw `Cannot draw a regular polygon with ${sides} sides`;
    const context = world.context;
    context.beginPath();
    for(let i = 0; i < sides; i++)
    {
        let angleRadiansCorner = Math.PI * 2 * i / sides + angleRadians;
        let xCorner = x + radius * Math.cos(angleRadiansCorner);
        let yCorner = y + radius * Math.sin(angleRadiansCorner);
        if(i === 0)
            context.moveTo(xCorner, yCorner);
        else
            context.lineTo(xCorner, yCorner);
    }
    context.fillStyle = fillStyle;
    context.fill();
};

Draw.regularPolygonOutline = function(world, x, y, radius, sides, strokeStyle, angleRadians=0, lineWidth=1)
{
    if(sides <= 0)
        throw `Cannot draw a regular polygon with ${sides} sides`;
    const context = world.context;
    context.beginPath();
    for(let i = 0; i < sides; i++)
    {
        let angleRadiansCorner = Math.PI * 2 * i / sides + angleRadians;
        let xCorner = x + radius * Math.cos(angleRadiansCorner);
        let yCorner = y + radius * Math.sin(angleRadiansCorner);
        if(i === 0)
            context.moveTo(xCorner, yCorner);
        else
            context.lineTo(xCorner, yCorner);
    }
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.stroke();
};

Draw.rect = function(world, x, y, w, h, fillStyle)
{
    const context = world.context;
    context.fillStyle = fillStyle;
    context.fillRect(x - world.camera.x, y - world.camera.y, w, h);
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
    const context = world.context;
    context.beginPath();
    context.moveTo(x1 - world.camera.x, y1 - world.camera.y);
    context.lineTo(x2 - world.camera.x, y2 - world.camera.y);
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.stroke();
};

Draw.lines = function(world, points, strokeStyle, lineWidth=1)
{
    const context = world.context;
    if(points.length <= 0) return;
    context.beginPath();
    context.moveTo(points[0][0] - world.camera.x, points[0][1] - world.camera.y);
    for(let i = 1; i < points.length; i++)
        context.lineTo(points[i][0] - world.camera.x, points[i][1] - world.camera.y);
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeStyle;
    context.stroke();
};

Draw.text = function(world, text, x, y, fillStyle, font=null, halign="left", valign="top", rotationRadians=0)
{ //positive x is toward the top of the screen, positive y is to the left side of the screen
    const context = world.context;
    Draw.textStyle(world, fillStyle, font, halign, valign);
    // if(rotationRadians !== 0)
    //     world.rotate(rotationRadians);
    context.fillText(text, x - world.camera.x, y - world.camera.y);
    // if(rotationRadians !== 0)
    //     world.rotate(-rotationRadians);
};

Draw.textStyle = function(world, fillStyle, font, halign, valign)
{
    const context = world.context;
    context.font = font;
    context.fillStyle = fillStyle;
    context.textAlign = halign;
    context.textBaseline=valign;
};