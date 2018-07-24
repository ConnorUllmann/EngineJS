function Utils() {}

Utils.dateStringToDate = function(string)
{
	var date = new Date();
	date.setTime(Date.parse(string));
	return date;
}
Utils.dateToDisplayString = function(date)
{
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}
Utils.hashCode = function(string)
{
	var hash = 0;
	if (string == null || string.length === 0)
		return hash;
	var stringLower = string.toLowerCase();
	for (var i = 0; i < stringLower.length; i++)
	{
		hash  = stringLower.charCodeAt(i) + ((hash << 5) - hash);
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};
Utils.digits = function(n)
{
	var count = 0;
	while(n >= 10)
	{
		n %= 10;
		count++;
	}
	return count;
}

//https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
function getUrlProperties()
{
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m,key,value)
        {
            vars[key] = decodeURIComponent(value);
        });
    return vars;
}

Array.prototype.removeAt = function(index)
{
    var item = this[index];
    if(item)
        this.splice(index, 1);
    return item;
}

//Returns a new array that is a reverse of the given array
Array.prototype.reversed = function()
{
	let list = this.slice();
	list.reverse();
    return list;
}

//https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
function getLines(ctx, text, maxWidth)
{
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}