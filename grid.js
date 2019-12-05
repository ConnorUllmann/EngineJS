/* tiles is a 2-dimensional array of objects */
function Grid(tiles)
{
    this.reset(tiles);
}

Grid.prototype.reset = function(tiles)
{
    this.tiles = tiles;
    this.rows = this.tiles.length;
    this.columns = Math.max.apply(null, this.tiles.map(o => o.length));
};

Grid.prototype.indicesInside = function(i, j)
{
    return i >= 0 && i < this.rows && j >= 0 && j < this.columns;
};

Grid.prototype.set = function(i, j, tile)
{
    return this.setInternal(i, j, tile);
};

Grid.prototype.setInternal = function(i, j, tile)
{
    if(!this.indicesInside(i, j))
        return;
    this.tiles[i][j] = tile;
};

Grid.prototype.get = function(i, j)
{
    return this.getInternal(i, j);
};

Grid.prototype.getInternal = function(i, j)
{
    if(!this.indicesInside(i, j))
        return null;
    return this.tiles[i][j];
};

Grid.CardinalNeighborsRelativeIndexMap = [
    Point.up,
    Point.right,
    Point.down,
    Point.left,
];
Grid.prototype.getCardinalNeighbors = function(i, j)
{
    return Grid.CardinalNeighborsRelativeIndexMap
        .map(o => this.getInternal(i + o.x, j + o.y))
        .filter(o => o !== null);
};

Grid.prototype.getSquareNeighbors = function(i, j)
{
    let neighbors = [];
    for(let ti = -1; ti <= 1; ti++)
    {
        for (let tj = -1; tj <= 1; tj++)
        {
            if(ti === 0 && tj === 0)
                continue;
            let neighbor = this.getInternal(i + ti, j + tj);
            if(neighbor != null)
                neighbors.push(neighbor);
        }
    }
    return neighbors;
};

Grid.prototype.getRaytraceTiles = function(iStart, jStart, iFinish, jFinish, isSolidCheck=null)
{
    let tiles = [];
    this.raytrace(iStart, jStart, iFinish, jFinish, (i, j) => {
        let tile = this.getInternal(i, j);
        if(isSolidCheck !== null && isSolidCheck(tile))
            return true;
        tiles.push(tile);
        return false;
    });
    return tiles;
};

Grid.prototype.isPathObstructed = function(iStart, jStart, iFinish, jFinish, isSolidCheck)
{
    let canSee = true;
    this.raytrace(iStart, jStart, iFinish, jFinish, (i, j) => {
        let tile = this.getInternal(i, j);
        if(isSolidCheck(tile))
        {
            canSee = false;
            return true;
        }
    });
    return !canSee;
};

// http://playtechs.blogspot.com/2007/03/raytracing-on-grid.html
// Allows for fractional i,j. For example, (iStart, jStart) = (1.5, 2.5) will raytrace starting from the center of tile (1, 2)
// onFinish only called if breakCheck was not triggered
Grid.prototype.raytrace = function(iStart, jStart, iFinish, jFinish, breakCheck=null)
{
    let iDiff = Math.abs(iFinish - iStart);
    let jDiff = Math.abs(jFinish - jStart);

    let iStartInt = Math.floor(iStart);
    let jStartInt = Math.floor(jStart);

    let totalTiles = 1;
    let iIncrement = 0;
    let jIncrement = 0;
    let error = 0;

    if (iDiff === 0)
    {
        iIncrement = 0;
        error = Number.MAX_SAFE_INTEGER;
    }
    else if (iFinish > iStart)
    {
        iIncrement = 1;
        totalTiles += Math.floor(iFinish) - iStartInt;
        error = (Math.floor(iStart) + 1 - iStart) * jDiff;
    }
    else
    {
        iIncrement = -1;
        totalTiles += iStartInt - Math.floor(iFinish);
        error = (iStart - Math.floor(iStart)) * jDiff;
    }

    if (jDiff === 0)
    {
        jIncrement = 0;
        error -= Number.MAX_SAFE_INTEGER;
    }
    else if (jFinish > jStart)
    {
        jIncrement = 1;
        totalTiles += Math.floor(jFinish) - jStartInt;
        error -= (Math.floor(jStart) + 1 - jStart) * iDiff;
    }
    else
    {
        jIncrement = -1;
        totalTiles += jStartInt - Math.floor(jFinish);
        error -= (jStart - Math.floor(jStart)) * iDiff;
    }

    while(totalTiles-- > 0)
    {
        if(breakCheck(iStartInt, jStartInt))
            break;

        if (error > 0)
        {
            jStartInt += jIncrement;
            error -= iDiff;
        }
        else
        {
            iStartInt += iIncrement;
            error += jDiff;
        }
    }
};

