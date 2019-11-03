function Utils() {}

Utils.distanceSq = function(x0, y0, x1, y1)
{
    return (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1);
};
Utils.distance = function(x0, y0, x1, y1)
{
    return Math.sqrt(Utils.distanceSq(x0, y0, x1, y1));
};

Utils.factorial = function(n)
{
    if(n <= 0)
        return 0;
    if(n === 1)
        return 1;
    let factorial = 1;
    for(let i = n; i > 1; i--)
        factorial *= i;
    return factorial;
};

Utils.binomialCoefficient = function(n, k)
{
    let result = 1;
    for(let i = n - k + 1; i <= n; i++)
        result *= i;
    for(let i = 1; i <= k; i++)
        result /= i;
    return result;
};

Utils.bezierPoint = function(t, points)
{
    const n = points.length - 1;
    let sum = new Point();
    for(let i = 0; i < points.length; i++)
    {
        const point = points[i];
        const binomial = Utils.binomialCoefficient(n, i);
        const scalar = binomial * Math.pow(1 - t, n - i) * Math.pow(t, i);
        sum = sum.add(point.scale(scalar));
    }
    return sum;
};

// Takes in a list of points and returns a new list of points which make up a bezier curve across them
// coarseness must be between 0 and 1; smaller value means more points and more detail but longer runtime
Utils.bezierify = function(points, coarseness=0.05)
{
    const bezierPoints = [];
    for(let i = 0; i <= 1; i += coarseness)
        bezierPoints.push(Utils.bezierPoint(i, points));
    return bezierPoints;
};

