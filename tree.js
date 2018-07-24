function Tree(root)
{
    this.root = root;
}

Tree.prototype.depth = function()
{
    let nodes = this.getTreeNodes();
    let depth = 0;
    for(let i = 0; i < nodes.length; i++)
    {
        if(nodes[i].depth > depth)
            depth = nodes[i].depth;
    }
    return depth;
};

Tree.prototype.getLeafTreeNodes = function()
{
    let nodes = this.getTreeNodes();
    let result = [];
    for(let i = 0; i < nodes.length; i++)
    {
        if(nodes[i].isLeaf())
            result.push(nodes[i]);
    }
    return result;
};

Tree.prototype.getTreeNodes = function()
{
    if(this.root == null)
        return [];

    let nodes = [this.root];
    let result = [];
    while(nodes.length > 0)
    {
        let node = nodes.pop();
        result.push(node);
        if(!node.isLeaf())
            nodes.push(...node.children.reversed());
    }
    return result;
};

Tree.prototype.getTreeNodesByDepth = function()
{
    let nodesByDepth = {};
    let nodes = this.getTreeNodes();
    for(let i = 0; i < nodes.length; i++)
    {
       if(!(nodes[i].depth in nodesByDepth))
           nodesByDepth[nodes[i].depth] = [];
       nodesByDepth[nodes[i].depth].push(nodes[i]);
    }
    return nodesByDepth;
};

TreeNode.ID = 0;
function TreeNode(parent)
{
    this.children = [];
    this.id = TreeNode.generateID();
    if(parent != null)
    {
        parent.children.push(this);
        this.depth = parent.depth + 1;
    }
    else
        this.depth = 0;
}

TreeNode.generateID = function()
{
    return TreeNode.ID++;
};

TreeNode.prototype.isLeaf = function()
{
    return this.children.length <= 0;
};

TreeNode.prototype.propagateDepth = function(depth)
{
    for(let i = 0; i < this.children.length; i++)
    {
        this.children[i].propagateDepth(this.depth+1);
    }
};

/*
let root = new TreeNode();
let tree = new Tree(root);

let A = new TreeNode(root);
let B = new TreeNode(root);
let C = new TreeNode(A);
let D = new TreeNode(A);
let E = new TreeNode(B);
let F = new TreeNode(D);
let G = new TreeNode(D);
let H = new TreeNode(D);
let I = new TreeNode(E);
let J = new TreeNode(I);

console.log(tree);
console.log(tree.getLeafTreeNodes());
*/