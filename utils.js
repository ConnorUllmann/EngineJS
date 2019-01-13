function Utils() {}

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

//Returns a random element of the array
Array.prototype.sample = function()
{
    if(this.length === 0)
        return null;
    return this[Math.floor(Math.random() * this.length)];
};

//https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid()
{
    return "ss-s-s-s-sss".replace(/s/g, s4);
}
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

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


//Can be used to stop an input element from adding a dropdown, e.g.:
//onkeydown="cancelDropdownOnEnter(event, this)"
function cancelDropdownOnEnter(event, e)
{
    return event.which != 13 && event.keyCode != 13;
}


//http://javascript-coder.com/files/javascript-form-value/javascript-form-value-multi-select-example.html
function getSelectedValuesForSelectMultiple(selectMultipleElement)
{
    let selectedValues = [];
    for(let i = 0; i < selectMultipleElement.length; i++)
    {
        if(selectMultipleElement.options[i].selected)
            selectedValues.push(selectMultipleElement.options[i].value);
    }
    return selectedValues;
}
function deselectAllValuesForSelectMultiple(selectMultipleElement)
{
    for(let i = 0; i < selectMultipleElement.length; i++)
        selectMultipleElement.options[i].selected = false;
}