Utils.clamp = function(x, min, max)
{
    return min == null
        ? (max == null
            ? x
            : Math.min(max, x))
        : (max == null
            ? Math.max(min, x)
            : Math.max(min, Math.min(max, x)));
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

Utils.TAU = 2 * Math.PI;

// calculates "value % modulo" but wraps negative numbers more sensibly
Utils.moduloSafe = function(value, modulo=Utils.TAU)
{
    return ((value % modulo) + modulo) % modulo;
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

Utils.lerp = function(start, finish, normal=0.5, clamp=false) {
    return start + (finish - start) * (clamp ? Utils.clamp(normal, 0, 1) : normal);
};

Utils.lerpAngle = function(startAngle, finishAngle, normal=0.5, clamp=false) {
    return startAngle + Utils.angleDiffRadians(startAngle, finishAngle) * (clamp ? Utils.clamp(normal, 0, 1) : normal);
};

// Returns a list of the velocity vectors a projectile would need in order to hit the (xTarget, yTarget) from (xStart, yStart)
// given the speed of the shot and gravity. Returns 0, 1, or 2 Points (if two points, the highest-arching vector is first)
Utils.getLaunchVectors = function(xStart, yStart, xTarget, yTarget, gravityMagnitude, velocityMagnitude)
{
    if(velocityMagnitude === 0)
        return [];

    if(gravityMagnitude === 0)
        return [new Point(xTarget, yTarget).subtract(xStart, yStart).normalized(velocityMagnitude)];

    const xDiff = xTarget - xStart;
    const yDiff = yTarget - yStart;
    const g = -gravityMagnitude;
    const v = velocityMagnitude;
    const v2 = v * v;
    const sqrt = v2 * v2 - g * (g * xDiff * xDiff + 2 * yDiff * v2);

    if(xDiff === 0 && sqrt === 0)
        return [Point.create(Math.sign(xDiff) * v, -Math.PI / 2)];

    if(xDiff === 0)
        return yDiff > 0
            ? [new Point(0, v)]
            : yDiff < 0
                ? [new Point(0, -v)]
                : [new Point(0, v), new Point(0, -v)];

    if (sqrt < 0)
        return [];

    return [
        Point.create(Math.sign(xDiff) * v, Math.atan((v2 + Math.sqrt(sqrt))/(g * xDiff))),
        Point.create(Math.sign(xDiff) * v, Math.atan((v2 - Math.sqrt(sqrt))/(g * xDiff)))
    ];
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

//https://stackoverflow.com/a/34116242
Utils.isArray = function(obj)
{
    return !!obj && obj.constructor === Array;
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
    return this.length > 0
        ? this[Math.floor(Math.random() * this.length)]
        : null;
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

Array.prototype.first = function(boolCheck=null)
{
    if(boolCheck === null)
    {
        return this.length <= 0
            ? null
            : this[0];
    }

    for(let element of this)
        if (boolCheck(element))
            return element;
    return null;
};

Array.prototype.last = function(boolCheck=null)
{
    if(boolCheck === null)
    {
        return this.length <= 0
            ? null
            : this[this.length-1];
    }

    for(let i = this.length-1; i >= 0; i--)
    {
        const element = this[i];
        if (boolCheck(element))
            return element;
    }
    return null;
};

// AisBetterThanB = a function which takes two parameters and returns true if the first one is "better" than the second one, false otherwise.
// Returns the single element that won every comparison it was involved in (or null if the list is empty).
//
// Examples:
//
// Problem: I need the object with the highest score, or the first match if there's a tie
// [{score:5}, {id:'a', score:6}, {id:'b', score:6}, {score:3}]
//  .bestOf((a, b) => a.score > b.score)
//      = {id:'a', score:6}
// Note: alternative formulation = [{score:5}, {score:6}, {score:3}].maxOf(o => o.score)
//
// Problem: I need the object with the highest score, or the last match if there's a tie
// [{score:5}, {id:'a', score:6}, {id:'b', score:6}, {score:3}]
//  .bestOf((a, b) => a.score >= b.score)
//      = {id:'b', score:6}
//
// Problem: I need the character with the longest name who is still alive
// [
//     {name:'harry', alive:true},
//     {name:'ron', alive:true},
//     {name:'hermione', alive:true},
//     {name:'voldemort', alive:false}
// ].bestOf((a, b) => a.alive && a.name.length > b.name.length)
//     = {name:'hermione', alive:true}
//
// Problem: I need the object that is facing most upward
// [{direction: new Point(2, 6)}, {direction: new Point(-4, -3)}]
//  .bestOf((a, b) => a.direction.normalized().dot(new Point(0, -1)) > b.direction.normalized().dot(new Point(0, -1)))
//      = {direction: new Point(-4, -3)}
//
Array.prototype.bestOf = function(AisBetterThanB)
{
    if(this.length === 0)
        return null;

    let bestItem = this[0];
    for(let item of this)
        if(AisBetterThanB(item, bestItem))
            bestItem = item;
    return bestItem;
};

Array.prototype.min = function(valueGetter=null)
{
    return Math.min.apply(null, valueGetter != null
        ? this.map(o => valueGetter(o))
        : this);
};

// Returns the element of the array with the lowest valueGetter(element) value
// Note: the first match is returned if there is a tie
Array.prototype.minOf = function(valueGetter)
{
    return this.length > 0
        ? this.bestOf((a, b) => valueGetter(a) < valueGetter(b))
        : null;
};

Array.prototype.max = function(valueGetter=null)
{
    return Math.max.apply(null, valueGetter != null
        ? this.map(o => valueGetter(o))
        : this);
};

// Returns the element of the array with the highest valueGetter(element) value
// Note: the first match is returned if there is a tie
Array.prototype.maxOf = function(valueGetter)
{
    return this.length > 0
        ? this.bestOf((a, b) => valueGetter(a) > valueGetter(b))
        : null;
};

Array.prototype.sum = function()
{
    return this.reduce((total, increment) => total + increment);
};

// Example:
// [
//      {id:'squirtle'},
//      {id:'bulbasaur'},
//      {id:'charmander'}
// ]
// .mappedBy(o => o.id) =
// {
//      squirtle: {id: 'squirtle'},
//      bulbasaur: {id: 'bulbasaur'},
//      charmander: {id: 'charmander'}
// }
Array.prototype.mappedBy = function(keyGetter)
{
    return this.reduce((obj, element) =>
    {
        obj[keyGetter(element)] = element;
        return obj
    },
    {});
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

// Returns the all elements with a unique value as determined by the mapping function "valueGetter"
// Example:
// [
//     {id:0,n:1},
//     {id:1,n:2},
//     {id:2,n:1},
//     {id:3,n:3},
//     {id:4,n:2}
// ]
// .distinct(o => o.n) =
// [
//     {id:0,n:1},
//     {id:1,n:2},
//     {id:3,n:3}
// ]
Array.prototype.distinct = function(valueGetter)
{
    const map = this.map(o => valueGetter ? valueGetter(o) : o);
    return this.filter((value, i) =>
    {
        return map.indexOf(valueGetter ? valueGetter(value) : value) === i;
    });
};


// makes a given class a child of the class this method is called upon
//
// Example: creating a class "Square"
// which inherits from another class "Rectangle"
// which inherits from another class "Point"
//
// function Point(x, y)
// {
//      this.x = x;
//      this.y = y;
// }
//
// function Rectangle(x, y, w, h)
// {
//      Point.call(this, x, y);
//      this.w = width;
//      this.h = height;
// }
// Point.parents(Rectangle);
//
// function Square(x, y, size)
// {
//      Rectangle.call(this, x, y, size, size);
// }
// Rectangle.parents(Square)
Function.prototype.parents = function(childClass)
{
    childClass.prototype = Object.create(this.prototype);
    childClass.prototype.constructor = childClass;
};