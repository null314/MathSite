
class MultMathObject extends ComplexMathObject
{
	Arg1: SingleMathObject;
	Arg2: SingleMathObject;
	Mult: Complex;
	Color: string;
	
	constructor(arg1: SingleMathObject, arg2: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2, context: MathSceneCanvas)
	{
		super(maxRe, pos, size, context);
		this.Arg1 = arg1;
		this.Arg2 = arg2;
		this.Color = color;
	}	

	GetValue(): Complex
	{
		return this.Mult;
	}

	PaintVirt(): void
	{
		var oldColor = this.Context.GetColor();
		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Mult = complex1.Mult(complex2);	
		this.Context.SetColor(this.Color);
		this.DrawArrow(new Complex(0, 0), this.Mult);	
		this.Context.SetColor(oldColor);
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}


