

enum SumMathObjectType
{
	Front,
	Back, 
	FrontAndBack	
}


class SumMathObject extends ComplexMathObject
{
	Arg1: ComplexMathObject;
	Arg2: ComplexMathObject;
	SumMathObjectType: SumMathObjectType;
	Sum: Complex;
	UpShift: boolean;
	Color: string;
	
	constructor(arg1: ComplexMathObject, arg2: ComplexMathObject, color: string, sumMathObjectType: SumMathObjectType, upShift: boolean, maxRe: number, pos: Vector2, size: Vector2)
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
		this.PaintPlain();
		
		var complex1 = this.Arg1.GetValue();
		var complex2 = this.Arg2.GetValue();
		this.Sum = complex1.Plus(complex2);
		
		if(this.SumMathObjectType == SumMathObjectType.Front || this.SumMathObjectType == SumMathObjectType.FrontAndBack)
		{		
			this.DrawArrowX(new Complex(0, 0), complex1, this.Arg1.GetColor(), 2);
			this.DrawArrowX(complex1, this.Sum, this.Arg2.GetColor(), 2);
		}

		if(this.SumMathObjectType == SumMathObjectType.Back || this.SumMathObjectType == SumMathObjectType.FrontAndBack)
		{
			this.DrawArrowX(new Complex(0, 0), complex2, this.Arg2.GetColor(), 2);	
			this.DrawArrowX(complex2, this.Sum, this.Arg1.GetColor(), 2);	
		}
		
		if(this.UpShift)
			this.DrawArrowX(new Complex(0, 0.05), this.Sum.Plus(new Complex(0, 0.05)), this.Color, 2);
		else
			this.DrawArrowX(new Complex(0, 0), this.Sum, this.Color, 2);
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

	GetColor(): string
	{
		return this.Color;
	}

}


