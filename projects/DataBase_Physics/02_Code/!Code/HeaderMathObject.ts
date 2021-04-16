

class TdButton
{
	Pos: Vector2;
	Pos2: Vector2;
	Size: Vector2;
	Color: string;
	Func: ()=>void;
	
	constructor(pos: Vector2, size: Vector2, color: string, func: ()=>void)
	{
		this.Pos = pos;
		this.Size = size;
		this.Pos2 = pos.Plus(size);
		this.Color = color;
		this.Func = func;		
	}
}



abstract class HeaderMathObject extends MathObject
{
	HeaderHeight: number;
	LeftX: number;
	RightX: number;
	BottomY: number;
	GlobalToInner: number;
	InnerToGobal: number;
	TopY: number;
	HeaderShift: Vector2;
	ButtonList: Array<TdButton>;

	constructor(headerHeight: number, leftX: number, rightX: number, bottomY: number, pos: Vector2, size: Vector2)
	{
		super(pos, size, new Vector2(0, 0));
		
		this.HeaderHeight = headerHeight;
		this.LeftX = leftX;
		this.RightX = rightX
		this.BottomY = bottomY;
		
		this.HeaderShift = new Vector2(0, this.HeaderHeight);
		this.GlobalToInner = (this.RightX - this.LeftX)/this.Size.X;
		this.InnerToGobal = 1 / this.GlobalToInner;
		this.TopY = this.BottomY + this.Size.Minus(this.HeaderShift).Y*this.GlobalToInner;
		this.ButtonList = new Array<TdButton>();
	}

	abstract FinalPaintVirt(): void	
	abstract OnUpdate(interval: number): void;

	SetParent(mathSceneCanvas: MathSceneCanvas): void
	{
		this.Context2d = mathSceneCanvas.Context2d;
		this.MathSceneCanvas = mathSceneCanvas;	
	}

	AddButton(pos: Vector2, size: Vector2, color: string, func: ()=>void): void
	{
		this.ButtonList.push(new TdButton(pos, size, color, func));		
	}
	
	PaintVirt(): void
	{
		this.Context2d.StrokeRectX(new Vector2(0, 0), this.Size, "black", 1);
		this.Context2d.StrokeRectX(new Vector2(0, this.HeaderHeight), this.Size.Minus(this.HeaderShift), "black", 1);
		for(var b of this.ButtonList)
		{
			this.Context2d.StrokeRectX(b.Pos, b.Size, b.Color, 1);
		}		
		this.Context2d.Translate(this.HeaderShift.Plus(new Vector2(-this.LeftX*this.InnerToGobal, this.TopY*this.InnerToGobal)));
		this.Context2d.Scale(new Vector2(this.InnerToGobal, -this.InnerToGobal));
		this.FinalPaintVirt();
		this.Context2d.Restore();
	}
	
	StartTimer(interval: number): void
	{
		var thisValue = this;
		
		var myfunc = setInterval(function() 
		{
			thisValue.OnUpdate(interval);
			thisValue.MathSceneCanvas.Repaint();
		}, 
		interval * 1000);	
	}
	
	DrawAxis(): void
	{
		this.Context2d.ArrowX(new Vector2(this.LeftX, 0), new Vector2(this.RightX, 0), 10, 3, "gray", 1);
		this.Context2d.ArrowX(new Vector2(0, this.BottomY), new Vector2(0, this.TopY), 10, 3, "gray", 1);
	}
	
	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		var p = pos.Plus(this.CenterShift);
		for(var b of this.ButtonList)
		{	
			if(p.X >= b.Pos.X && p.X <= b.Pos2.X && 
				p.Y >= b.Pos.Y && p.Y <= b.Pos2.Y)
			{
				b.Func();
				return DragResult.NoDrag;
			}
		}

		return DragResult.NoDrag;
	}

	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}
	
	IsInside(pos: Vector2, radius: number): boolean
	{
		var result = pos.X + radius < this.RightX &&  
			pos.X - radius > this.LeftX &&
			pos.Y + radius < this.TopY &&
			pos.Y - radius > this.BottomY;

		return result;
	}
}


