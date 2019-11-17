function Draw(){}

// Example:
// Draw.applyBlendMode(world, BlendMode.Overlay, () =>
// {
//     Draw.circle(world, 50, 50, 10, new Color(255, 0, 0));
// });
Draw.applyBlendMode = function(world, blendMode, drawCall)
{
    const context = world.context;
    const blendModeOriginal = context.globalCompositeOperation.toString();
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
const BlendModes = Object.values(BlendMode).distinct();

Draw.circle = function(world, x, y, radius, fillStyle=null)
{
    if(radius <= 0)
        return;

    const context = world.context;
    context.beginPath();
    context.arc(x - world.camera.x, y - world.camera.y, radius, 0, Utils.TAU);
    if(fillStyle)
        context.fillStyle = fillStyle;
    context.fill();
};

Draw.circleOutline = function(world, x, y, radius, strokeStyle=null, lineWidth=1)
{
    if(radius <= 0)
        return;

    const context = world.context;
    context.beginPath();
    context.arc(x - world.camera.x, y - world.camera.y, radius, 0, Utils.TAU);
    context.lineWidth = lineWidth;
    if(strokeStyle)
        context.strokeStyle = strokeStyle;
    context.stroke();
};

// same as circleOutline except you specify the inner and outer radii
Draw.ring = function(world, x, y, innerRadius, outerRadius, strokeStyle=null)
{
    if(outerRadius <= 0)
        return;

    const lineWidth = outerRadius - innerRadius;
    const radius = (outerRadius + innerRadius) / 2;
    Draw.circleOutline(world, x, y, radius, strokeStyle, lineWidth);
};

Draw.oval = function(world, x, y, xRadius, yRadius, fillStyle=null, angleRadians=0)
{
    if(xRadius <= 0 || yRadius <= 0)
        return;

    const context = world.context;
    context.beginPath();
    context.ellipse(x - world.camera.x, y - world.camera.y, xRadius, yRadius, angleRadians, 0, Utils.TAU);
    if(fillStyle)
        context.fillStyle = fillStyle;
    context.fill();
};

Draw.ovalOutline = function(world, x, y, xRadius, yRadius, strokeStyle=null, angleRadians=0, lineWidth=1)
{
    if(xRadius <= 0 || yRadius <= 0)
        return;

    const context = world.context;
    context.beginPath();
    context.ellipse(x - world.camera.x, y - world.camera.y, xRadius, yRadius, angleRadians, 0, Utils.TAU);
    context.lineWidth = lineWidth;
    if(strokeStyle)
        context.strokeStyle = strokeStyle;
    context.stroke();
};

Draw.triangle = function(world, x1, y1, x2, y2, x3, y3, fillStyle=null)
{
    const context = world.context;
    context.beginPath();
    context.moveTo(x1 - world.camera.x, y1 - world.camera.y);
    context.lineTo(x2 - world.camera.x, y2 - world.camera.y);
    context.lineTo(x3 - world.camera.x, y3 - world.camera.y);
    if(fillStyle)
        context.fillStyle = fillStyle;
    context.fill();
};

Draw.triangleOutline = function(world, x1, y1, x2, y2, x3, y3, strokeStyle=null, lineWidth=1)
{
    const context = world.context;
    context.beginPath();
    context.moveTo(x1 - world.camera.x, y1 - world.camera.y);
    context.lineTo(x2 - world.camera.x, y2 - world.camera.y);
    context.lineTo(x3 - world.camera.x, y3 - world.camera.y);
    context.closePath();
    context.lineWidth = lineWidth;
    if(strokeStyle)
        context.strokeStyle = strokeStyle;
    context.stroke();
};

Draw.polygon = function(world, points, fillStyle=null)
{
    if(points == null || points.length <= 0)
        return null;

    const context = world.context;
    context.beginPath();
    context.moveTo(points.first().x - world.camera.x, points.first().y - world.camera.y);
    for(let i = 1; i < points.length; i++)
        context.lineTo(points[i].x - world.camera.x, points[i].y - world.camera.y);
    context.closePath();
    if(fillStyle)
        context.fillStyle = fillStyle;
    context.fill();
};

Draw.polygonOutline = function(world, points, strokeStyle=null, lineWidth=1)
{
    if(points == null || points.length <= 0)
        return null;

    const context = world.context;
    context.beginPath();
    context.moveTo(points.first().x - world.camera.x, points.first().y - world.camera.y);
    for(let i = 1; i < points.length; i++)
        context.lineTo(points[i].x - world.camera.x, points[i].y - world.camera.y);
    context.closePath();
    context.lineWidth = lineWidth;
    if(strokeStyle)
        context.strokeStyle = strokeStyle;
    context.stroke();
};

Draw.regularPolygon = function(world, x, y, radius, sides, fillStyle=null, angleRadians=0)
{
    const context = world.context;
    const points = Draw._getRegularPolygonPoints(x, y, radius, sides, angleRadians);
    if(points.length <= 0)
        return;
    context.beginPath();
    for(let i = 0; i < points.length; i++)
    {
        const point = points[i].subtract(world.camera);
        if(i === 0)
            context.moveTo(point.x, point.y);
        else
            context.lineTo(point.x, point.y);
    }
    if(fillStyle)
        context.fillStyle = fillStyle;
    context.fill();
};

Draw.regularPolygonOutline = function(world, x, y, radius, sides, strokeStyle=null, angleRadians=0, lineWidth=1)
{
    const context = world.context;
    const points = Draw._getRegularPolygonPoints(x, y, radius, sides, angleRadians);
    if(points.length <= 0)
        return;
    points.push(points.first());
    context.beginPath();
    for(let i = 0; i < points.length; i++)
    {
        const point = points[i].subtract(world.camera);
        if(i === 0)
            context.moveTo(point.x, point.y);
        else
            context.lineTo(point.x, point.y);
    }
    context.lineWidth = lineWidth;
    if(strokeStyle)
        context.strokeStyle = strokeStyle;
    context.stroke();
};

Draw._getRegularPolygonPoints = function(x, y, radius, sides, angleRadians)
{
    if(sides <= 0)
        throw `Cannot create a regular polygon with ${sides} sides`;
    const position = new Point(x, y);
    const points = [];
    for(let i = 0; i < sides; i++)
    {
        const angleRadiansToCorner = Utils.TAU * i / sides + angleRadians;
        const point = Point.create(radius, angleRadiansToCorner).add(position);
        points.push(point);
    }
    return points;
};

Draw.rectangle = function(world, x, y, w, h, fillStyle=null)
{
    const context = world.context;
    if(fillStyle)
        context.fillStyle = fillStyle;
    context.fillRect(x - world.camera.x, y - world.camera.y, w, h);
};

Draw.rectangleRotated = function(world, xCenter, yCenter, w, h, fillStyle=null, angleRadians=0)
{
    if(angleRadians === 0)
    {
        Draw.rectangle(world, xCenter - w/2, yCenter - h/2, w, h, fillStyle);
        return;
    }

    const context = world.context;
    if(fillStyle)
        context.fillStyle = fillStyle;
    xCenter = xCenter - world.camera.x;
    yCenter = yCenter - world.camera.y;
    context.translate(xCenter, yCenter);
    context.rotate(angleRadians);
    context.fillRect(-w/2, -h/2, w, h);
    context.rotate(-angleRadians);
    context.translate(-xCenter, -yCenter);
};

Draw.rectangleOutline = function(world, x, y, w, h, strokeStyle=null, lineWidth=1)
{
    // TODO: should use .closePath() instead of re-appending [x, y]
    let points = [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
        [x, y]
    ];
    Draw.lines(world, points, strokeStyle, lineWidth);
};

Draw.rectangleGradientVertical = function(world, x, y, w, h, colorStopArray)
{
    const context = world.context;
    const diff = new Point(x, y).subtract(world.camera);
    const gradient = context.createLinearGradient(diff.x, diff.y, diff.x, diff.y + h);
    colorStopArray.applyToGradient(gradient);
    context.fillStyle = gradient;
    context.fillRect(diff.x, diff.y, w, h);
};

Draw.rectangleGradientHorizontal = function(world, x, y, w, h, colorStopArray)
{
    const context = world.context;
    const diff = new Point(x, y).subtract(world.camera);
    const gradient = context.createLinearGradient(diff.x, diff.y, diff.x + w, diff.y);
    colorStopArray.applyToGradient(gradient);
    context.fillStyle = gradient;
    context.fillRect(diff.x, diff.y, w, h);
};

Draw.line = function(world, x1, y1, x2, y2, strokeStyle=null, lineWidth=1)
{
    if(lineWidth < 0)
        return;
    const context = world.context;
    context.beginPath();
    context.moveTo(x1 - world.camera.x, y1 - world.camera.y);
    context.lineTo(x2 - world.camera.x, y2 - world.camera.y);
    if(strokeStyle)
        context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.stroke();
};

Draw.lines = function(world, points, strokeStyle=null, lineWidth=1)
{
    if(lineWidth < 0 || points == null || points.length <= 0)
        return;

    const context = world.context;
    context.beginPath();
    context.moveTo(points[0].x - world.camera.x, points[0].y - world.camera.y);
    for(let i = 1; i < points.length; i++)
        context.lineTo(points[i].x - world.camera.x, points[i].y - world.camera.y);
    if(strokeStyle)
        context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.stroke();
};

Draw.text = function(world, text, x, y, fillStyle=null, font=null, halign="left", valign="top", rotationRadians=0)
{ //positive x is toward the top of the screen, positive y is to the left side of the screen
    const context = world.context;
    Draw.textStyle(world, fillStyle, font, halign, valign);
    // if(rotationRadians !== 0)
    //     world.rotate(rotationRadians);
    context.fillText(text, x - world.camera.x, y - world.camera.y);
    // if(rotationRadians !== 0)
    //     world.rotate(-rotationRadians);
};

Draw.textStyle = function(world, fillStyle=null, font=null, halign=null, valign=null)
{
    const context = world.context;
    if(font)
        context.font = font;
    if(halign)
        context.textAlign = halign;
    if(fillStyle)
        context.fillStyle = fillStyle;
    if(valign)
        context.textBaseline = valign;
};

Draw.textWidth = function(world, text, font=null)
{
    const context = world.context;
    if(font)
        context.font = font;
    return context.measureText(text).width;
};



/* Color Stops - used for gradients */
function ColorStop(color, stop)
{
    this.color = color;
    this.stop = stop;
}
ColorStop.prototype.applyToGradient = function(gradient)
{
    gradient.addColorStop(this.stop, this.color.toString());
};

function ColorStopArray(colorStops)
{
    Array.call(this);
    colorStops.forEach(o => this.push(o));
    if(this.length < 2)
        throw 'Cannot create ColorStopList with less than two colors';
    if(this.first().stop !== 0)
        throw 'First ColorStop must have stop=0';
    if(this.last().stop !== 1)
        throw 'Last ColorStop must have stop=1';
    if(this.any(o => o.stop < 0 || o.stop > 1))
        throw 'All ColorStops must have 0 <= stop <= 1';
}
Array.parents(ColorStopArray);
ColorStopArray.prototype.applyToGradient = function(gradient)
{
    this.forEach(o => o.applyToGradient(gradient));
};

// Returns the color from the gradient at the given position [0..1] given the ColorStops in this ColorStopArray
//
// Example:
// ColorStopArray.createEvenlySpaced(
//      new Color(255, 0, 0),
//      new Color(0, 255, 0),
//      new Color(0, 0, 255))
//  .sample(0.25) === new Color(127, 127, 0)
ColorStopArray.prototype.sample = function(normal)
{
    if(normal <= 0)
        return this.first().color;
    if(normal >= 1)
        return this.last().color;
    for(let j = 0; j < this.length-1; j++)
    {
        const colorStop = this[j];
        const colorStopNext = this[j+1];
        if(normal >= colorStop.stop && normal <= colorStopNext.stop)
        {
            const colorStopNormal = Utils.clamp((normal - colorStop.stop) / (colorStopNext.stop - colorStop.stop), 0, 1);
            return colorStop.color.lerp(colorStopNext.color, colorStopNormal);
        }
    }
};

// Example: creates a ColorStopArray which will go from red to green to blue,
//  where the red to green transition is faster than the green to blue.
// ColorStopArray.create(
//      new ColorStop(new Color(255, 0, 0), 0),
//      new ColorStop(new Color(0, 255, 0), 0.4),
//      new ColorStop(new Color(0, 0, 255), 1));
ColorStopArray.create = function(...colorStops)
{
    return new ColorStopArray(colorStops);
};

// Example: creates a ColorStopArray which will go from red to green to blue
// ColorStopArray.createEvenlySpaced(
//      new Color(255, 0, 0),
//      new Color(0, 255, 0),
//      new Color(0, 0, 255));
ColorStopArray.createEvenlySpaced = function(...colors)
{
    if(colors.length < 2)
        throw 'Cannot create ColorStopList with less than two colors';
    const colorStops = [];
    for(let i = 0; i < colors.length; i++)
    {
        const color = colors[i];
        const stop = i / (colors.length - 1);
        const colorStop = new ColorStop(color, stop);
        colorStops.push(colorStop);
    }
    return new ColorStopArray(colorStops);
};