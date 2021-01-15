class SumMathObject extends ComplexMathObject
{
	Arg1: SingleMathObject;
	Arg2: SingleMathObject;
	Sum: Complex;
	
	constructor(arg1: SingleMathObject, arg2: SingleMathObject, maxRe: number, pos: Vector2, size: Vector2, context: Context2d)
	{
		super(maxRe, pos, size, context);
		this.Arg1 = arg1;
		this.Arg2 = arg2;
	}	

	PaintVirt(): void
	{
		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Sum = complex1.Plus(complex2);
		
		this.DrawArrow(new Complex(0, 0), complex1);	
		this.DrawArrow(new Complex(0, 0), complex2);	
		this.DrawArrow(complex1, this.Sum);
		this.DrawArrow(complex2, this.Sum);	
		this.DrawArrow(new Complex(0, 0), this.Sum);
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}


