function Draw(){}

Draw.circle = function(ctx, x, y, radius, fillStyle)
{
    ctx = ctx.context === undefined ? ctx : ctx.context; // allow passing in worlds & contexts
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = fillStyle;
    ctx.fill();
};

Draw.circleOutline = function(ctx, x, y, radius, strokeStyle, lineWidth=1)
{
    ctx = ctx.context === undefined ? ctx : ctx.context; // allow passing in worlds & contexts
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
};

// same as circleOutline except you specify the inner and outer radii
Draw.ring = function(ctx, x, y, innerRadius, outerRadius, strokeStyle)
{
    const lineWidth = outerRadius - innerRadius;
    const radius = (outerRadius + innerRadius) / 2;
    Draw.circleOutline(ctx, x, y, radius, strokeStyle, lineWidth);
};

Draw.triangle = function(ctx, x1, y1, x2, y2, x3, y3, fillStyle)
{
    ctx = ctx.context === undefined ? ctx : ctx.context; // allow passing in worlds & contexts
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fill();
};

Draw.regularPolygon = function(ctx, x, y, radius, sides, fillStyle, angleRadians=0)
{
    if(sides <= 0)
        throw `Cannot draw a regular polygon with ${sides} sides`;
    ctx = ctx.context === undefined ? ctx : ctx.context; // allow passing in worlds & contexts
    ctx.beginPath();
    for(let i = 0; i < sides; i++)
    {
        let angleRadiansCorner = Math.PI * 2 * i / sides + angleRadians;
        let xCorner = x + radius * Math.cos(angleRadiansCorner);
        let yCorner = y + radius * Math.sin(angleRadiansCorner);
        if(i === 0)
            ctx.moveTo(xCorner, yCorner);
        else
            ctx.lineTo(xCorner, yCorner);
    }
    ctx.fillStyle = fillStyle;
    ctx.fill();
};

Draw.regularPolygonOutline = function(ctx, x, y, radius, sides, strokeStyle, angleRadians=0, lineWidth=1)
{
    if(sides <= 0)
        throw `Cannot draw a regular polygon with ${sides} sides`;
    ctx = ctx.context === undefined ? ctx : ctx.context; // allow passing in worlds & contexts
    ctx.beginPath();
    for(let i = 0; i < sides; i++)
    {
        let angleRadiansCorner = Math.PI * 2 * i / sides + angleRadians;
        let xCorner = x + radius * Math.cos(angleRadiansCorner);
        let yCorner = y + radius * Math.sin(angleRadiansCorner);
        if(i === 0)
            ctx.moveTo(xCorner, yCorner);
        else
            ctx.lineTo(xCorner, yCorner);
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
};

Draw.rect = function(ctx, x, y, w, h, fillStyle)
{
    ctx = ctx.context === undefined ? ctx : ctx.context; // allow passing in worlds & contexts
    ctx.fillStyle = fillStyle;
    ctx.fillRect(x, y, w, h);
};

Draw.rectLines = function(ctx, x, y, w, h, strokeStyle, lineWidth=1)
{
    let points = [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h],
        [x, y]
    ];
    Draw.lines(ctx, points, strokeStyle, lineWidth);
};

Draw.line = function(ctx, x1, y1, x2, y2, strokeStyle, lineWidth=1)
{
    ctx = ctx.context === undefined ? ctx : ctx.context; // allow passing in worlds & contexts
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
};

Draw.lines = function(ctx, points, strokeStyle, lineWidth=1)
{
    ctx = ctx.context === undefined ? ctx : ctx.context; // allow passing in worlds & contexts
    if(points.length <= 0) return;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for(let i = 1; i < points.length; i++)
        ctx.lineTo(points[i][0], points[i][1]);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
};

Draw.text = function(ctx, text, x, y, fillStyle, font=null, halign="left", valign="top", rotationRadians=0)
{ //positive x is toward the top of the screen, positive y is to the left side of the screen
    ctx = ctx.context === undefined ? ctx : ctx.context; // allow passing in worlds & contexts
    Draw.textStyle(ctx, fillStyle, font, halign, valign);
    // if(rotationRadians !== 0)
    //     ctx.rotate(rotationRadians);
    ctx.fillText(text, x, y);
    // if(rotationRadians !== 0)
    //     ctx.rotate(-rotationRadians);
};

Draw.textStyle = function(ctx, fillStyle, font, halign, valign)
{
    ctx = ctx.context === undefined ? ctx : ctx.context; // allow passing in worlds & contexts
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.textAlign = halign;
    ctx.textBaseline=valign;
};