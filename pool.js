// generateCall = argumentless function that returns a new object of the type that should be in the pool.
// resetCall = function whose first argument is the particle to reset followed by any number of custom arguments
//          that must match those provided when calling the pool's .get() method to retrieve a new object.
//
//      Example:
//          function Particle() { this.x = 0; this.y = 0; }
//          Particle.prototype.reset = function(x, y) { this.x = x; this.y = y; };
//
//          const generateCall = () => new Particle();
//          const resetCall = (particle, x, y) => { particle.x = x; particle.y = y; };
//          const pool = new Pool(generateCall, resetCall);
//
//          const particleA = pool.get(30, 40);
//          const particleB = pool.get(50, 60);
//          const particleC = pool.get(70, 80);
//
//          if(particleA.isDead)
//              pool.add(particleA);
function Pool(generateCall, resetCall)
{
    this.generateCall = generateCall;
    this.resetCall = resetCall;
    this.objects = [];
    this.capacity = null;
}

Pool.prototype.warm = function(count)
{
    for(let i = 0; i < count; i++)
        this.add();
};

Pool.prototype.get = function(...args)
{
    const pop = this.objects.pop() || this.generateCall();
    this.resetCall(pop, ...args);
    return pop;
};

Pool.prototype.add = function(obj = null)
{
    if(this.isFull())
        return false;

    this.objects.push(obj || this.generateCall());
    return true;
};

Pool.prototype.isFull = function()
{
    return this.capacity != null && this.objects.length >= this.capacity;
};