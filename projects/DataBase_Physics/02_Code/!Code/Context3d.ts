class Context3d
{
	Matrix: Matrix3;
	Context2d: Context2d;
	Scale: number;
	Distance: number;

	DrawList: Array<Td>

	constructor(context2d: Context2d)
	{
		this.Context2d = context2d;
		this.Scale = 300;
		this.Distance = 8;
		this.Matrix = new Matrix3();
		
		this.DrawList = new Array<Td>(); 
		
	}

	GetViewVector3() : Vector3
	{
		return this.Matrix.Transp().MultVector3(new Vector3(0, 0, 1));		
	}

	DrawCircle(pos: Vector3, radius: number, color: string | null): void
	{	
		var posGlobal = this.Matrix.MultVector3(pos);
		var radiusProj = posGlobal.Proj(radius, this.Distance) * this.Scale; 
		var z = posGlobal.Z;
		if(radiusProj <= 0)
			return;
		
		var posProj = posGlobal.ToVector2Proj(this.Distance).Mult(this.Scale); 

		this.DrawList.push(new CircleTd(posProj, radiusProj, color, z));	
	}

	DrawLine(pos1: Vector3, pos2: Vector3): void
	{
		var posGlobal1 = this.Matrix.MultVector3(pos1);
		var posGlobal2 = this.Matrix.MultVector3(pos2);
		var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var z = (posGlobal1.Z + posGlobal2.Z)/2;

		this.DrawList.push(new LineTd(posProj1, posProj2, z));
	}

	DrawArrow(pos1: Vector3, pos2: Vector3, length: number, width: number): void
	{
		var posGlobal1 = this.Matrix.MultVector3(pos1);
		var posGlobal2 = this.Matrix.MultVector3(pos2);
		var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var z = (posGlobal1.Z + posGlobal2.Z)/2;

		this.DrawList.push(new ArrowTd(posProj1, posProj2, length, width, z));
	}

	DrawText(t: string, pos: Vector3) : void
	{
/*		var posGlobal1 = this.Matrix.MultVector3(pos);
		var posProj = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var sceneCanvas = this.SceneCanvas;

		this.DrawList.push([posGlobal1.Z, () => 
		{
			sceneCanvas.FillText(t, sceneCanvas.Center.Plus(posProj));
		}]);
	*/	
	}

	StartFrame()
	{
		this.DrawList = new Array<Td>();
	}

	EndFrame()
	{
		var compare = function (a,b) {
		  if (a.Z < b.Z)
			return -1;
		  if (a.Z > b.Z)
			return 1;
		  return 0;
		};
	
		this.DrawList.sort(compare);

		for(var d of this.DrawList)
		{
			d.Paint(this.Context2d);
		}
	}

}

