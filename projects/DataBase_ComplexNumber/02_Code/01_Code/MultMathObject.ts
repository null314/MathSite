
class MultMathObject extends ComplexMathObject
{
	Arg1: ComplexMathObject;
	Arg2: ComplexMathObject;
	Mult: Complex;
	Color: string;
	DrawArc: boolean;
	
	constructor(arg1: ComplexMathObject, arg2: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2)
	{
		super(maxRe, pos, size);
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
		this.PaintPlain();
		
		var complex1 = this.Arg1.GetValue();
		var complex2 = this.Arg2.GetValue();
		this.Mult = complex1.Mult(complex2);	

		this.DrawArrowX(new Complex(0, 0), this.Mult, this.Color, 2);

		if(this.DrawArc)
		{
			var argument1 = complex1.Argument();
			var argument2 = complex2.Argument();
			var argument3 = argument1 + argument2;
			
			this.Context2d.ArcX(new Vector2(0, 0), 20, 0, -argument1, this.Arg1.GetColor(), 1, null);				
			this.Context2d.ArcX(new Vector2(0, 0), 22, -argument1, -argument1-argument2, this.Arg2.GetColor(), 1, null);				
		}
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


