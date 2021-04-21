

enum PlaneTdMathObjectState
{
	Plane,
	AxisX,
	AxisY,	
}


class PlaneTdMathObject extends TdMathObject
{
	StartX: number;
	EndX: number;
	StartY: number;
	EndY: number;
	Step: number;
	LenX: number;
	LenY: number;
	CenterX: number;
	CenterY: number;
	Scale: number;
	Func: (x: number, y: number) => number;
	PlaneTdMathObjectState: PlaneTdMathObjectState;
	
	constructor(startX: number, endX: number, startY: number, endY: number, step: number, scale: number, func: (x: number, y: number) => number,  pos: Vector2, size: Vector2, centerShift: Vector2)
	{
		super(pos, size, centerShift);		
		
		this.StartX = startX;
		this.StartY = startY;
		this.EndX = endX;
		this.EndY = endY;
		this.Step = step;
		this.LenX = this.EndX - this.StartX;
		this.LenY = this.EndY - this.StartY;
		this.CenterX = (this.StartX + this.EndX)/2;
		this.CenterY = (this.StartY + this.EndY)/2;
		this.Scale = scale;
		this.Func = func;
		this.PlaneTdMathObjectState = PlaneTdMathObjectState.Plane;
		
		var thisObject = this;
		this.AddButton(new Vector2(10, 10), new Vector2(10, 10), "black", function() { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.Plane;});
		this.AddButton(new Vector2(20, 10), new Vector2(10, 10), "black", function() { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.AxisX;});
		this.AddButton(new Vector2(30, 10), new Vector2(10, 10), "black", function() { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.AxisY;});

		this.AddButton(new Vector2(100, 10), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftUp(); });
		this.AddButton(new Vector2(100, 30), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftDown(); });
		this.AddButton(new Vector2(90, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftLeft(); });
		this.AddButton(new Vector2(110, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftRight(); });
	}
	
	ButtonShiftUp()
	{
		this.Shift(0, -0.1);
	}

	ButtonShiftDown()
	{
		this.Shift(0, 0.1);
	}

	ButtonShiftLeft()
	{
		this.Shift(-0.1, 0);
	}
	
	ButtonShiftRight()
	{
		this.Shift(0.1, 0);
	}
	
	Shift(shiftX: number, shiftY: number)
	{	
		this.StartX += this.LenX * shiftX;
		this.EndX += this.LenX * shiftX;
		this.StartY += this.LenY * shiftY;
		this.EndY += this.LenY * shiftY;
		this.CenterX = (this.StartX + this.EndX)/2;
		this.CenterY = (this.StartY + this.EndY)/2;	
	}

	Paint3dVirt(): void
	{
		this.Context3d.DrawArrow(this.Convert(new Vector3(this.StartX, 0, 0)), this.Convert(new Vector3(this.EndX, 0, 0)), 5, 2);
		this.Context3d.DrawArrow(this.Convert(new Vector3(0, 0, this.StartY)), this.Convert(new Vector3(0, 0, this.EndY)), 5, 2);
		
		if(this.PlaneTdMathObjectState == PlaneTdMathObjectState.Plane)
		{		
			for(var x = this.StartX; x <= this.EndX; x += this.Step)
				for(var y = this.StartY; y <= this.EndY; y += this.Step)
				{
					var value = this.Func(x, y);				
					this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step/2*this.Scale, "white");			
				}
		}

		if(this.PlaneTdMathObjectState == PlaneTdMathObjectState.AxisX)
		{
			for(var x = this.StartX; x <= this.EndX; x += this.Step)
			{
				var y = 0;
				var value = this.Func(x, y);			
				this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step/2*this.Scale, "white");			
			}
		}

		if(this.PlaneTdMathObjectState == PlaneTdMathObjectState.AxisY)
		{
			for(var y = this.StartY; y <= this.EndY; y += this.Step)
			{
				var x = 0;
				var value = this.Func(x, y);			
				this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step/2*this.Scale, "white");			
			}
			
		}
	}
	
	Convert(pos: Vector3)
	{
		return new Vector3((pos.X - this.CenterX)*this.Scale, -pos.Y*this.Scale, -(pos.Z-this.CenterY)*this.Scale);		
	}
	
}

