function Keyboard() {}

Keyboard.down = {};
Keyboard.pressed = {};
Keyboard.released = {};

// Usage: wPressed = "W" in Keyboard.pressed

Keyboard.start = function()
{
    document.addEventListener("keydown", function(e)
    {
        if(e.repeat)
            return;

        let keys = Keyboard.keysForKeyCode(e.keyCode);
        for(let i = 0; i < keys.length; i++)
        {
            let key = keys[i];
            Keyboard.pressed[key] = true;
            Keyboard.down[key] = true;
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
            Keyboard.released[key] = true;
            if(Keyboard.down.hasOwnProperty(key))
                delete Keyboard.down[key];
        }
    }, false);
};

Keyboard.update = function()
{
    for(let property in Keyboard.pressed)
        if(Keyboard.pressed.hasOwnProperty(property))
            delete Keyboard.pressed[property];

    for(let property in Keyboard.released)
        if(Keyboard.released.hasOwnProperty(property))
            delete Keyboard.released[property];
};

Keyboard.keysForKeyCode = function(keyCode)
{
    let key = String.fromCharCode(keyCode);
    let keyLowerCase = key.toLowerCase();
    let keyUpperCase = key.toUpperCase();
    return [keyCode, keyLowerCase, keyUpperCase];
};