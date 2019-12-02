function Swarm()
{
    this.swarmInstincts = [];
    this.predators = [];
}

Swarm.prototype.addPredator = function(predator)
{
    this.predators.push(predator);
};

Swarm.prototype.removePredator = function(predator)
{
    this.predators.removeThis(predator);
};

Swarm.prototype.add = function(swarmer)
{
    this.swarmInstincts.push(new SwarmInstinct(swarmer));
};

Swarm.prototype.remove = function(swarmer)
{
    this.swarmInstincts.removeThis(this.swarmInstincts.first(o => o.swarmer === swarmer));
};

Swarm.prototype.update = function()
{
    for(let swarmInstinct of this.swarmInstincts)
        swarmInstinct.updateAngle(this.swarmInstincts, this.predators);
};

Swarm.prototype.getAngle = function(swarmer)
{
    return this.swarmInstincts.first(o => o.swarmer === swarmer).angle;
};

Swarm.prototype.isAvoidingPredator = function(swarmer)
{
    return this.swarmInstincts.first(o => o.swarmer === swarmer).isAvoidingPredator;
};

Swarm.prototype.isRepulsed = function(swarmer)
{
    return this.swarmInstincts.first(o => o.swarmer === swarmer).isRepulsed;
};

function SwarmInstinct(swarmer)
{    
    this.swarmer = swarmer;
    this.angle = 0;

    this.isRepulsed = false;
    this.isAvoidingPredator = false;

    // RadiusOfRepulsion must be <= RadiusOfAlignment
    this.RadiusOfRepulsion = 30;
    // RadiusOfAlignment must be <= RadiusOfAttraction
    this.RadiusOfAlignment = 70;
    this.RadiusOfAttraction = 400;
    this.RadiusOfPredatorAvoidance = 400;
    this.RepulsionMultiplier = 50;
    this.AlignmentMultiplier = 1;
    this.AttractionMultiplier = 1;
}

SwarmInstinct.prototype.visibleRectangle = function() {
    return new Rectangle(
        this.swarmer.x - this.RadiusOfAttraction,
        this.swarmer.y - this.RadiusOfAttraction,
        2 * this.RadiusOfAttraction,
        2 * this.RadiusOfAttraction);
};

SwarmInstinct.prototype.updateAngle = function(swarmInstincts, predators)
{
    const radiusSq = this.RadiusOfPredatorAvoidance * this.RadiusOfPredatorAvoidance;
    const visiblePredators = predators.filter(o => Utils.distanceSq(o.x, o.y, this.swarmer.x, this.swarmer.y) <= radiusSq);
    const predatorDirection = visiblePredators
        .map(o => new Point(this.swarmer.x, this.swarmer.y).subtract(new Point(o.x, o.y)).normalized(this.RepulsionMultiplier))
        .reduce((sum, point) => { sum.x += point.x; sum.y += point.y; return sum; }, new Point());
    if(predatorDirection.lengthSq() > 0.01)
    {
        this.isAvoidingPredator = true;
        this.angle = predatorDirection.angle();
    }
    else
    {
        this.isAvoidingPredator = false;

        // reset to start as isRepulsed will update inside swarmVectorForNeighbor
        this.isRepulsed = false;
        this.angle = swarmInstincts
            .map(swarmInstinct => this.swarmVectorForNeighbor(swarmInstinct))
            .reduce((sum, point) => sum.add(point))
            .angle();
    }
};

SwarmInstinct.prototype.swarmVectorForNeighbor = function(neighborSwarmInstinct)
{
    if (this.swarmer === neighborSwarmInstinct.swarmer)
        return new Point();
    const position = new Point(this.swarmer.x, this.swarmer.y);
    const neighborPosition = new Point(neighborSwarmInstinct.swarmer.x, neighborSwarmInstinct.swarmer.y);
    const distanceSquared = neighborPosition.subtract(position).lengthSq();
    const isRepulsed = distanceSquared <= this.RadiusOfRepulsion * this.RadiusOfRepulsion;
    if(isRepulsed)
        this.isRepulsed = true;
    return distanceSquared < 0.001
        ? new Point()
        : isRepulsed
            ? position.subtract(neighborPosition).normalized(this.RepulsionMultiplier)
            : distanceSquared <= this.RadiusOfAlignment * this.RadiusOfAlignment
                ? Point.create(this.AlignmentMultiplier, neighborSwarmInstinct.angle)
                : distanceSquared <= this.RadiusOfAttraction * this.RadiusOfAttraction
                    ? neighborPosition.subtract(position).normalized(this.AttractionMultiplier)
                    : new Point();
};