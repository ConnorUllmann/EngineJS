function Color(_red, _green, _blue, _alpha=1)
{
	this.red = Math.min(Math.max(Math.floor(_red), 0), 255);
	this.green = Math.min(Math.max(Math.floor(_green), 0), 255);
	this.blue = Math.min(Math.max(Math.floor(_blue), 0), 255);
	this.alpha = Math.min(Math.max(_alpha, 0), 1);
}
Color.prototype.toString = function()
{
	return "rgba(" + this.red.toString() + "," + this.green.toString() + "," + this.blue.toString() + "," + this.alpha.toString() + ")";
}

Color.prototype.lerp = function(color, t)
{
	let tempColor = color;
	if(typeof color === 'string')
		tempColor = Color.hexToColor(color);
	return new Color((tempColor.red - this.red) * t + this.red,
					 (tempColor.green - this.green) * t + this.green,
					 (tempColor.blue - this.blue) * t + this.blue,
					 (tempColor.alpha - this.alpha) * t + this.alpha);
};

Color.getRandomColorSameLightnessFromString = function(string)
{
	let hash = Math.abs(Utils.hashCode(string));
	return "hsl(" + (hash % 360).toString() + ", 100%, 70%)";
};

Color.getRandomColorNormal = function(minRGBvalue=0, maxRGBvalue = 256)
{
	var diff = maxRGBvalue - minRGBvalue;
	return new Color(Math.floor(Math.random() * diff + minRGBvalue),
		Math.floor(Math.random() * diff + minRGBvalue),
		Math.floor(Math.random() * diff + minRGBvalue));
};

https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
Color.componentToHex = function(c)
{
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
Color.rgbToHex = function(r, g, b)
{
    return "#" + Color.componentToHex(r) + Color.componentToHex(g) + Color.componentToHex(b);
};

https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
Color.hexToColor = function(hex)
{
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) : null;
}