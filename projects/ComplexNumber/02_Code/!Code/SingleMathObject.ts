class SingleMathObject extends ComplexMathObject
{
	Complex: Complex;
	
	constructor(complex: Complex, maxRe: number, pos: Vector2, size: Vector2, context: Context2d)
	{
		super(maxRe, pos, size, context);
		this.Complex = complex;
	}	

	PaintVirt(): void
	{
		this.PaintPlain();
		this.DrawArrow(new Complex(0, 0), this.Complex);	
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		this.Complex.Re = pos.X / this.ReToX;
		this.Complex.Im = pos.Y / this.ImToY;	
		return DragResult.Drag;
	}

	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
		this.Complex.Re = pos.X / this.ReToX;
		this.Complex.Im = pos.Y / this.ImToY;	
	}
}
