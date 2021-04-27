class Context3d
{
	Matrix: Matrix3;
	Context2d: Context2d;
	Scale: number;
	Distance: number;

	DrawList: Array<Primitive>

	constructor(context2d: Context2d)
	{
		this.Context2d = context2d;
		this.Scale = 300;
		this.Distance = 8;
		this.Matrix = new Matrix3();
		
		this.DrawList = new Array<Primitive>(); 
	}

	GetViewVector3() : Vector3
	{
		return this.Matrix.Transp().MultVector3(new Vector3(0, 0, 1));		
	}

	DrawCircle(pos: Vector3, radius: number, lineColor: string | null, lineWidth: number, fillColor: string | null): void
	{	
		var posGlobal = this.Matrix.MultVector3(pos);
		var radiusProj = posGlobal.Proj(radius, this.Distance) * this.Scale; 
		var z = posGlobal.Z;
		if(radiusProj <= 0)
			return;
		
		var posProj = posGlobal.ToVector2Proj(this.Distance).Mult(this.Scale); 

		this.DrawList.push(new CirclePrimitive(posProj, radiusProj, lineColor, lineWidth, fillColor, z));	
	}

	DrawLine(pos1: Vector3, pos2: Vector3, lineColor: string, lineWidth: number): void
	{
		var posGlobal1 = this.Matrix.MultVector3(pos1);
		var posGlobal2 = this.Matrix.MultVector3(pos2);
		var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var z = (posGlobal1.Z + posGlobal2.Z)/2;

		this.DrawList.push(new LinePrimitive(posProj1, posProj2, lineColor, lineWidth, z));
	}

	DrawArrow(pos1: Vector3, pos2: Vector3, arrowLength: number, arrowWidth: number, color: string, lineWidth: number): void
	{
		var posGlobal1 = this.Matrix.MultVector3(pos1);
		var posGlobal2 = this.Matrix.MultVector3(pos2);
		var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var z = (posGlobal1.Z + posGlobal2.Z)/2;

		this.DrawList.push(new ArrowPrimitive(posProj1, posProj2, arrowLength, arrowWidth, color, lineWidth, z));
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
		this.DrawList = new Array<Primitive>();
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

