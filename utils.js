function Utils() {}

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

//https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
function getUrlProperties()
{
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m,key,value)
        {
            vars[key] = decodeURIComponent(value);
        });
    return vars;
}

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
	let list = this.slice();
	list.reverse();
    return list;
};

//https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
function getLines(ctx, text, maxWidth)
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
}

//Redundant but keeping as a reminder
function goToUrl(url)
{
    return window.location.href = url;
}