function Stack() { this.array = []; }
Stack.prototype.pop = function() { return this.array.pop(); };
Stack.prototype.push = function(item) { this.array.push(item); };