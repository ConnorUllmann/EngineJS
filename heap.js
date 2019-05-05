function Heap(compare=null, min=true)
{
    this.elements = [];
    this.min = min;
    this.compare = compare !== null
        ? compare
        : function(a, b) { return a - b; };
}

Heap.prototype.contains = function(element) { return this.elements.includes(element) };

Heap.prototype.add = function(element)
{
    this.elements.push(element);
    this.fix();
};

Heap.prototype.addRange = function(elements)
{
    this.elements.push(...elements);
    this.fix();
};

Heap.prototype.deleteAt = function(index)
{
    if(this.empty())
        return;

    let element = this.elements.pop();
    if(this.empty())
        return;
    this.elements[index] = element;
    this.fix();
};

Heap.prototype.empty = function()
{
    return this.elements.length === 0;
};

Heap.prototype.pop = function()
{
    if(this.empty())
        return null;

    let element = this.elements[0];
    this.deleteAt(0);
    return element;
};

Heap.prototype.top = function()
{
    if(this.empty())
        return null;
    return this.elements[0];
};

Heap.prototype.fix = function()
{
    for(let i = this.elements.length - 1; i > 0; i--)
    {
        let parentIndex = Math.floor(Math.max(0, (i+1)/2-1));
        let result = this.compare(this.elements[parentIndex], this.elements[i]);
        if((this.min ? result : -result) > 0)
            this.elements.swap(parentIndex, i);
    }
};