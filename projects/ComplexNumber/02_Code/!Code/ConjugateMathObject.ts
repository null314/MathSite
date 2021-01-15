class ConjugateMathObject extends ComplexMathObject
{
	Arg: SingleMathObject;
	Conjugate: Complex;
	
	constructor(arg: SingleMathObject, maxRe: number, pos: Vector2, size: Vector2, context: Context2d)
	{
		super(maxRe, pos, size, context);
		this.Arg = arg;
	}	

	PaintVirt(): void
	{
		this.PaintPlain();
		
		var complex = this.Arg.Complex;
		this.Conjugate = complex.Conjugate();
		
		this.DrawArrow(new Complex(0, 0), this.Conjugate);
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}


