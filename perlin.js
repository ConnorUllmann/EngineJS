function Perlin(width, height, alpha=1)
{
    this.noiseCanvas = Utils.createCanvas(width, height);
    this.perlinCanvas = Utils.createCanvas(width, height);
    this.refreshRandomNoise(alpha);
    this.refreshPerlinNoise();
}

Perlin.prototype.refreshRandomNoise = function(alpha=1)
{
    const x = 0;
    const y = 0;
    const context = this.noiseCanvas.getContext("2d");
    const imageData = context.getImageData(x, y, this.noiseCanvas.width, this.noiseCanvas.height);
    const pixels = imageData.data;
    for(let i = 0; i < pixels.length; i += 4)
    {
        pixels[i] = pixels[i+1] = pixels[i+2] = (Math.random() * 256) | 0;
        pixels[i+3] = alpha * 255;
    }
    context.putImageData(imageData, x, y);
};

// filter = function that takes in a Point and a Color and returns a Color
Perlin.prototype.applyFilter = function(canvas, filter)
{
    const x = 0;
    const y = 0;
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(x, y, canvas.width, canvas.height);
    const pixels = imageData.data;
    const pixelsTemp = new Uint8ClampedArray(pixels.length);
    const filterGetPixel = (x, y) => this.getPixel(imageData, canvas.width, x, y);
    for(let i = 0; i < pixels.length; i += 4)
    {
        const index = i / 4;
        const yPixel = Math.floor(index / canvas.width);
        const xPixel = index % canvas.width;
        const inputColor = new Color(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]/255);
        const filteredColor = filter(
            new Point(xPixel, yPixel),
            inputColor,
            filterGetPixel);
        pixelsTemp[i] = filteredColor.red;
        pixelsTemp[i+1] = filteredColor.green;
        pixelsTemp[i+2] = filteredColor.blue;
        pixelsTemp[i+3] = filteredColor.alpha * 255;
    }
    for(let i = 0; i < pixels.length; i++) {
        pixels[i] = pixelsTemp[i];
    }
    context.putImageData(imageData, x, y);
};

Perlin.prototype.getPixel = function(imageData, width, x, y)
{
    const index = (y * width + x) * 4;
    const pixels = imageData.data;
    return new Color(pixels[index], pixels[index+1], pixels[index+2], pixels[index+3]/255);
};

// https://gist.github.com/donpark/1796361
Perlin.prototype.refreshPerlinNoise = function(canvasSource=null)
{
    const contextDestination = this.perlinCanvas.getContext("2d");
    canvasSource = canvasSource || this.noiseCanvas;
    for (let size = 4; size <= canvasSource.width * 16; size *= 2) {
        let x = (Math.random() * (canvasSource.width - size)) | 0;
        let y = (Math.random() * (canvasSource.height - size)) | 0;
        contextDestination.globalAlpha = 4 / size;
        contextDestination.drawImage(canvasSource, x, y, size, size, 0, 0, canvasSource.width, canvasSource.height);
    }
};

Perlin.prototype.renderToContext = function(context, x=0, y=0)
{
    context.drawImage(this.perlinCanvas,
        0, 0,
        this.perlinCanvas.width, this.perlinCanvas.height,
        x, y,
        this.perlinCanvas.width, this.perlinCanvas.height);
};

Perlin.prototype.renderToWorld = function(world, x=0, y=0)
{
    this.renderToContext(world.context, x - world.camera.x, y - world.camera.y);
};