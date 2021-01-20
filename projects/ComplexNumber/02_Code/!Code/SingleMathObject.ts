

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
	
	constructor(complex: Complex, color: string, singleMathObjectType: SingleMathObjectType, maxRe: number, pos: Vector2, size: Vector2, context: MathSceneCanvas)
	{
		super(maxRe, pos, size, context);
		this.Complex = complex;
		this.Color = color;
		this.SingleMathObjectType = singleMathObjectType;
	}	

	GetValue(): Complex
	{
		return this.Complex;	
	}

	PaintVirt(): void
	{
		var oldColor = this.Context.GetColor();

		this.PaintPlain();
		this.Context.SetColor(this.Color);
		this.DrawArrow(new Complex(0, 0), this.Complex);	
		this.Context.SetColor(oldColor);
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
