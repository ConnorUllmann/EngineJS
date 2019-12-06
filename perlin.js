function Perlin(width, height, alpha=1)
{
    this.noiseCanvas = Utils.createCanvas(width, height);
    this.perlinCanvas = Utils.createCanvas(width, height);
    this.refreshRandomNoise(alpha);
    this.refreshPerlinNoise();
    this.perlinPixelGrid = new PixelGrid(this.perlinCanvas);
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

Perlin.prototype.getPixelColor = function(x, y)
{
    return this.perlinPixelGrid.get(x, y);
};

// https://gist.github.com/donpark/1796361
Perlin.prototype.refreshPerlinNoise = function()
{
    const contextDestination = this.perlinCanvas.getContext("2d");
    const canvasSource = this.noiseCanvas;
    for (let size = 4; size <= canvasSource.width; size *= 2)
    {
        let x = (Math.random() * (canvasSource.width - size)) | 0;
        let y = (Math.random() * (canvasSource.height - size)) | 0;
        contextDestination.globalAlpha = 4 / size;
        contextDestination.drawImage(canvasSource, x, y, size, size, 0, 0, canvasSource.width, canvasSource.height);
    }
};

Perlin.prototype.normalizePerlinNoise = function()
{
    const perlinValues = this.perlinPixelGrid.map((color, i, j) => color.red);
    let perlinValuesMin = perlinValues[0];
    let perlinValuesMax = perlinValues[0];
    for(let i = 1; i < perlinValues.length; i++)
    {
        const value = perlinValues[i];
        if(value < perlinValuesMin)
            perlinValuesMin = value;
        if(value > perlinValuesMax)
            perlinValuesMax = value;
    }

    const filter = (x, y) =>
    {
        const oldValue = this.perlinPixelGrid.get(x, y).red;
        const normal = (oldValue - perlinValuesMin) / (perlinValuesMax - perlinValuesMin);
        const newValue = Utils.clamp(Math.floor(256 * normal), 0, 255);
        return new Color(newValue, newValue, newValue, 1);
    };
    this.perlinPixelGrid.applyFilter(filter);
};

Perlin.prototype.blurPerlinNoise = function(range=1)
{
    const filter = (x, y) =>
    {
        let neighborSum = 0;
        let neighborCount = 0;
        for (let i = -range; i <= range; i++)
        {
            for (let j = -range; j <= range; j++)
            {
                const neighbor = this.perlinPixelGrid.get(x + i, y + j);
                if (neighbor) {
                    neighborSum += neighbor.red;
                    neighborCount++;
                }
            }
        }
        const neighborMean = Math.floor(neighborSum / neighborCount);
        return new Color(neighborMean, neighborMean, neighborMean, 1);
    };
    this.perlinPixelGrid.applyFilterWithBuffer(filter);
};

Perlin.prototype.renderToContext = function(context, x=0, y=0)
{
    this.perlinPixelGrid.renderToContext(context, x, y);
};

Perlin.prototype.renderToWorld = function(world, x=0, y=0)
{
    this.perlinPixelGrid.render(world, x, y);
};