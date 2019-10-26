function Camera(_world, _x=0, _y=0)
{
    this.world = _world;
    Rectangle.call(this, _x, _y, 0, 0);

    Object.defineProperty(this, 'w', {
        get: function() { return this.world.canvas == null ? 0 : this.world.canvas.width; }
    });
    Object.defineProperty(this, 'h', {
        get: function() { return this.world.canvas == null ? 0 : this.world.canvas.height; }
    });
}
Rectangle.parents(Camera);