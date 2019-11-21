function Bone(parent, length, angle)
{
    this.parent = parent;
    this.length = length;

    if(this.parentPosition === undefined)
    {
        Object.defineProperty(this, 'parentPosition', {
            get: () => this.parent && this.parent.position ? this.parent.position : new Point()
        });
    }
    if(this.parentAngle === undefined)
    {
        Object.defineProperty(this, 'parentAngle', {
            get: () => this.parent && this.parent.angle != null ? this.parent.angle : 0
        });
    }

    Object.defineProperty(this, 'position',
    {
        get: () => Point.create(this.length, this.angle)
            .add(this.parentPosition),
        set: (position) =>
        {
            const positionDiff = position.subtract(this.parentPosition);
            this.length = Math.sqrt(positionDiff.lengthSq());
            this.angle = positionDiff.angle() || 0;
        }
    });

    this.angleLocal = 0;
    Object.defineProperty(this, 'angle',
    {
        get: () => this.angleLocal + this.parentAngle,
        set: (angle) => this.angleLocal = angle - this.parentAngle
    });
    this.angle = angle;
}

function Skeleton(parentEntity=null)
{
    Object.defineProperty(this, 'parentPosition', {
        get: () => parentEntity != null ? new Point(parentEntity.x, parentEntity.y) : new Point()
    });
    Object.defineProperty(this, 'parentAngle', {
        get: () => 0
    });

    Bone.call(this, null, 0, 0);
}
Bone.parents(Skeleton);