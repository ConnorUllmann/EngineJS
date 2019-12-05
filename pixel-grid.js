function PixelGrid(canvas)
{
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.refreshImageData();

    Object.defineProperty(this, 'pixels', {
        get: () => this.tiles,
        set: (pixels) => this.tiles = pixels
    });

    Grid.call(this, this.imageData.data);

}
Grid.parents(PixelGrid);

PixelGrid.prototype.reset = function(pixels)
{
    this.pixels = pixels;
    this.rows = this.canvas.height;
    this.columns = this.canvas.width;
};

PixelGrid.prototype.refreshImageData = function()
{
    // TODO: optional rectangle input to define what part of the image to use (null means all of it)
    this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
};

// Applies the changes made to the pixels in the grid to the actual canvas itself
PixelGrid.prototype.putImageData = function()
{
    this.context.putImageData(this.imageData, 0, 0);
};

// filter = Function that takes in an (x, y) position and a function which can retrieve the color of any pixel
//          in the canvas given its (x, y) position. It returns the resulting filtered Color.
PixelGrid.prototype.applyFilter = function(filter)
{
    this.setEach((x, y) => filter(x, y));
    this.putImageData();
};

// Necessary if you're going to use the values of neighboring pixels so that they aren't partially updated
// Note: it's slower than .applyFilter()
PixelGrid.prototype.applyFilterWithBuffer = function(filter)
{
    const pixelGridTemp = new PixelGrid(this.canvas);
    pixelGridTemp.setEach((x, y) => filter(x, y, this.get));
    this.setEach((x, y) => pixelGridTemp.get(x, y));
    this.putImageData();
};


PixelGrid.prototype.renderToContext = function(context, x=0, y=0)
{
    context.drawImage(this.canvas,
        0, 0, this.canvas.width, this.canvas.height,
        x, y, this.canvas.width, this.canvas.height);
};

PixelGrid.prototype.render = function(world, x=0, y=0)
{
    this.renderToContext(world.context, x - world.camera.x, y - world.camera.y);
};


PixelGrid.prototype.transformXYToIndex = function(x, y)
{
    const indices = this.transformXYToIndices(x, y);
    return this.transformIndicesToIndex(indices.i, indices.j);
};

PixelGrid.prototype.transformXYToIndices = function(x, y)
{
    return { i: Math.floor(y), j: Math.floor(x) };
};

PixelGrid.prototype.transformIndicesToIndex = function(i, j)
{
    return 4 * (j + i * this.columns);
};

PixelGrid.prototype.transformIndexToIndices = function(index)
{
    index /= 4;
    return {
        i: Math.floor(index / this.columns),
        j: index % this.columns
    };
};

PixelGrid.prototype.transformIndicesToXY = function(i, j)
{
    return new Point(j, i);
};

PixelGrid.prototype.transformIndexToXY = function(index)
{
    const indices = this.transformIndexToIndices(index);
    return this.transformIndicesToXY(indices.i, indices.j);
};

PixelGrid.prototype.set = function(x, y, tile)
{
    const indices = this.transformXYToIndices(x, y);
    return this.setInternal(indices.i, indices.j, tile);
};

PixelGrid.prototype.setInternal = function(i, j, color)
{
    if(!this.indicesInside(i, j))
        return;
    const index = this.transformIndicesToIndex(i, j);
    this.pixels[index] = color.red;
    this.pixels[index+1] = color.green;
    this.pixels[index+2] = color.blue;
    this.pixels[index+3] = color.alpha * 255;
};

PixelGrid.prototype.get = function(x, y)
{
    const indices = this.transformXYToIndices(x, y);
    return this.getInternal(indices.i, indices.j);
};

PixelGrid.prototype.getInternal = function(i, j)
{
    if(!this.indicesInside(i, j))
        return null;
    const index = this.transformIndicesToIndex(i, j);
    return new Color(this.pixels[index], this.pixels[index+1], this.pixels[index+2], this.pixels[index+3]/255);
};

PixelGrid.prototype.setEach = function(pixelCall)
{
    Grid.prototype.setEach.call(this, (i, j) => {
        const point = this.transformIndicesToXY(i, j);
        return pixelCall(point.x, point.y);
    });
};

PixelGrid.prototype.forEach = function(pixelCall)
{
    Grid.prototype.forEach.call(this, (pixel, i, j) => {
        const point = this.transformIndicesToXY(i, j);
        pixelCall(pixel, point.x, point.y);
    });
};

PixelGrid.prototype.map = function(valueGetter)
{
    return Grid.prototype.map.call(this, (pixel, i, j) => {
        const point = this.transformIndicesToXY(i, j);
        return valueGetter(pixel, point.x, point.y);
    });
};

PixelGrid.prototype.firstWhere = function(pixelCheck)
{
    return Grid.prototype.firstWhere.call(this, (tile, i, j) => {
        const point = this.transformIndicesToXY(i, j);
        return pixelCheck(tile, point.x, point.y);
    });
};