function World(transparentBackground=false)
{
    this.canvas = null;
    this.context = null;
    this.camera = new Camera(this);
    this.mouse = new Mouse(this);
    this.keyboard = new Keyboard();
    this.gamepads = new Gamepads();

    // should not be changed after calling .start() as it will have no effect
    this.__transparentBackground = transparentBackground;

    this.backgroundColor = this.__transparentBackground ? null : new Color(128, 128, 128);

    this.entities = [];
    this.entitiesByClass = {};
    this.entitiesById = {};
    this.entitiesToAdd = [];
    this.entitiesToRemove = [];
    this.singleFrameRenderCallsByDepth = {};
    this.entityID = 0;

    // milliseconds since the last frame
    this.delta = 0;
    this._delta = 0;
    this.firstUpdate = null;
    this.lastUpdate = null;

    this.fps = 60;
    this.fpsVisible = true;
    this.fixedFrameRate = false;

    this.debug = false;
    this.debugFpsTrackListMaxSize = 10;
    this.debugFpsTrackList = [];
    this.debugFpsCurrent = 0;
    this.debugDisplay = {};
    this.debugDisplayTextHeight = 20;
    this.debugDisplayFont = `${this.debugDisplayTextHeight}px Helvetica`;
    this.debugDisplayBackgroundColor = Color.black;
    this.debugDisplayTextColor = Color.white;

    Object.defineProperty(this, 'millisecondsSinceStart', {
        get: () => Date.now() - this.firstUpdate
    });
    Object.defineProperty(this, 'millisecondsPerFrame', {
        get: () => 1000 / this.fps,
        set: (x) => this.fps = 1000 / x
    });
    Object.defineProperty(this, 'deltaNormal', {
        get: () => this.delta / this.millisecondsPerFrame
    });
}

World.prototype.start = function(canvasId)
{
    this.canvas = document.getElementById(canvasId);
    if (this.canvas == null)
        throw "Canvas doesn't exist!";
    if(!this.canvas.getContext)
        throw "Cannot retrieve canvas context!";
    this.context = this.canvas.getContext('2d', { alpha: this.__transparentBackground });

    this.firstUpdate = null;
    this.lastUpdate = Date.now();

    this.mouse.start();
    this.keyboard.start();

    //Need the lambda or else this.render() will have the Window instance as "this" inside the function scope
    setInterval(() => this.render(), this.millisecondsPerFrame);
};

World.prototype.clearCanvas = function(color)
{
    if(color == null)
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return;
    }
    this.context.fillStyle = color.toString();
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

World.prototype.render = function()
{
    this.debugDisplay["update"] = `${Utils.elapsedMilliseconds(() => this.updateAll())}ms`;
    this.clearCanvas(this.backgroundColor);
    this.debugDisplay["render"] = `${Utils.elapsedMilliseconds(() => this.renderAll())}ms`;
    this.mouse.update();
    this.keyboard.update();
    this.gamepads.update();
};

World.prototype.updateAll = function()
{
    if(this.firstUpdate == null)
        this.firstUpdate = Date.now();

    if(Key.TILDA in this.keyboard.pressed)
        this.debug = !this.debug;

    // Update delta
    let now = Date.now();
    this._delta = now - this.lastUpdate;
    this.delta = this.fixedFrameRate ? this.millisecondsPerFrame : this._delta;
    this.lastUpdate = now;

    // Add the new entities that are queued to be created.
    while(this.entitiesToAdd.length > 0)
    {
        let e = this.entitiesToAdd.shift();
        this.entities.push(e);
        this.entitiesById[e.id] = e;
        if(!(e.class in this.entitiesByClass))
            this.entitiesByClass[e.class] = [];
        this.entitiesByClass[e.class].push(e);
        e.added();
    }

    // Re-sort entities after adding the new ones
    this._sortByUpdateOrder();

    // Update all entities
    let entities = this.entities.filter(o => o.active);
    for(let i = 0; i < entities.length; i++)
        entities[i].update();
    for(let i = 0; i < entities.length; i++)
        entities[i].postUpdate();

    // Destroy entities that are queued to be destroyed.
    while(this.entitiesToRemove.length > 0)
    {
        let e = this.entitiesToRemove.pop();
        let ind = this.entities.indexOf(e);
        if(ind > -1)
        {
            this.entities.splice(ind, 1);
            delete this.entitiesById[e.id];
            this.entitiesByClass[e.class].removeThis(e);
            e.removed();
            e.destroyed = true;
        }
    }
};

