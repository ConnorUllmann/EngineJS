function StateMachine()
{
    this.states = {};
    this.currentStateName = null;
}

StateMachine.prototype.reset = function()
{
    const state = this.getCurrentState();
    if(state.finish)
        state.finish();
    this.currentStateName = null;
};

StateMachine.prototype.addState = function(stateName, startCall=null, updateCall=null, finishCall=null)
{
    this.states[stateName] = {
        start: startCall,
        update: updateCall,
        finish: finishCall
    };
};

StateMachine.prototype.getCurrentState = function()
{
    return this.states[this.currentStateName];
};

StateMachine.prototype.changeState = function(stateName)
{
    if(stateName == null)
        throw "Cannot change a StateMachine to a null state except by resetting it!";
    if(!(stateName in this.states))
        throw `Cannot change a StateMachine to a state ('${stateName}') that has not been added to it! Available states are: ${this.states.length <= 0 ? 'n/a' : Object.keys(this.states).join(', ')}`

    const statePrev = this.getCurrentState();
    const stateNext = this.states[stateName];
    if(statePrev.finish)
        statePrev.finish();
    this.currentStateName = stateName;
    if(stateNext.start)
        stateNext.start();
};

StateMachine.prototype.start = function(initialStateName)
{
    if(initialStateName == null)
        throw "Cannot start a StateMachine with a null state!";
    if(Object.keys(this.states.length).length <= 0)
        throw "Cannot start a StateMachine which has had no states added to it!";
    this.changeState(initialStateName);
};

StateMachine.prototype.update = function()
{
    const state = this.getCurrentState();
    if(state.update)
        state.update();
};