# EngineJS

## Getting Started

First, create a folder for your project and download this repo into it. Create a new _index.html_ file inside your project folder like the following:
```html
<html>
    <head>    
        <script src="EngineJS/stack.js"></script>
        <script src="EngineJS/utils.js"></script>
        <script src="EngineJS/point.js"></script>
        <script src="EngineJS/rectangle.js"></script>
        <script src="EngineJS/grid.js"></script>
        <script src="EngineJS/heap.js"></script>
        <script src="EngineJS/path.js"></script>
        <script src="EngineJS/range.js"></script>
        <script src="EngineJS/tree.js"></script>
        <script src="EngineJS/color.js"></script>
        <script src="EngineJS/draw.js"></script>
        <script src="EngineJS/entity.js"></script>
        <script src="EngineJS/world.js"></script>
        <script src="EngineJS/timer.js"></script>
        <script src="EngineJS/mouse.js"></script>
        <script src="EngineJS/keyboard.js"></script>
    
        <title>Untitled Game</title>
        
        <style>
            #gameCanvas
            {
                width: 640px;
                height: 480px;
            }
        </style>
    </head>
    <body>
        <canvas oncontextmenu="return false" id="gameCanvas" width="640" height="480"></canvas>
        <script type="text/javascript" charset="utf-8">
            var world = new World();
            world.backgroundColor = new Color(40, 40, 40);
            world.debug = true;
            world.start('gameCanvas');
        </script>
    </body>
</html>
```

## Game Classes

Below are the set of classes which update every frame of the game.

### World

A manager for the main update/render loop for entities, mouse, and keyboard inputs. Newly-created entities are added to the world's update loop at the start of each frame and destroyed entities are removed at the end of each frame. Each world maintains a list of all the entities it contains in the order that they are updated (based on their depth property and the order they were created).

### Entity

An object which belongs to one World and updates/renders in its loop. Entities can be destroyed, made inactive (so they no longer update as part of their world), made invisible, and moved in front of and behind other entities using the "depth" property. Each entity is also given a unique id when they are added to a world. New types of objects in the game world should be child classes of Entity, like below:

```javascript
function Player(x, y, world)
{
    Entity.call(this, x, y, world);
}
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{
    // per-frame update logic here
}

Player.prototype.render = function()
{
    // per-frame render logic here
}
```

Adding one of these entities to a world is as easy as instantiating a new instance and passing in the world to which it should belong:
```javascript
// creates a new Player in the middle of the canvas
new Player(world.canvas.width/2, world.canvas.height/2, world);
```

### Keyboard

The Keyboard class tracks all keyboard inputs (unsurprisingly) and is instantiated and updated by its World. For example, you might want to check inside an Entity's update or render function whether the "A" button was pressed this frame:
```javascript
'a' in this.world.keyboard.pressed
'A' in this.world.keyboard.pressed
```
Some keys have additional names which can be used, especially if there isn't a specific character for that key. For example, to check if the user released the "enter" key this frame, we can use the following expression:
```javascript
'enter' in this.world.keyboard.released
```
Lastly, you can check if a key is currently held down during the current frame (which will be true on the frame it is pressed but false on the frame it is released), you can check the Keyboard's "down" dictionary—for example, to see if the player is currently holding down "backspace":
```javascript
'backspace' in this.world.keyboard.down
```

### Mouse

The Mouse class tracks all mouse inputs and is instantiated and updated by its World just like the Keyboard. The mouse position, (i.e. _mouse.x_ and _mouse.y_) corresponds to the position of the user's mouse within the canvas where _(0, 0)_ is considered to be the top-left corner of the canvas and _(world.canvas.width, world.canvas.height)_ is the bottom-right corner. 
Mouse pressed/released/down status is tracked through the following variables much in the same way the Keyboard class tracks key inputs:
```javascript
world.mouse.leftPressed
world.mouse.leftReleased
world.mouse.leftDown

world.mouse.rightPressed
world.mouse.rightReleased
world.mouse.rightDown
```
Other properties, such as the amount the user has scrolled with the mouse this frame and whether or not the user has "focused" on the canvas, are also tracked. Lastly, _mouse.touchscreen_ indicates whether the user is using a device with touchscreen capability (e.g. to disable mouse hovering effects)

### Timer

Timers are simple objects that update each frame to interpolate their `value` variable from 0 to 1. There are a few types, but each is used the same way. First, you instantiate the Timer and then you call _timer.update_ each frame thereafter, making sure to check if _timer.triggered_ is true to indicate that the Timer has finished (or restarted, in the case of LoopTimers). On its first update, _timer.started_ will also be set to true.

For example, consider that we want to add a "turret" entity to our game which should shoot a bullet once every 2 seconds. In the turret's constructor, you would instantiate a new Timer:
```javascript
function Turret(x, y, world)
{
    Entity.call(this, x, y, world);
    
    this.shootTimer = new LoopTimer(2)
}
```
Then update _shootTimer_ and fire a bullet if it has triggered, like so:
```javascript
Turret.prototype.update = function()
{
    this.shootTimer.update();
    if(this.shootTimer.triggered)
        this.shootBullet();
}
```
Now what if, for instance, you instead want the turret to get a bullet ready and wait until it can see the player before it shoots? With the above timer, the turret might have shot a bullet when it couldn't see the player, then spend a whole 2 seconds waiting to reload now that it can see them!

In this case, you would change _shootTimer_ into a simple Timer instead, which will wait until it is reset before it will trigger again. This time we'll make use of _timer.isFinished()_ which returns true when the Timer has triggered but has not yet been reset. The update function would instead look like this:
```javascript
Turret.prototype.update = function()
{
    this.shootTimer.update();
    if(this.canSeePlayer() && this.shootTimer.isFinished())
    {
        this.shootBullet();
        this.shootTimer.reset();
    }
}
```
Lastly, Timers can be paused and unpaused by setting the boolean variable _timer.paused_

## Static Classes

### Draw

Contains several different functions which can be executed within Entity render functions to draw to a world (or HTML5 canvas context). For example, the following will draw a red circle with radius 20px at the Player's position each frame:

```javascript
Player.prototype.render = function()
{
    Draw.circle(this.world, this.x, this.y, 20, new Color(255, 0, 0));
}
```

### Utils

A set of one-off useful functions such as the following, which returns the closest value to _x_ between _min_ and _max_:
```javascript
Utils.clamp(6, 0, 5) // === 5
```

Or the following function, which returns the smallest difference (in radians) between any two angles:
```javascript
Utils.angleDiffRadians(Math.PI / 2, Math.PI * 10) // === -Math.PI / 2
```

This file also contains several array extension methods, for example:
```javascript
.clone()
.clear()
.removeThis()
.removeAt()
.reversed()
.flattened()
.sorted()
.sample()
.swap()
.any()
.first()
.max()
.maxOf()
.min()
.minOf()
.sum()
```

## Simple Types

### Point

### Rectangle

### Grid

### Path

### Color

### Range


## Data Structures

### Heap

### Stack

### Tree

