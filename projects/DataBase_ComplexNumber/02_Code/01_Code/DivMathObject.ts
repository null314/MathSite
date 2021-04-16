
class DivMathObject extends ComplexMathObject
{
	Arg1: SingleMathObject;
	Arg2: SingleMathObject;
	Div: Complex;
	Color: string;
	DrawArc: boolean;

	
	constructor(arg1: SingleMathObject, arg2: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2)
	{
		super(maxRe, pos, size);
		this.Arg1 = arg1;
		this.Arg2 = arg2;
		this.Color = color;
	}	

	GetValue(): Complex
	{
		return this.Div;	
	}

	PaintVirt(): void
	{
		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Div = complex1.Div(complex2);	

		this.DrawArrowX(new Complex(0, 0), this.Div, this.Color, 2);

		if(this.DrawArc)
		{
			var argument1 = complex1.Argument();
			var argument2 = -complex2.Argument();
			var argument3 = argument1 + argument2;
			
			this.Context2d.ArcX(new Vector2(0, 0), 20, 0, -argument1, this.Arg1.Color, 1, null);				
			this.Context2d.ArcX(new Vector2(0, 0), 22, -argument1, -argument1-argument2, this.Arg2.Color, 1, null);				
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


