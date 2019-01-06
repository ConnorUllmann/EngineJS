/* tiles is a 2-dimensional array of objects */
function Grid(tiles)
{
    this.tiles = tiles;
    this.rows = this.tiles.length;
    this.columns = Math.max.apply(null, this.tiles.map(o => o.length));
}

Grid.prototype.indicesInside = function(i, j)
{
    return i >= 0 && i < this.rows && j >= 0 && j < this.columns;
};

Grid.prototype.set = function(i, j, tile)
{
    if(!this.indicesInside(i, j))
        return;
    this.tiles[i][j] = tile;
};

Grid.prototype.get = function(i, j)
{
    if(!this.indicesInside(i, j))
        return null;
    return this.tiles[i][j];
};

Grid.CardinalNeighborsRelativeIndexMap = [
    new Point(0, -1),
    new Point(1, 0),
    new Point(0, 1),
    new Point(-1, 0),
];
Grid.prototype.getCardinalNeighbors = function(i, j)
{
    return Grid.CardinalNeighborsRelativeIndexMap
        .map(o => this.grid.get(i + o.x, j + o.y))
        .filter(o => o !== null);
};

/* Executes the given function (which takes in the coordinates of the tile to set) on each tile in the Grid */
Grid.prototype.setEach = function(tileAction)
{
    for(let i = 0; i < this.tiles.length; i++)
    {
        for(let j = 0; j < this.tiles[i].length; j++)
        {
            this.tiles[i][j] = tileAction(i, j);
        }
    }
};


/* Executes the given function (which takes in a single tile object) on each tile in the Grid */
Grid.prototype.forEach = function(tileAction)
{
    for(let i = 0; i < this.tiles.length; i++)
    {
        let tileRow = this.tiles[i];
        for(let j = 0; j < tileRow.length; j++)
        {
            let tile = tileRow[j];
            if(tile !== null)
                tileAction(tile);
        }
    }
};

/* Executes the given function (which takes in a single tile object) on each tile in the Grid
   and returns the first where it returns true */
Grid.prototype.firstWhere = function(tileEval)
{
    for(let i = 0; i < this.tiles.length; i++)
    {
        let tileRow = this.tiles[i];
        for(let j = 0; j < tileRow.length; j++)
        {
            let tile = tileRow[j];
            if(tile !== null)
                if(tileEval(tile))
                    return tile;
        }
    }
    return null;
};