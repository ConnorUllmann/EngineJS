function Bone(parent, positionLocal)
{
    this.parent = parent;
    this.positionLocal = positionLocal;
    Object.defineProperty(this, 'position',
    {
        get: () => this.positionLocal
            .rotate(this.parent && this.parent.angleLocal != null ? this.parent.angleLocal : 0)
            .add(this.parent && this.parent.position ? this.parent.position : new Point()),
        configurable: true
    });

    this.angleLocal = 0;
    Object.defineProperty(this, 'angle',
    {
        get: () => this.angleLocal + (this.parent && this.parent.angle != null ? this.parent.angle : 0)
    });

    this._angleAroundParent = 0;
    Object.defineProperty(this, 'angleAroundParent',
    {
        get: () => this._angleAroundParent,
        set: (angleRadians) =>
        {
            if(angleRadians === this._angleAroundParent)
                return;
            this.rotateAroundParent(angleRadians - this._angleAroundParent);
            this._angleAroundParent = angleRadians;
        }
    });
}

Bone.prototype.rotateAroundParent = function(angleRadians)
{
    this.positionLocal = this.positionLocal.rotate(angleRadians);
};

function Skeleton(parentEntity)
{
    Bone.call(this, null, new Point());

    Object.defineProperty(this, 'position',
    {
        get: () => new Point(parentEntity.x, parentEntity.y),
    });
}
Bone.parents(Skeleton);