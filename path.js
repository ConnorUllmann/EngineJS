function PathMap(grid, getSolid)
{
    this.grid = grid;
    this.getSolid = getSolid; // function with one input (an object in the grid) that returns a boolean indicating if the tile on the grid is "solid" or not
    this.initializeGridPath();
}

PathMap.prototype.initializeGridPath = function(canMoveDiagonally=false)
{
    let tiles = [];
    for(let i = 0; i < this.grid.rows; i++)
    {
        let row = [];
        for (let j = 0; j < this.grid.columns; j++)
            row.push(new PathTile(this.grid, i, j));
        tiles.push(row);
    }
    this.gridPath = new Grid(tiles);
    this.neighborsCallback = canMoveDiagonally
        ? (i, j) => this.gridPath.getSquareNeighbors(i, j)
        : (i, j) => this.gridPath.getCardinalNeighbors(i, j);
};

PathMap.prototype.reset = function()
{
    this.gridPath.forEach(o => o.reset());
};

PathMap.prototype.distance = function(tile0, tile1)
{
    return Math.sqrt(
            (tile0.i - tile1.i) * (tile0.i - tile1.i) +
            (tile0.j - tile1.j) * (tile0.j - tile1.j));
};

PathMap.prototype.findPath = function(iStart, jStart, iTarget, jTarget, useClosestNonSolidTileIfTargetIsSolid=false)
{
    this.reset();

    let open = new Heap((a, b) => a.compare(b));
    let closed = [];
    let path = [];

    let first = this.gridPath.get(
        Math.max(0, Math.min(this.gridPath.rows-1, iTarget)),
        Math.max(0, Math.min(this.gridPath.columns-1, jTarget)));
    if(this.getSolid(first.gridObject))
    {
        if (!useClosestNonSolidTileIfTargetIsSolid)
            return [];
        first = this.gridPath.tiles.flattened()
            .filter(o => !this.getSolid(o.gridObject))
            .minOf(o => Utils.distanceSq(o.i, o.j, iTarget, jTarget));
        if(first === null)
            return [];
        return this.findPath(iStart, jStart, first.i, first.j, useClosestNonSolidTileIfTargetIsSolid);
    }

    let last = this.gridPath.get(
        Math.max(0, Math.min(this.gridPath.rows-1, iStart)),
        Math.max(0, Math.min(this.gridPath.columns-1, jStart)));
    if(this.getSolid(last.gridObject))
        return [];

    first.setHeuristicProperties(0, this.distance(first, last));
    open.add(first);

    let current = null;
    while(!open.empty())
    {
        current = open.pop();
        closed.push(current);

        if(current === last)
        {
            current.reset();
            while(true) // some say I'm bold
            {
                path.push(current);
                let neighborsBacktrack = this.neighborsCallback(current.i, current.j);
                for(let neighbor of neighborsBacktrack)
                    if(neighbor.steps != null && (current.steps == null || neighbor.steps < current.steps))
                        current = neighbor;
                if(current === first)
                {
                    path.push(current);
                    return path.map(o => o.gridObject);
                }
            }
        }
        let neighbors = this.neighborsCallback(current.i, current.j);
        for(let neighbor of neighbors)
        {
            if(this.getSolid(neighbor.gridObject) || closed.includes(neighbor))
                continue;

            let neighborSteps = current.steps + this.distance(current, neighbor);
            let neighborTargetDistance = this.distance(neighbor, last);
            if(open.contains(neighbor))
            {
                let neighborHeuristic = PathTile.heuristic(neighborSteps, neighborTargetDistance);
                if(neighborHeuristic < PathTile.heuristic(neighbor.steps, neighbor.targetDistance))
                    neighbor.setHeuristicProperties(neighborSteps, neighborTargetDistance);
            }
            else
            {
                neighbor.setHeuristicProperties(neighborSteps, neighborTargetDistance);
                open.add(neighbor);
            }
        }
    }
    return [];
};



function PathTile(grid, i, j)
{
    this.grid = grid;
    this.i = i;
    this.j = j;
    this.gridObject = this.grid.get(this.i, this.j);
    this.reset();
}

PathTile.prototype.reset = function()
{
    this.setHeuristicProperties(null, null);
};

PathTile.prototype.compare = function(other)
{
    if(other == null)
        return 0;
    let diff = PathTile.heuristic(this.steps, this.targetDistance) - PathTile.heuristic(other.steps, other.targetDistance);
    return Math.sign(diff);
};

PathTile.prototype.setHeuristicProperties = function(steps, targetDistance)
{
    this.steps = steps;
    this.targetDistance = targetDistance;
};


PathTile.heuristic = function(steps, targetDistance)
{
    if(steps == null || targetDistance == null)
        return Number.MAX_SAFE_INTEGER;
    return steps + targetDistance; //Square targetDistance to prefer travelling diagonally even if we only look ats cardinal neighbors
};

