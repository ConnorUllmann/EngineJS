function Utils() {}

Utils.distanceSq = function(x0, y0, x1, y1)
{
    return (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1);
};
Utils.distance = function(x0, y0, x1, y1)
{
    return Math.sqrt(Utils.distanceSq(x0, y0, x1, y1));
};

/* Length of an equilateral triangle's altitude given the side length */
Utils.EquilateralAltitudeCoefficient = Math.sqrt(3) / 2;
Utils.equilateralAltitude = function(equilateralTriangleSideLength)
{
    return Utils.EquilateralAltitudeCoefficient * equilateralTriangleSideLength;
};

Utils.dateStringToDate = function(string)
{
    let date = new Date();
	date.setTime(Date.parse(string));
	return date;
};

Utils.dateToDisplayString = function(date)
{
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
};

Utils.hashCode = function(string)
{
    let hash = 0;
	if (string == null || string.length === 0)
		return hash;
    let stringLower = string.toLowerCase();
	for (let i = 0; i < stringLower.length; i++)
	{
		hash  = stringLower.charCodeAt(i) + ((hash << 5) - hash);
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

Utils.digits = function(n)
{
    let count = 0;
	while(n >= 10)
	{
		n %= 10;
		count++;
	}
	return count;
};

Utils.angleDiffRadians = function(from, to)
{
    let diff = to - from;
    while (diff > Math.PI) { diff -= 2 * Math.PI; }
    while (diff <= -Math.PI) { diff += 2 * Math.PI; }
    return diff;
};

Utils.getPointTangentToCircle = function(xLineA, yLineA, xLineB, yLineB, xCircle, yCircle, radiusCircle)
{
    //If the first point is inside the circle, make the second point outside the circle.
    if (Utils.distanceSq(xLineA, yLineA, xCircle, yCircle) <= radiusCircle * radiusCircle)
    {
        let angle = Math.atan2(yLineA - yCircle, xLineA - xCircle);
        return new Point(radiusCircle * Math.cos(angle) + xCircle, radiusCircle * Math.sin(angle) + yCircle);
    }

    //Use maths to find both points on the circle that share a tangent line with the first point.
    let cv = new Point(xCircle - xLineA, yCircle - yLineA);
    let length = Math.sqrt(cv.lengthSq() - radiusCircle * radiusCircle);

    let end = [];
    let angle = cv.angle() - Math.atan2(radiusCircle, length);
    end.push(new Point(length * Math.cos(angle) + xLineA, length * Math.sin(angle) + yLineA));
    angle = cv.angle() + Math.atan2(radiusCircle, length);
    end.push(new Point(length * Math.cos(angle) + xLineA, length * Math.sin(angle) + yLineA));

    //Of the two points, return which one is closest to the second point.
    return end[Utils.distanceSq(xLineB, yLineB, end[1].x, end[1].y) < Utils.distanceSq(xLineB, yLineB, end[0].x, end[0].y) ? 1 : 0];
};

Utils.log = function(text, level = "info")
{
    let d = new Date();
    let dateString = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2) + "." + ("00" + d.getMilliseconds()).slice(-3) + " UTC" + (d.getTimezoneOffset() > 0 ? "-" : "+") + Math.abs(d.getTimezoneOffset() / 60);
    console.log("[" + level + "][" + dateString + "] " + text);
};

//https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
Utils.getUrlProperties = function()
{
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m,key,value)
        {
            vars[key] = decodeURIComponent(value);
        });
    return vars;
};

Utils.saveCanvasScreenshot = function()
{
    let w=window.open('about:blank','image from canvas');
    w.document.write("<img src='"+canvas.toDataURL("image/png")+"' alt='from canvas'/>");
};

