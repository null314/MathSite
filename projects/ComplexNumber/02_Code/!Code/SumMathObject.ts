

enum SumMathObjectType
{
	Front,
	Back, 
	FrontAndBack	
}


class SumMathObject extends ComplexMathObject
{
	Arg1: SingleMathObject;
	Arg2: SingleMathObject;
	SumMathObjectType: SumMathObjectType;
	Sum: Complex;
	UpShift: boolean;
	Color: string;
	
	constructor(arg1: SingleMathObject, arg2: SingleMathObject, color: string, sumMathObjectType: SumMathObjectType, upShift: boolean, maxRe: number, pos: Vector2, size: Vector2)
	{
		super(maxRe, pos, size);
		this.Arg1 = arg1;
		this.Arg2 = arg2;
		this.SumMathObjectType = sumMathObjectType;
		this.UpShift = upShift;
		this.Color = color;
	}	

	GetValue(): Complex
	{
		return this.Sum;	
	}

	PaintVirt(): void
	{
		var oldColor = this.Context2d.GetColor();

		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Sum = complex1.Plus(complex2);
		
		if(this.SumMathObjectType == SumMathObjectType.Front || this.SumMathObjectType == SumMathObjectType.FrontAndBack)
		{		
			this.Context2d.SetColor(this.Arg1.Color);
			this.DrawArrow(new Complex(0, 0), complex1);	
			this.Context2d.SetColor(this.Arg2.Color);
			this.DrawArrow(complex1, this.Sum);
		}

		if(this.SumMathObjectType == SumMathObjectType.Back || this.SumMathObjectType == SumMathObjectType.FrontAndBack)
		{
			this.Context2d.SetColor(this.Arg2.Color);
			this.DrawArrow(new Complex(0, 0), complex2);	
			this.Context2d.SetColor(this.Arg1.Color);
			this.DrawArrow(complex2, this.Sum);	
		}
		
		this.Context2d.SetColor(this.Color);
		if(this.UpShift)
			this.DrawArrow(new Complex(0, 0.05), this.Sum.Plus(new Complex(0, 0.05)));
		else
			this.DrawArrow(new Complex(0, 0), this.Sum);

		this.Context2d.SetColor(oldColor);
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}


