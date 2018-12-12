var canvas = null;
var context = null;
var backgroundColor = "#eee";
var world = new World();

function World()
{
    this.canvas = null;
    this.context = null;
    this.backgroundColor = "#ccc";
    this.camera = new Camera(0, 0);
}
World.prototype.start = function(canvasId)
{
    this.canvas = canvas = document.getElementById(canvasId);
    if (this.canvas == null)
        throw "Canvas doesn't exist!";
    if(!this.canvas.getContext)
        throw "Cannot retrieve canvas context!";

    //Need the lambda or else this.render() will have the Window instance as "this" inside the function scope
    setInterval(() => this.render(), 60);

    this.context = context = this.canvas.getContext('2d');
    Mouse.start(this.canvas);
    Keyboard.start();
};
World.prototype.clearCanvas = function(color)
{
    this.context.fillStyle = color.toString();
    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
};
World.prototype.render = function()
{
    Entity.updateAll();
    this.clearCanvas(this.backgroundColor);
    Entity.renderAll();
    Mouse.update();
    Keyboard.update();
};