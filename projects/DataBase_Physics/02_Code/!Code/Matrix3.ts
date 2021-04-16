class Matrix3
{
	Value: number[][];

	constructor()
 	{
		this.Value = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
	}
	
	Get(r: number, c: number): number
	{
		return this.Value[r][c];
	}

	Set(r: number, c: number, v: number): void
	{
		this.Value[r][c] = v;
	}

	GetAxisX(): Vector3
	{
		return new Vector3(this.Value[0][0], this.Value[1][0], this.Value[2][0]);
	}

	GetAxisY(): Vector3
	{
		return new Vector3(this.Value[0][1], this.Value[1][1], this.Value[2][1]);
	}

	GetAxisZ(): Vector3
	{
		return new Vector3(this.Value[0][2], this.Value[1][2], this.Value[2][2]);
	}

	Mult(m: Matrix3): Matrix3
	{
		var res = new Matrix3();
 		var array = [0, 1, 2];

		for (let r of array) 
		{
			for (let c of array) 
			{
				var sum = 0;
				for (let i of array) 
				{
					sum += this.Value[r][i] * m.Value[i][c];
				}
				res.Value[r][c] = sum; 
			}
		}
		return res;
	}

	MultVector3(v: Vector3): Vector3
	{
		var res = new Vector3(0, 0, 0);
 		var array = [0, 1, 2];

		for (let r of array) 
		{
			var sum = 0;
			for (let i of array) 
			{
				sum += this.Value[r][i] * v.Get(i);
			}
			res.Set(r, sum); 
		}
		return res;
	}
 
	Transp(): Matrix3
	{
		var res = new Matrix3();
 		var array = [0, 1, 2];

		for (let r of array) 
		{
			for (let c of array) 
			{
				res.Value[r][c] = this.Value[c][r]; 
			}
		}
		return res;	
	}
	
	
	static RotationMatrix(angle: number, axis1: number, axis2: number): Matrix3
	{
		var m = new Matrix3();
		var c = Math.cos(angle); 
		var s = Math.sin(angle);
 		
		m.Set(axis1, axis1, c);
		m.Set(axis2, axis2, c);
		m.Set(axis1, axis2, s);
		m.Set(axis2, axis1, -s);
		
		return m;
	}

	static RotationMatrixX(angle: number): Matrix3
	{
		return this.RotationMatrix(angle, 1, 2); 
	}

	static RotationMatrixY(angle: number): Matrix3
	{
		return this.RotationMatrix(angle, 0, 2); 
	}

	static RotationMatrixZ(angle: number): Matrix3
	{
		return this.RotationMatrix(angle, 0, 1); 
	}

}
