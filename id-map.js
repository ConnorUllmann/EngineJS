function IdMap(getId, getValue=null)
{
    this.objectById = new Map();
    this.getId = getId;
    this.getValue = getValue;

    this.keepFirstAdded = false;
}

IdMap.prototype.add = function(obj)
{
    const getId = this.getId(obj);
    if(!this.keepFirstAdded || !(getId in this.objectById))
        this.objectById[getId] = obj;
    return this;
};

IdMap.prototype.clear = function()
{
    this.objectById.clear();
};

IdMap.prototype.delete = function(obj)
{
    const has = this.has(obj);
    if(has)
        delete this.objectById[this.getId(obj)];
    return has;
};

// TODO: implement getValue here
IdMap.prototype.entries = function()
{
    return this.objectById.entries();
};

IdMap.prototype.forEach = function(call)
{
    for(let id of this.keys())
        call({ value: this.get(id), key: id });
};

IdMap.prototype.has = function(obj)
{
    return this.getId(obj) in this.objectById;
};

IdMap.prototype.get = function(id)
{
    return this.getValue
        ? this.getValue(this.objectById[id])
        : this.objectById[id];
};

IdMap.prototype.keys = function()
{
    return Object.keys(this.objectById);
};

IdMap.prototype.values = function()
{
    return this.getValue
        ? Object.values(this.objectById).map(o => this.getValue(o))
        : Object.values(this.objectById);
};

IdMap.prototype[Symbol.iterator] = function()
{
    const values = this.values();
    let count = 0;
    return {
        next()
        {
            const done = count >= values.length;
            const value = done ? undefined : values[count++];
            return { value, done };
        }
    }
};

// const set = new IdMap((o) => o.id);
// set.keepFirstAdded = true;
//
// const a = { id: 0, name: 'a' };
// const b = { id: 1, name: 'b' };
// const c = { id: 2, name: 'c' };
// const d = { id: 1, name: 'd' };
//
// set.add(a);
// set.add(b);
// set.add(c);
// set.add(d);
//
// console.log(`has(a) = ${set.has(a)}`);
// console.log(`has(b) = ${set.has(b)}`);
// console.log(`has(c) = ${set.has(c)}`);
// console.log(`has(d) = ${set.has(d)}`);
// console.log(`has({id:0}) = ${set.has({id:0})}`);
// console.log(`has({id:5}) = ${set.has({id:5})}`);
// console.log(`has(-1) = ${set.has(-1)}`);
//
// console.log(set);
// for(let element of set)
//     console.log(element);