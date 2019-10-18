function Gamepads()
{
    this.leftAnalogStickByIndex = {};
    this.rightAnalogStickByIndex = {};
    this.leftTriggerByIndex = {};
    this.rightTriggerByIndex = {};

    this.downByIndex = {};
    this.pressedByIndex = {};
    this.releasedByIndex = {};

    this.deadzoneDefault = 0.2;

    this.buttonMappings = {
        0: ['a', 'A'],
        1: ['b', 'B'],
        2: ['x', 'X'],
        3: ['y', 'Y'],
        4: ['lb', 'LB'],
        5: ['rb', 'RB'],
        // 6 - left trigger
        // 7 - right trigger
        8: ['select', 'back'],
        9: ['start'],
        10: ['l3', 'L3'],
        11: ['r3', 'R3'],
        12: ['up', 'UP'],
        13: ['down', 'DOWN'],
        14: ['left', 'LEFT'],
        15: ['right', 'RIGHT'],
        // 16 - ???
    };
}

Gamepads.prototype.isAvailable = function()
{
    return !!(navigator.getGamepads);
};

Gamepads.prototype.update = function()
{
    if(!this.isAvailable())
        return;

    const gamepads = Object.values(navigator.getGamepads())
        .filter(o => o != null && o.connected)
        .reduce((dict, o) => { return { ...dict, [o.index]: o }; }, {});

    for(let gamepadIndex in gamepads)
    {
        const gamepad = gamepads[gamepadIndex];
        if (gamepad == null)
            return;

        this.leftAnalogStickByIndex[gamepadIndex] = new Point(this.applyDeadzone(gamepad.axes[0]), this.applyDeadzone(gamepad.axes[1]));
        this.rightAnalogStickByIndex[gamepadIndex] = new Point(this.applyDeadzone(gamepad.axes[2]), this.applyDeadzone(gamepad.axes[3]));
        this.leftTriggerByIndex[gamepadIndex] = gamepad.buttons[6].value;
        this.rightTriggerByIndex[gamepadIndex] = gamepad.buttons[7].value;

        const downNext = {};
        const pressedNext = {};
        const releasedNext = {};

        if(!(gamepadIndex in this.downByIndex))
            this.downByIndex[gamepadIndex] = {};
        if(!(gamepadIndex in this.pressedByIndex))
            this.pressedByIndex[gamepadIndex] = {};
        if(!(gamepadIndex in this.releasedByIndex))
            this.releasedByIndex[gamepadIndex] = {};

        for(let buttonIndex = 0; buttonIndex < gamepad.buttons.length; buttonIndex++)
        {
            if(buttonIndex === 6 || buttonIndex === 7)
                continue;

            const buttonNames = this.tryGetValueOrDefaultFromDict(this.buttonMappings, buttonIndex, []);
            const wasDown = this.tryGetValueOrDefaultFromDict(
                this.tryGetValueOrDefaultFromDict(this.downByIndex, gamepadIndex, {}),
                buttonNames[0],
                false
            );
            const isDown = gamepad.buttons[buttonIndex].pressed;
            const isPressed = isDown && !wasDown;
            const isReleased = !isDown && wasDown;

            for(let buttonName of buttonNames)
            {
                this.downByIndex[gamepadIndex][buttonName] = isDown;
                this.pressedByIndex[gamepadIndex][buttonName] = isPressed;
                this.releasedByIndex[gamepadIndex][buttonName] = isReleased;
            }
        }
    }
};

Gamepads.prototype.tryGetValueOrDefaultFromDict = function(dict, key, defaultValue) {
    if(dict == null || !(key in dict))
        return defaultValue;
    const value = dict[key];
    if(value == null)
        return defaultValue;
    return value;
};

Gamepads.prototype.applyDeadzone = function(value, deadzone=null)
{
    const deadzoneFinal = deadzone != null ? deadzone : this.deadzoneDefault;
    return Math.abs(value) >= deadzoneFinal
        ? Math.sign(value) * (Math.abs(value) - deadzoneFinal) / (1 - deadzoneFinal)
        : 0;
};

Gamepads.prototype.getButtonValue = function(valueByGamepadIndex, buttonName, gamepadIndex=0)
{
    return this.tryGetValueOrDefaultFromDict(
        this.tryGetValueOrDefaultFromDict(
            valueByGamepadIndex,
            gamepadIndex,
            {}),
        buttonName,
        false);
};


Gamepads.prototype.leftAnalogStick = function(gamepadIndex=0, deadzone=0.2) {
    return this.tryGetValueOrDefaultFromDict(this.leftAnalogStickByIndex, gamepadIndex, new Point());
};

Gamepads.prototype.rightAnalogStick = function(gamepadIndex=0, deadzone=0.2) {
    return this.tryGetValueOrDefaultFromDict(this.rightAnalogStickByIndex, gamepadIndex, new Point());
};

Gamepads.prototype.leftTrigger = function(gamepadIndex=0) {
    return this.tryGetValueOrDefaultFromDict(this.leftTriggerByIndex, gamepadIndex, 0);
};

Gamepads.prototype.rightTrigger = function(gamepadIndex=0) {
    return this.tryGetValueOrDefaultFromDict(this.rightTriggerByIndex, gamepadIndex, 0);
};

Gamepads.prototype.down = function(buttonName, gamepadIndex=0)
{
    return this.getButtonValue(this.downByIndex, buttonName, gamepadIndex);
};

Gamepads.prototype.pressed = function(buttonName, gamepadIndex=0)
{
    return this.getButtonValue(this.pressedByIndex, buttonName, gamepadIndex);
};

Gamepads.prototype.released = function(buttonName, gamepadIndex=0)
{
    return this.getButtonValue(this.releasedByIndex, buttonName, gamepadIndex);
};