/* Executes the given function (which takes in the coordinates of the tile to set) on each tile in the Grid */
Grid.prototype.setEach = function(tileCall)
{
    for(let i = 0; i < this.rows; i++)
        for(let j = 0; j < this.columns; j++)
            this.setInternal(i, j, tileCall(i, j));
};


/* Executes the given function (which takes in a single tile object and its indices) on each tile in the Grid */
Grid.prototype.forEach = function(tileCall)
{
    for(let i = 0; i < this.rows; i++)
    {
        for(let j = 0; j < this.columns; j++)
        {
            const tile = this.getInternal(i, j);
            if(tile !== null)
                tileCall(tile, i, j);
        }
    }
};

Grid.prototype.map = function(valueGetter)
{
    const results = [];
    for(let i = 0; i < this.rows; i++)
        for(let j = 0; j < this.columns; j++)
            results.push(valueGetter(this.getInternal(i, j), i, j));
    return results;
};

/* Executes the given function (which takes in a single tile object and its indices) on each tile in the Grid
   and returns the first where it returns true */
Grid.prototype.firstWhere = function(tileCheck)
{
    for(let i = 0; i < this.rows; i++)
    {
        for(let j = 0; j < this.columns; j++)
        {
            const tile = this.getInternal(i, j);
            if(tile !== null)
                if(tileCheck(tile, i, j))
                    return tile;
        }
    }
    return null;
};

//https://lodev.org/cgtutor/floodfill.html
Grid.prototype.getRegion = function(i, j, getValue)
{
    let oldValue = getValue(this.getInternal(i, j));
    let region = [];

    let i1 = 0;
    let spanAbove = false;
    let spanBelow = false;

    let stack = new Stack();
    stack.push(new Point(i, j));
    while(true)
    {
        let pt = stack.pop();
        if(pt == null)
            break;
        i = pt.x;
        j = pt.y;

        i1 = i;
        while(i1 >= 0 && getValue(this.getInternal(i1, j)) === oldValue)
            i1--;
        i1++;

        spanAbove = false;
        spanBelow = false;
        while(i1 < this.rows && getValue(this.getInternal(i1, j)) === oldValue)
        {
            let tile = this.getInternal(i1, j);
            if(tile == null || region.includes(tile))
                break;
            region.push(tile);
            if(!spanAbove && j > 0 && getValue(this.getInternal(i1, j - 1)) === oldValue)
            {
                stack.push(new Point(i1, j - 1));
                spanAbove = true;
            }
            else if(spanAbove && j > 0 && getValue(this.getInternal(i1, j - 1)) !== oldValue)
            {
                spanAbove = false;
            }
            if(!spanBelow && j < this.columns - 1 && getValue(this.getInternal(i1, j + 1)) === oldValue)
            {
                stack.push(new Point(i1, j + 1));
                spanBelow = true;
            }
            else if(spanBelow && j < this.columns - 1 && getValue(this.getInternal(i1, j + 1)) !== oldValue)
            {
                spanBelow = false;
            }
            i1++;
        }
    }
    return region;
};