class TestAxisTdMathObject extends TdMathObject
{
	
	constructor(pos: Vector2, size: Vector2, centerShift: Vector2)
	{
		super(pos, size, centerShift);		
	}
	

	Paint3dVirt(): void
	{
		this.Context3d.DrawLine(new Vector3(-1, 0, 0), new Vector3(1, 0, 0));
		this.Context3d.DrawLine(new Vector3(0, -1, 0), new Vector3(0, 1, 0));
		this.Context3d.DrawLine(new Vector3(0, 0, -1), new Vector3(0, 0, 1));
		this.Context3d.DrawCircle(new Vector3(1.5, 0, 0), 0.5, "white");
		this.Context3d.DrawCircle(new Vector3(0, 1.5, 0), 0.5, "white");
		this.Context3d.DrawCircle(new Vector3(0, 0, 1.5), 0.5, "white");
		this.Context3d.DrawCircle(new Vector3(-1.5, 0, 0), 0.5, "white");
		this.Context3d.DrawCircle(new Vector3(0, -1.5, 0), 0.5, "white");
		this.Context3d.DrawCircle(new Vector3(0, 0, -1.5), 0.5, "white");
	}
	
}

