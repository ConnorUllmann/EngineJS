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

// https://gist.github.com/donpark/1796361
Perlin.prototype.refreshPerlinNoise = function(canvasSource=null)
{
    const contextDestination = this.perlinCanvas.getContext("2d");
    canvasSource = canvasSource || this.noiseCanvas;
    for (let size = 4; size <= canvasSource.width; size *= 2) {
        let x = (Math.random() * (canvasSource.width - size)) | 0;
        let y = (Math.random() * (canvasSource.height - size)) | 0;
        contextDestination.globalAlpha = 4 / size;
        contextDestination.drawImage(canvasSource, x, y, size, size, 0, 0, canvasSource.width, canvasSource.height);
    }
};

Perlin.prototype.renderToContext = function(context)
{
    context.drawImage(this.perlinCanvas,
        0, 0,
        this.perlinCanvas.width, this.perlinCanvas.height,
        0, 0,
        this.perlinCanvas.width, this.perlinCanvas.height);
};