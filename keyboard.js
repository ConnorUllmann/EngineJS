function Keyboard()
{
    // Usage: wPressed = "W" in Keyboard.pressed
    this.down = {};
    this.pressed = {};
    this.released = {};
}

Keyboard.prototype.start = function()
{
    let keyboard = this;
    document.addEventListener("keydown", function(e)
    {
        if(e.repeat)
            return;

        let keys = Keyboard.keysForKeyCode(e.keyCode);
        for(let i = 0; i < keys.length; i++)
        {
            let key = keys[i];
            keyboard.pressed[key] = true;
            keyboard.down[key] = true;
        }
    }, false);
    document.addEventListener("keyup", function(e)
    {
        if(e.repeat)
            return;

        let keys = Keyboard.keysForKeyCode(e.keyCode);
        for(let i = 0; i < keys.length; i++)
        {
            let key = keys[i];
            keyboard.released[key] = true;
            if(keyboard.down.hasOwnProperty(key))
                delete keyboard.down[key];
        }
    }, false);
};

Keyboard.prototype.update = function()
{
    for(let property in this.pressed)
        if(this.pressed.hasOwnProperty(property))
            delete this.pressed[property];

    for(let property in this.released)
        if(this.released.hasOwnProperty(property))
            delete this.released[property];
};

Keyboard.keysForKeyCode = function(keyCode)
{
    const specialKeysMapping = {
        8:["backspace"],
        9:["tab"],
        13:["enter", "return"],
        16:["shift"],
        17:["ctrl", "control"],
        18:["alt"],
        19:["pause", "break", "pause/break"],
        20:["caps lock"],
        27:["escape"],
        32:["space"],
        33:["page up"],
        34:["page down"],
        35:["end"],
        36:["home"],
        37:["left"],
        38:["up"],
        39:["right"],
        40:["down"],
        45:["insert"],
        46:["delete"],
        189:["-", "_"],
        187:["=", "+"]
    };
    let key = String.fromCharCode(keyCode);
    let keyLowerCase = key.toLowerCase();
    let keyUpperCase = key.toUpperCase();
    let result = [keyCode, keyLowerCase, keyUpperCase];

    if(keyCode in specialKeysMapping)
        result.push(...specialKeysMapping[keyCode]);
    return result;
};