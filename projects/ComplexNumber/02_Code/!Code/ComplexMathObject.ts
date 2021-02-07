


abstract class ComplexMathObject extends MathObject
{
	MaxRe: number;
	ReToX: number;
	ImToY: number;
	Image: XImage;
	Text: string;
	
	constructor(maxRe: number, pos: Vector2, size: Vector2)
	{
		super(pos, size, size.Div(2));
		this.MaxRe= maxRe;
		this.ReToX = size.X / (2 * this.MaxRe);
		this.ImToY = -this.ReToX;
	}	

	abstract GetValue(): Complex;

	SetParent(mathSceneCanvas: MathSceneCanvas): void
	{
		this.Context2d = mathSceneCanvas.Context2d;
		this.MathSceneCanvas = mathSceneCanvas;	
	}

	DrawArrow(start: Complex, end: Complex): void
	{
		this.Context2d.Arrow(
			new Vector2(start.Re * this.ReToX, start.Im * this.ImToY),	
			new Vector2(end.Re * this.ReToX, end.Im * this.ImToY), 10, 2);	
	}
	
	PaintPlain(): void
	{
		this.Context2d.SetColor("#AAAAAA");
		
		if(this.Image != null && this.Image.IsLoaded)
			this.Context2d.DrawImageNatural(this.Image, this.InnerTopLeftConner.Plus(new Vector2(10, 10)));

		if(this.Text != null)
		{
			this.Context2d.SetFont(20, "serif");
			this.Context2d.DrawText(this.Text, this.InnerTopLeftConner.Plus(new Vector2(10, 10)));
		}

		this.Context2d.Arrow(new Vector2(this.InnerTopLeftConner.X, 0), new Vector2(this.InnerBottomRightConner.X, 0), 10, 5);
		this.Context2d.Arrow(new Vector2(0, this.InnerBottomRightConner.Y), new Vector2(0, this.InnerTopLeftConner.Y), 10, 5);	
		this.Context2d.Circle(new Vector2(0, 0), this.ReToX, null);		
	}

	SetText(text: string)
	{
		this.Text = text;
		this.MathSceneCanvas.Repaint();			
	}
	
	SetImage(src: string)
	{
		var thisObj = this;

		this.Image = new XImage(src, function() 
		{
			thisObj.MathSceneCanvas.Repaint();			
		});
	}
}



