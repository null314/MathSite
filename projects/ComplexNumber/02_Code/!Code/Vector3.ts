class Vector3
{
	X: number;
	Y: number;
	Z: number;

	constructor(x: number, y: number, z: number)
 	{
		this.X = x;
		this.Y = y;
		this.Z = z;
	}

	Get(r: number): number
	{
		switch(r)
		{
			case 0: return this.X;
			case 1: return this.Y;
			case 2: return this.Z;
		}
	}

	Set(r: number, v: number): void
	{
		switch(r)
		{
			case 0: 
				this.X = v;
				break;
			case 1: 
				this.Y = v;
				break;
			case 2: 
				this.Z = v;
				break;
		}
	}
	
	Plus(vec: Vector3): Vector3
	{
		return new Vector3(this.X + vec.X, this.Y + vec.Y, this.Z + vec.Z); 
	}

	Minus(vec: Vector3): Vector3
	{
		return new Vector3(this.X - vec.X, this.Y - vec.Y, this.Z - vec.Z); 
	}

	Mult(a: number): Vector3
	{
		return new Vector3(this.X * a, this.Y * a, this.Z * a); 
	}

	Div(a: number): Vector3
	{
		return new Vector3(this.X / a, this.Y / a, this.Z / a); 
	}
	
	ToVector2(): Vector2
	{
		return new Vector2(this.X, this.Y);
	}
	
	ToVector2Proj(dist: number): Vector2
	{
		return new Vector2(this.Proj(this.X, dist), this.Proj(this.Y, dist));
	}

	Proj(r: number, dist: number): number
	{
		return r / (dist - this.Z);
	}

	Len(): number
	{
		return Math.sqrt(this.X*this.X + this.Y*this.Y + this.Z*this.Z);
	}

	Norm(): Vector3
	{
		var len = this.Len();
		return this.Div(len);
	}

	MultVector3(v: Vector3): Vector3
	{
		return new Vector3(this.Y * v.Z - this.Z*v.Y, -this.X * v.Z + this.Z*v.X, this.X * v.Y - this.Y*v.X);		
	}
}
