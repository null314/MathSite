


class TextMathObject extends MathObject
{
	GetText: () => string;
	
	constructor(getText: () => string, pos: Vector2, size: Vector2)
	{
		super(pos.Minus(size.Div(2)), size, size.Div(2));
		this.GetText = getText;
	}	

	SetParent(mathSceneCanvas: MathSceneCanvas): void
	{
		this.Context2d = mathSceneCanvas.Context2d;
		this.MathSceneCanvas = mathSceneCanvas;	
	}

	PaintVirt(): void
	{
		this.Context2d.FillTextX(this.GetText(), new Vector2(0, 0), null, null, null, null);
	}
	
	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}

	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}
}



