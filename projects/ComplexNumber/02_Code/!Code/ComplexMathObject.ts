


abstract class ComplexMathObject extends MathObject
{
	MaxRe: number;
	ReToX: number;
	ImToY: number;
	
	constructor(maxRe: number, pos: Vector2, size: Vector2, context: Context2d)
	{
		super(pos, size, size.Div(2), context);
		this.MaxRe= maxRe;
		this.ReToX = size.X / (2 * this.MaxRe);
		this.ImToY = -this.ReToX;
	}	

	DrawArrow(start: Complex, end: Complex): void
	{
		this.Context.Arrow(
			new Vector2(start.Re * this.ReToX, start.Im * this.ImToY),	
			new Vector2(end.Re * this.ReToX, end.Im * this.ImToY), 10, 2);	
	}
	
	PaintPlain(): void
	{
		this.Context.Arrow(new Vector2(this.InnerTopLeftConner.X, 0), new Vector2(this.InnerBottomRightConner.X, 0), 10, 5);
		this.Context.Arrow(new Vector2(0, this.InnerBottomRightConner.Y), new Vector2(0, this.InnerTopLeftConner.Y), 10, 5);	
		this.Context.Circle(new Vector2(0, 0), this.ReToX);		
	}

}



