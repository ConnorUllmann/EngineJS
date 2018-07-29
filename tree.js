function Tree(root)
{
    this.root = root;
    this.nodes = [];
}

Tree.prototype.toJsonObj = function(...additionalFields)
{
    let list = [];
    for(let i = 0; i < this.nodes.length; i++)
    {
        let node = this.nodes[i];
        let tempObj = {};
        tempObj["childrenIds"] = node.childrenIds;
        tempObj["id"] = node.id;
        if(additionalFields != null)
        {
            for(let j = 0; j < additionalFields.length; j++)
                tempObj[additionalFields[j]] = node[additionalFields[j]];
        }
        list.push(tempObj);
    }

    return list;
};

Tree.prototype.toJson = function()
{
    return JSON.stringify(this.toJsonObj());
};

Tree.FromJsonObj = function(jsonObj)
{
    let tree = new Tree();
    tree.fromJsonObj(jsonObj);
    return tree;
};
Tree.FromJson = function(json)
{
    return Tree.FromJsonObj(JSON.parse(json));
};
Tree.prototype.fromJsonObj = function(nodes)
{
    let mapping = {};
    for(let i = 0; i < nodes.length; i++)
    {
        let parent = nodes[i];
        mapping[parent.id] = [];
        for(let j = 0; j < parent.childrenIds.length; j++)
            mapping[parent.id].push(parent.childrenIds[j]);
    }

    let nodesById = {};
    for(let i = 0; i < nodes.length; i++)
        nodesById[nodes[i].id] = nodes[i];

    let ids = Object.keys(nodesById);
    for(let i = 0; i < nodes.length; i++)
    {
        let node = nodes[i];
        for(let j = 0; j < node.childrenIds.length; j++)
        {
            let index = ids.indexOf(node.childrenIds[j].toString());
            if(index >= 0)
                ids.removeAt(index);
        }
    }
    if(ids.length != 1)
        alert("Error in project file--multiple root nodes in the timeline.");
    let rootId = ids[0];
    this.root = nodesById[rootId];
    this.nodes = nodes;

    for(let parentId in mapping)
        nodesById[parentId].childrenIds = mapping[parentId];

    this.propagateDepth(this.root, 0, nodesById);
};
Tree.prototype.fromJson = function(json)
{
    this.fromJsonObj(JSON.parse(json));
};

Tree.prototype.propagateDepth = function(node, depth, nodesById)
{
    node.depth = depth;
    for(let i = 0; i < node.childrenIds.length; i++)
        this.propagateDepth(nodesById[node.childrenIds[i]], depth+1, nodesById);
};

Tree.prototype.childIdToParentIdMapping = function()
{
    let mapping = {};
    let nodes = this.nodes;
    for(let i = 0; i < nodes.length; i++)
    {
        let parent = nodes[i];
        for(let j = 0; j < parent.childrenIds.length; j++)
        {
            mapping[parent.childrenIds[j]] = parent.id;
        }
    }
    return mapping;
};

Tree.prototype.getTreeNodesById = function()
{
    if(this.root == null)
        return [];

    let result = {};
    let nodes = this.nodes;
    for(let i = 0; i < nodes.length; i++)
        result[nodes[i].id] = nodes[i];
    return result;
};

Tree.prototype.depth = function()
{
    let nodes = this.nodes;
    let depth = 0;
    for(let i = 0; i < nodes.length; i++)
    {
        if(nodes[i].depth > depth)
            depth = nodes[i].depth;
    }
    return depth + 1; //0 counts as a depth, so having 3 depths = [0, 1, 2]
};

Tree.prototype.getLeafTreeNodes = function()
{
    let nodes = this.nodes();
    let result = [];
    for(let i = 0; i < nodes.length; i++)
    {
        if(nodes[i].childrenIds <= 0)
            result.push(nodes[i]);
    }
    return result;
};

Tree.prototype.getTreeNodesByDepth = function()
{
    let nodesByDepth = {};
    let nodes = this.nodes;
    for(let i = 0; i < nodes.length; i++)
    {
       if(!(nodes[i].depth in nodesByDepth))
           nodesByDepth[nodes[i].depth] = [];
       nodesByDepth[nodes[i].depth].push(nodes[i]);
    }
    return nodesByDepth;
};

Tree.NodeId = 0;

Tree.prototype.addNode = function(node, parent)
{
    if(parent != null && Tree.NodeId <= parent.id)
        Tree.NodeId = parent.id+1;

    node.id = Tree.NodeId++;
    if(parent != null)
    {
        parent.childrenIds.push(node.id);
        node.depth = parent.depth + 1;
    }
    else
        node.depth = 0;
    this.nodes.push(node);
};

function TreeNode()
{
    this.childrenIds = [];
    this.id = -1;
    this.depth = -1;
}

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