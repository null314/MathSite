class ConjugateMathObject extends ComplexMathObject
{
	Arg: ComplexMathObject;
	Conjugate: Complex;
	Color: string;
	
	constructor(arg: ComplexMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2)
	{
		super(maxRe, pos, size);
		this.Arg = arg;
		this.Color = color;
	}	

	PaintVirt(): void
	{
		var oldColor = this.Context2d.GetColor();
		this.PaintPlain();
		
		var complex = this.Arg.GetValue();
		this.Conjugate = complex.Conjugate();
		
		this.Context2d.SetColor(this.Color);
		this.DrawArrow(new Complex(0, 0), this.Conjugate);
		this.Context2d.SetColor(oldColor);
	}

	GetValue(): Complex
	{
		return this.Conjugate;	
	}


	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}


