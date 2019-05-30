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
        <script src="EngineJS/camera.js"></script>
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

### World

A manager for the main update/render loop for entities, mouse, and keyboard inputs. Newly-created entities are added to the world's update loop at the start of each frame and destroyed entities are removed at the end of each frame. Each world maintains a list of all the entities it contains in the order that they are updated (based on their depth property and the order they were created).

### Entity

An object which belongs to one World and updates/renders in its loop. Entities can be destroyed, made inactive (so they no longer update as part of their world), made invisible, and moved in front of and behind other entities using the "depth" property. Each entity is also given a unique id when they are added to a world. New types of objects in the game world should be child classes of Entity, like below:

```javascript
function ExampleEntity(x, y, world)
{
    Entity.call(this, x, y, world);
}
ExampleEntity.prototype = Object.create(Entity.prototype);
ExampleEntity.prototype.constructor = ExampleEntity;

ExampleEntity.prototype.update = function()
{
    // per-frame update logic here
}

ExampleEntity.prototype.render = function()
{
    // per-frame render logic here
}
```

Adding one of these entities to a world is as easy as instantiating a new instance and passing in the world to which it should belong:
```javascript
// creates a new ExampleEntity in the middle of the canvas
new ExampleEntity(world.canvas.width/2, world.canvas.height/2, world);
```

### Keyboard

### Mouse

### Camera

### Timer


## Static Classes

### Draw

Contains several different functions which can be executed within Entity render functions to draw to a world (or HTML5 canvas context). For example, the following will draw a red circle with radius 20px at every ExampleEntity's position each frame:

```javascript
ExampleEntity.prototype.render = function()
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

