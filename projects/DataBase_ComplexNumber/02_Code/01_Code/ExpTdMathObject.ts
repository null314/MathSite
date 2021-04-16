


class ExpTdMathObject extends TdMathObject
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
	Center: Complex;
	Angle: number;
	StartC: Complex;
	EndC: Complex;
	OrtC: Complex;
	
	Func: (c: Complex) => Complex;
	
	constructor(startX: number, endX: number, startY: number, endY: number, step: number, scale: number, func: (x: Complex) => Complex,  pos: Vector2, size: Vector2, centerShift: Vector2)
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
		this.Center = new Complex(0, 0);
		this.Angle = 0;
		this.Recalc();
		
		
		var thisObject = this;
		this.AddButton(new Vector2(10, 10), new Vector2(10, 10), "black", function() { thisObject.ButtonRotateLeft();});
		this.AddButton(new Vector2(20, 10), new Vector2(10, 10), "black", function() { thisObject.ButtonRotateRight();});

		this.AddButton(new Vector2(100, 10), new Vector2(10, 10), "black", function() { thisObject.ButtonShift(new Complex(0, 0.5)); });
		this.AddButton(new Vector2(100, 30), new Vector2(10, 10), "black", function() { thisObject.ButtonShift(new Complex(0, -0.5)); });
		this.AddButton(new Vector2(90, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShift(new Complex(-0.5, 0));});
		this.AddButton(new Vector2(110, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShift(new Complex(0.5, 0));});
	}
	
	ButtonRotateRight()
	{
		this.Angle -= Math.PI/12;
		if(this.Angle < 0)
			this.Angle = 0;
		
		this.Recalc();
		
	}

	ButtonRotateLeft()
	{
		this.Angle += Math.PI/12;
		if(this.Angle > Math.PI/2)
			this.Angle = Math.PI/2;
		this.Recalc();
	}

	ButtonShift(c: Complex)
	{
		this.Center = this.Center.Plus(c);
		this.Recalc();
	}
	
	Recalc()
	{	
		var dir = new Complex(Math.cos(this.Angle), Math.sin(this.Angle));
		var k = Math.tan(this.Angle);
			
		this.OrtC = dir.Mult(new Complex(0, 1));
		var startC1 = this.Calc1(this.StartX, k);
		var endC1 = this.Calc1(this.EndX, k);

		var startC2 = this.Calc2(this.StartY, k);
		var endC2 = this.Calc2(this.EndY, k);
		
		this.StartC = startC1.Im > startC2.Im ? startC1 : startC2;
		this.EndC = endC1.Im < endC2.Im ? endC1 : endC2;
		
	}

	Calc1(x: number, k: number): Complex
	{
		return new Complex(x, k*(x - this.Center.Re)+this.Center.Im);
	}

	Calc2(y: number, k: number): Complex
	{
		return new Complex((y - this.Center.Im)/k+this.Center.Re, y);
	}

	Paint3dVirt(): void
	{
		var delta = this.EndC.Minus(this.StartC);
		var norm = delta.Norm();
		var mag = delta.Magnitude();
		var ort = this.ConvertDir(this.OrtC);

		this.Context3d.DrawArrow(this.Convert(new Complex(this.StartX, 0), 0), this.Convert(new Complex(this.EndX, 0), 0), 5, 2);
		this.Context3d.DrawArrow(this.Convert(new Complex(0, this.StartY), 0), this.Convert(new Complex(0, this.EndY), 0), 5, 2);	

		this.Context3d.DrawArrow(this.Convert(this.StartC, 0), this.Convert(this.EndC, 0), 5, 2);
		this.Context3d.DrawArrow(this.Convert(this.Center, 0), this.Convert(this.Center, 0).Plus(new Vector3(0, -1, 0)), 5, 2);	
		this.Context3d.DrawArrow(this.Convert(this.Center, 0), this.Convert(this.Center, 0).Plus(ort), 5, 2);	


		for(var i = 0; i < mag; i += this.Step)
		{
			var p = this.StartC.Plus(norm.MultNumber(i));
			var value = this.Func(p);

			var start = this.Convert(p, 0);
			var end = start.Plus(new Vector3(0, -value.Re, 0)).Plus(ort.Mult(value.Im));
			this.Context3d.DrawCircle(end, this.Step/2, "white");
			this.Context3d.DrawLine(start, end);
		}
		
	}
	
	Convert(pos: Complex, h: number)
	{
		return new Vector3((pos.Re - this.CenterX)*this.Scale, -h*this.Scale, -(pos.Im-this.CenterY)*this.Scale);
	}

	ConvertDir(pos: Complex)
	{
		return new Vector3(pos.Re*this.Scale, 0, -pos.Im*this.Scale);
	}
	
}

