

enum SingleMathObjectType
{
	Simple,
	Real,
	One,	
}


class SingleMathObject extends ComplexMathObject
{
	Complex: Complex;
	Color: string;
	SingleMathObjectType: SingleMathObjectType;
	DrawArc: boolean;
	
	constructor(complex: Complex, color: string, singleMathObjectType: SingleMathObjectType, maxRe: number, pos: Vector2, size: Vector2)
	{
		super(maxRe, pos, size);
		this.Complex = complex;
		this.Color = color;
		this.SingleMathObjectType = singleMathObjectType;
		this.DrawArc = false;
	}	

	GetValue(): Complex
	{
		return this.Complex;	
	}

	PaintVirt(): void
	{
		this.PaintPlain();
		this.DrawArrowX(new Complex(0, 0), this.Complex, this.Color, 2);	
		
		if(this.DrawArc)
		{
			var argument = this.Complex.Argument();
			this.Context2d.ArcX(new Vector2(0, 0), 20, 0, -argument, this.Color, 1, null);				
		}
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		this.SetValue(pos);
		return DragResult.Drag;
	}

	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
		this.SetValue(pos);
	}
	
	GetColor(): string
	{
		return this.Color;
	}

	
	SetValue(pos: Vector2): void
	{
		this.Complex.Re = pos.X / this.ReToX;
		this.Complex.Im = pos.Y / this.ImToY;	
		
		if(this.SingleMathObjectType == SingleMathObjectType.Real)
			this.Complex.Im = 0;
		
		if(this.SingleMathObjectType == SingleMathObjectType.One)
		{
			this.Complex = this.Complex.Norm();
		}
	}
}