//https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
Utils.guid = function()
{
    return "ss-s-s-s-sss".replace(/s/g, () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
};

//https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
Utils.getLines = function(ctx, text, maxWidth)
{
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
};

//Redundant but keeping as a reminder
Utils.goToUrl = function(url)
{
    return window.location.href = url;
};

//Can be used to stop an input element from adding a dropdown, e.g.:
//onkeydown="Utils.cancelDropdownOnEnter(event, this)"
Utils.cancelDropdownOnEnter = function(event, e)
{
    return event.which !== 13 && event.keyCode !== 13;
};

Utils.getRandomName = function()
{
    const names = [
        "Raymond",
        "Teodoro",
        "Ariel",
        "Clement",
        "Javier",
        "Curt",
        "Wade",
        "Wesley",
        "Ricky",
        "Russell",
        "Oren",
        "Young",
        "Francisco",
        "Bertram",
        "Jeffrey",
        "Roosevelt",
        "Teddy",
        "Branden",
        "Jasper",
        "Trevor",
        "Pierre",
        "Cole",
        "Nickolas",
        "Steven",
        "Emerson",
        "Jesus",
        "Barrett",
        "Faustino",
        "Vito",
        "Lupe",
        "Boris",
        "Mckinley",
        "Norman",
        "Orval",
        "Stacey",
        "Chi",
        "Logan",
        "Ezequiel",
        "Hipolito",
        "Roger",
        "Quinn",
        "Timothy",
        "Tanner",
        "Millard",
        "Riley",
        "Edwin",
        "Carson",
        "Raymundo",
        "Karl",
        "Mariano",
        "See",
        "Bess",
        "Malissa",
        "Alexandra",
        "Shizuko",
        "Chu",
        "Johana",
        "Alyce",
        "Carlee",
        "Gertude",
        "Estefana",
        "Yung",
        "Bong",
        "Saturnina",
        "Vickie",
        "Torri",
        "Gabriella",
        "Layla",
        "Penney",
        "Marian",
        "Melvina",
        "Marylouise",
        "Sina",
        "Jacquetta",
        "Janis",
        "Lavon",
        "Kina",
        "Luciana",
        "Jeanice",
        "Bula",
        "Lilly",
        "Jennine",
        "Maudie",
        "Darby",
        "Adah",
        "Sheron",
        "Precious",
        "Cheyenne",
        "Anitra",
        "Kay",
        "Eleonore",
        "Rhonda",
        "Nila",
        "Staci",
        "Vallie",
        "Pandora",
        "Michelina",
        "Nichelle",
        "Malia",
        "Graciela"
    ];
    return names.sample();
};

Array.prototype.removeThis = function(item)
{
    if(!this.includes(item))
        return;
    this.removeAt(this.indexOf(item));
};

Array.prototype.removeAt = function(index)
{
    let item = this[index];
    if(item)
        this.splice(index, 1);
    return item;
};

//Returns a new array that is a reverse of the given array
Array.prototype.reversed = function()
{
    let list = this.clone();
    list.reverse();
    return list;
};

//Returns a random element of the array
Array.prototype.sample = function()
{
    if(this.length === 0)
        return null;
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.swap = function(x, y)
{
    this[x] = this.splice(y, 1, this[x])[0];
};

Array.prototype.flattened = function()
{
    return [].concat.apply([], this);
};

Array.prototype.any = function(boolCheck)
{
    return this.some(boolCheck);
};

Array.prototype.first = function(boolCheck)
{
    for(let element of this)
        if (boolCheck(element))
            return element;
    return null;
};

Array.prototype.max = function()
{
    return Math.max.apply(null, this);
};

Array.prototype.min = function()
{
    return Math.min.apply(null, this);
};

// Returns the element of the array with the lowest valueGetter(element) value
Array.prototype.minOf = function(valueGetter)
{
    if(this.length === 0)
        return null;

    let minItem = this[0];
    let minValue = valueGetter(minItem);
    for(let item of this)
    {
        let value = valueGetter(item);
        if(value < minValue)
        {
            minItem = item;
            minValue = value;
        }
    }
    return minItem;
};

Array.prototype.maxOf = function(valueGetter)
{
    return this.minOf(o => -valueGetter(o));
};

Array.prototype.sum = function()
{
    return this.reduce((total, increment) => total + increment);
};

Array.prototype.clone = function()
{
    return this.slice(0);
};

Array.prototype.clear = function()
{
    this.length = 0;
};

// Chainable sort (modifies existing array)
Array.prototype.sorted = function(compare)
{
    this.sort(compare);
    return this;
};