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
		this.PaintPlain();
		
		var complex = this.Arg.GetValue();
		this.Conjugate = complex.Conjugate();
		
		this.DrawArrowX(new Complex(0, 0), this.Conjugate, this.Color, 2);
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

	GetColor(): string
	{
		return this.Color;
	}

}