World.prototype.renderAll = function()
{
    // Render all entities (re-sorting them in case there were changes during the updates)
    this._sortByUpdateOrder();
    this.entities
        .filter(o => o.visible)
        .forEach(o => this.queueRenderCall(o.depth, () => o.render()));
    Object.keys(this.singleFrameRenderCallsByDepth)
        .map(depth => Number(depth))
        .sort((a,b) => b-a)
        .map(depth => this.singleFrameRenderCallsByDepth[depth])
        .forEach(renderCalls => renderCalls.forEach(renderCall => renderCall()));
    this.singleFrameRenderCallsByDepth = {};

    if(this.debug || this.fpsVisible)
    {
        let xOffsetDebugDisplayText = 0;
        const xMarginBetweenDebugDisplayText = 10;
        const yMarginBetweenDebugDisplayText = 8;

        this.debugFpsTrackList.unshift(Math.floor(1000/this._delta));
        if(this.debugFpsTrackList.length >= this.debugFpsTrackListMaxSize)
        {
            this.debugFpsCurrent = this.debugFpsTrackList.reduce((totalFps, fps) => totalFps + fps) / this.debugFpsTrackList.length;
            this.debugFpsTrackList.length = 0;
        }

        const debugDisplay = { fps: Math.floor(this.debugFpsCurrent), entities: this.entities.length, ...this.debugDisplay };
        const debugDisplayKeys = [
            'fps',
            'update',
            'render',
            'entities'
        ];
        debugDisplayKeys.push(...Object.keys(debugDisplay).filter(key => !debugDisplayKeys.includes(key)));
        for(let name of debugDisplayKeys)
        {
            const value = debugDisplay[name];
            const text = `${name}: ${value}`;
            const textWidth = Draw.textWidth(this, text, this.debugDisplayFont);
            const fullWidth = textWidth + 2 * xMarginBetweenDebugDisplayText;
            const fullHeight = this.debugDisplayTextHeight + 2 * yMarginBetweenDebugDisplayText;

            Draw.rectangle(this,
                this.camera.x + xOffsetDebugDisplayText, this.camera.y,
                fullWidth+1, fullHeight, this.debugDisplayBackgroundColor);

            Draw.text(this, text,
                this.camera.x + xOffsetDebugDisplayText + xMarginBetweenDebugDisplayText,
                this.camera.y + yMarginBetweenDebugDisplayText,
                this.debugDisplayTextColor);

            xOffsetDebugDisplayText += fullWidth;
        }
    }
};

World.prototype.destroyAll = function()
{
    for(let i = 0; i < this.entities.length; i++)
        this.entities[i].destroy();
};

World.prototype.getEntitiesOfClass = function(_class)
{
    if(_class in this.entitiesByClass)
        return this.entitiesByClass[_class];
    return [];
};

World.prototype._sortByUpdateOrder = function()
{
    this.entities.sort(this._compareUpdateOrders);
};

World.prototype._compareUpdateOrders = function(a, b)
{
    if(a.depth === b.depth)
        return a.id - b.id;
    return a.depth - b.depth;
};

World.prototype._addEntity = function(entity)
{
    if(this.entitiesToAdd.includes(entity))
        return;

    this.entitiesToAdd.push(entity);
    entity.id = this.entityID++;
    entity.world = this;
};

World.prototype._destroyEntity = function(entity)
{
    if(this.entitiesToRemove.includes(entity))
        return;

    this.entitiesToRemove.push(entity);
};

World.prototype.queueRenderCall = function(depth, renderCall)
{
    if(depth in this.singleFrameRenderCallsByDepth)
        this.singleFrameRenderCallsByDepth[depth].push(renderCall);
    else
        this.singleFrameRenderCallsByDepth[depth] = [renderCall];
};