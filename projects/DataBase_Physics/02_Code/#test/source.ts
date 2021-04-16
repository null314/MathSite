

// ../!Code/Complex.ts
class Complex
{
	Re: number;
	Im: number;
	
	constructor(re: number, im: number)
	{
		this.Re = re;
		this.Im = im;	
	}
	

	Plus(c: Complex): Complex
	{
		return new Complex(this.Re + c.Re,  this.Im + c.Im);
	}

	Minus(c: Complex): Complex
	{
		return new Complex(this.Re - c.Re,  this.Im - c.Im);
	}

	Mult(c: Complex): Complex
	{
		return new Complex(this.Re*c.Re - this.Im*c.Im, this.Re*c.Im + this.Im*c.Re);
	}

	MultNumber(c: number): Complex
	{
		return new Complex(this.Re*c, this.Im*c);
	}

	Magnitude(): number
	{
		return Math.sqrt(this.MagnitudeSqr());
	}
	
	MagnitudeSqr(): number
	{
		return this.Re*this.Re + this.Im*this.Im;
	}

	Div(c: Complex): Complex
	{
		var magnitudeSqr = c.MagnitudeSqr();
		return new Complex((this.Re*c.Re + this.Im*c.Im) / magnitudeSqr, (this.Im*c.Re - this.Re*c.Im) / magnitudeSqr);
	}

	Conjugate(): Complex
	{
		return new Complex(this.Re, -this.Im);
	}
	
	Norm(): Complex
	{
		var magnitude = this.Magnitude();
		return new Complex(this.Re / magnitude, this.Im / magnitude);	
	}
	
	Argument(): number
	{
		if(this.Im > 0)
			return Math.acos(this.Re / this.Magnitude());
		else
			return -Math.acos(this.Re / this.Magnitude());
	}
	
}

// ../!Code/XImage.ts





class XImage
{
	Image: HTMLImageElement;
	IsLoaded: boolean;
	OnLoad: () => void
	
	
	constructor(src: string, onLoad: () => void)
	{
		var thisObj = this;
		this.OnLoad = onLoad;
		this.Image = new Image(50, 50);
		this.Image.onload = function() 
		{ 
			thisObj.IsLoaded = true;
			thisObj.OnLoad();
		}; 
		this.Image.src = src;	
	}
}



// ../!Code/Context2d.ts

class Context2d
{
	Context: CanvasRenderingContext2D;
	Size: Vector2;
	
	constructor(Canvas: HTMLCanvasElement) 
	{
		this.Context = Canvas.getContext("2d");	
		this.Size = new Vector2(Canvas.width, Canvas.height);
	}






	DrawImageNatural(image: XImage, pos: Vector2): void
	{
		this.Context.drawImage(image.Image, 0, 0, image.Image.naturalWidth, image.Image.naturalHeight, pos.X, pos.Y, image.Image.naturalWidth, image.Image.naturalHeight);
//		this.Context.drawImage(image.Image, 0, 0, image.Image.naturalWidth, image.Image.naturalWidth, pos.X, pos.Y, image.Image.naturalWidth, image.Image.naturalWidth);
	}

	FillTextX(text: string, pos: Vector2, font: string, color: string, halign: CanvasTextAlign, valign: CanvasTextBaseline): void
	{
		this.Context.font = font == null ? "30px serif" : font;
		this.Context.fillStyle = color == null ? "black" : color;
		this.Context.textAlign = halign == null ? "center" : halign;
		this.Context.textBaseline  = valign == null ? "middle" : valign;
		this.Context.fillText(text, pos.X, pos.Y);
	}

	ArrowX(start: Vector2, end: Vector2, length: number, width: number, color: string, lineWidth: number): void
	{
		var delta = end.Minus(start);
		var tang = delta.Norm();
		var ort = tang.RotateLeft();
		var point1 = end.Plus(tang.Mult(-length)).Plus(ort.Mult(width));
		var point2 = end.Plus(tang.Mult(-length)).Plus(ort.Mult(-width));
		
		this.Context.strokeStyle = color == null ? "black" : color;
		this.Context.lineWidth = lineWidth;
		
		this.Line(start, end);
		this.Line(point1, end);
		this.Line(point2, end);
	}

	FillRectX(conner: Vector2, size: Vector2, color: string): void 
	{
		this.Context.fillStyle = color;
		this.Context.fillRect(conner.X, conner.Y, size.X, size.Y);	
	}

	StrokeRectX(conner: Vector2, size: Vector2, color: string, lineWidth: number): void 
	{
		this.Context.strokeStyle = color;
		this.Context.lineWidth = lineWidth;
		this.Context.strokeRect(conner.X, conner.Y, size.X, size.Y);	
	}

	StartFrame(): void
	{
//		this.Context.setTransform(1, 0, 0, 1, 0, 0);
		this.Context.clearRect(0, 0, this.Context.canvas.width, this.Context.canvas.height);
	}

	EndFrame(): void
	{
//		this.Stroke();
//		this.Context.beginPath();
	}

	Translate(Pos: Vector2): void
	{
		this.Context.translate(Pos.X, Pos.Y);	
	}

	Scale(Pos: Vector2): void
	{
		this.Context.scale(Pos.X, Pos.Y);	
	}
	
	Save(): void
	{
		this.Context.save();
	}

	Restore(): void
	{
		this.Context.restore();
	}
	















	
	CircleX(pos: Vector2, radius: number, lineColor: string | null, lineWidth: number, fillColor: string | null): void
	{
		this.Context.beginPath();
		this.Context.arc(pos.X, pos.Y, radius, 0, 360);
		if(lineColor != null)
		{		
			this.Context.strokeStyle = lineColor;
			this.Context.lineWidth = lineWidth;
			this.Context.stroke();
		}
		
		if(fillColor != null)
		{
			this.Context.fillStyle = fillColor;
			this.Context.fill();
		}
	}

	ArcX(pos: Vector2, radius: number, angle1: number, angle2: number, lineColor: string | null, lineWidth: number, fillColor: string | null): void
	{
		this.Context.beginPath();
		
		if(angle1 < angle2)
			this.Context.arc(pos.X, pos.Y, radius, angle1, angle2);
		else
			this.Context.arc(pos.X, pos.Y, radius, angle2, angle1);
		
		if(lineColor != null)
		{		
			this.Context.strokeStyle = lineColor;
			this.Context.lineWidth = lineWidth;
			this.Context.stroke();
		}
		
		if(fillColor != null)
		{
			this.Context.fillStyle = fillColor;
			this.Context.fill();
		}
	}


	private Line(start: Vector2, end: Vector2): void
	{
		this.Context.beginPath();
		this.MoveTo(start);
		this.LineTo(end);
		this.Context.stroke();
	}

	
	private MoveTo(pos: Vector2): void
	{
		this.Context.moveTo(pos.X, pos.Y);
	}

	private LineTo(pos: Vector2): void
	{
		this.Context.lineTo(pos.X, pos.Y);
	}

	
}


// ../!Code/Canvas.ts

abstract class Canvas
{
	Canvas: HTMLCanvasElement;
	Context2d: Context2d;

	constructor(canvasId: string) 
	{
		this.Canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		this.Context2d = new Context2d(this.Canvas);
		
		let thisClosure = this;
		this.Canvas.addEventListener("mousedown", function (e: MouseEvent): void { thisClosure.OnMouseDown(e); }, false);
		this.Canvas.addEventListener("mousemove", function (e: MouseEvent): void { thisClosure.OnMouseMove(e); }, false);
		this.Canvas.addEventListener("mouseup", function (e: MouseEvent): void { thisClosure.OnMouseUp(e); }, false);
	}

	abstract OnMouseDownVirt(event: MouseEvent, pos: Vector2) : void;
	abstract OnMouseMoveVirt(event: MouseEvent, pos: Vector2) : void;
	abstract OnMouseUpVirt(event: MouseEvent, pos: Vector2) : void;


	GetMousePos(event: MouseEvent): Vector2
	{
		var rect = this.Canvas.getBoundingClientRect();
		var x = event.clientX - rect.left; 
		var y = event.clientY - rect.top;  
		return new Vector2(x, y);
	}

	OnMouseDown(event: MouseEvent) : void
	{
		this.OnMouseDownVirt(event, this.GetMousePos(event));
	}

	OnMouseMove(event: MouseEvent) : void
	{
		this.OnMouseMoveVirt(event, this.GetMousePos(event));
	}

	OnMouseUp(event: MouseEvent) : void
	{
		this.OnMouseUpVirt(event, this.GetMousePos(event));
	}
}



// ../!Code/DragResult.ts
enum DragResult
{
	NoDrag,
	Drag,	
}


// ../!Code/MathObject.ts


abstract class MathObject
{
	Pos: Vector2;
	BottomConnerPos: Vector2;
	Size: Vector2;
	CenterShift: Vector2;
	CenterPos: Vector2;
	MathSceneCanvas: MathSceneCanvas;
	Context2d: Context2d;
	InnerTopLeftConner: Vector2;
	InnerBottomRightConner: Vector2;
	
	constructor(pos: Vector2, size: Vector2, centerShift: Vector2)
	{
		this.Pos = pos;
		this.Size = size;	
		this.BottomConnerPos = pos.Plus(size);
		this.CenterShift = centerShift;
		this.CenterPos = pos.Plus(centerShift);
		this.InnerTopLeftConner = centerShift.Mult(-1);
		this.InnerBottomRightConner = size.Minus(centerShift);
	}

	abstract SetParent(mathSceneCanvas: MathSceneCanvas): void;
	
	IsInto(pos: Vector2): boolean
	{
		var r = 
			pos.X >= this.Pos.X && pos.X <= this.BottomConnerPos.X &&
			pos.Y >= this.Pos.Y && pos.Y <= this.BottomConnerPos.Y;
		return r;
	}
	
	Paint(): void
	{
		this.Context2d.Save();
		this.Context2d.FillRectX(this.Pos, this.Size, "white");
		this.Context2d.Translate(this.CenterPos);
		this.PaintVirt();	
		this.Context2d.Restore();
	}
	
	abstract PaintVirt(): void;
	abstract OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult;
	abstract OnMouseMoveVirt(event: MouseEvent, pos: Vector2) : void;
	
}




// ../!Code/TextMathObject.ts



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





// ../!Code/MathSceneCanvas.ts


class MathSceneCanvas extends Canvas
{
	MathObjectList: Array<MathObject>;
	
	DragMathObject: MathObject
	
	
	constructor(canvasId: string) 
	{
		super(canvasId);
	
		this.MathObjectList = new Array<MathObject>();
	}


	AddMathObject<T extends MathObject>(mathObject: T): T
	{
		mathObject.SetParent(this);
		this.MathObjectList.push(mathObject);
		return mathObject;
	}
	
	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : void
	{
		var needRepaint = false;
		for(let m of this.MathObjectList)
		{
			if(m.IsInto(pos))
			{
				var dragResult = m.OnMouseDownVirt(event, pos.Minus(m.CenterPos));
				needRepaint = true;
				
				if(dragResult == DragResult.Drag)
					this.DragMathObject = m;
			}		
		}
		
		if(needRepaint)
			this.Repaint();
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2) : void
	{
//		console.log("move");		
		if(this.DragMathObject != null)
		{
			this.DragMathObject.OnMouseMoveVirt(event, pos.Minus(this.DragMathObject.CenterPos));
			this.Repaint();
		}
	}
	
	OnMouseUpVirt(event: MouseEvent, pos: Vector2) : void
	{
		if(this.DragMathObject != null)
			this.DragMathObject = null;
	}
	

	Repaint(): void
	{
		this.Context2d.StartFrame();
		for(let m of this.MathObjectList)
		{
			m.Paint();
		}
		
		this.Context2d.EndFrame();
	}

}


// ../!Code/Vector2.ts
class Vector2
{
	X: number;
	Y: number;

	constructor(x: number, y: number)
 	{
		this.X = x;
		this.Y = y;
	}

	Plus(vec: Vector2): Vector2
	{
		return new Vector2(this.X + vec.X, this.Y + vec.Y); 
	}

	Minus(vec: Vector2): Vector2
	{
		return new Vector2(this.X - vec.X, this.Y - vec.Y); 
	}

	Mult(a: number): Vector2
	{
		return new Vector2(this.X * a, this.Y * a); 
	}

	Div(a: number): Vector2
	{
		return new Vector2(this.X / a, this.Y / a); 
	}

	Inverse(): Vector2
	{
		return new Vector2(-this.X, -this.Y);		
	}
	
	Length(): number
	{
		return Math.sqrt(this.X*this.X + this.Y*this.Y);	
	}
	
	Norm(): Vector2
	{
		return this.Div(this.Length());		
	}

	RotateLeft(): Vector2
	{
		return new Vector2(-this.Y, this.X);
	}
}

// ../!Code/HeaderMathObject.ts


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




// ../!Code/Phys1MathObject.ts

class Phys1MathObject extends HeaderMathObject
{
	Position: Vector2;
	DPosition: Vector2;
	
	constructor(pos: Vector2, size: Vector2)
	{
		super(20, -10, 100, -10, pos, size)
		
		this.Reset();
		var thisVar = this;
		
		this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function(){ thisVar.Reset();});
		
		this.StartTimer(0.1);
	}

	Reset(): void
	{
		this.Position = new Vector2(10, 10);
		this.DPosition = new Vector2(20, 20);
	}

	OnUpdate(interval: number)
	{
		this.Position = this.Position.Plus(this.DPosition.Mult(interval));
	}
	
	FinalPaintVirt(): void
	{
		this.DrawAxis();
		if(this.IsInside(this.Position, 10))	
		{
			this.Context2d.CircleX(this.Position, 10, "black", 1, null);
			this.Context2d.ArrowX(this.Position, this.Position.Plus(this.DPosition), 5, 2, "#0000AA", 1);
		}
	}

	
}


// ../!Code/Phys2MathObject.ts
class Phys2MathObject extends HeaderMathObject
{
	Position: Vector2;
	DPosition: Vector2;
	DDPosition: Vector2;
	
	constructor(pos: Vector2, size: Vector2)
	{
		super(20, -10, 100, -10, pos, size)
		
		this.Reset();
		var thisVar = this;
		
		this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function(){ thisVar.Reset();});
		
		this.StartTimer(0.1);
	}

	Reset(): void
	{
		this.Position = new Vector2(10, 10);
		this.DPosition = new Vector2(20, 40);
		this.DDPosition = new Vector2(0, -30);
	}

	OnUpdate(interval: number)
	{
		this.Position = this.Position.Plus(this.DPosition.Mult(interval));
		this.DPosition = this.DPosition.Plus(this.DDPosition.Mult(interval));
	}
	
	FinalPaintVirt(): void
	{
		this.DrawAxis();
		if(this.IsInside(this.Position, 10))	
		{
			this.Context2d.CircleX(this.Position, 10, "black", 1, null);
			this.Context2d.ArrowX(this.Position, this.Position.Plus(this.DPosition), 5, 2, "#0000AA", 1);
		}
	}

	
}


// ../!Code/Phys3MathObject.ts
class Phys3MathObject extends HeaderMathObject
{
	Position: Vector2;
	DPosition: Vector2;
	
	constructor(pos: Vector2, size: Vector2)
	{
		super(20, -10, 290, -10, pos, size)
		
		this.Reset();
		var thisVar = this;
		
		this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function(){ thisVar.Reset();});
		
		this.StartTimer(0.01);
	}

	Reset(): void
	{
		this.Position = new Vector2(10, 10);
		this.DPosition = new Vector2(20, 40);
	}

	OnUpdate(interval: number)
	{
		var force = 300; 
		var mass = 1;

		var ddPosition = new Vector2(0, -30);
		if(this.Position.Y - 10 < 0)
		{
			ddPosition = ddPosition.Plus(new Vector2(0, force / mass));
		}

		this.DPosition = this.DPosition.Plus(ddPosition.Mult(interval));
		this.Position = this.Position.Plus(this.DPosition.Mult(interval));
	}
	
	FinalPaintVirt(): void
	{
		this.DrawAxis();
		if(this.IsInside(this.Position, 10))	
		{
			this.Context2d.CircleX(this.Position, 10, "black", 1, null);
			this.Context2d.ArrowX(this.Position, this.Position.Plus(this.DPosition), 5, 2, "#0000AA", 1);
		}
	}

	
}


// ../!Code/Phys4MathObject.ts



class Ball
{
	Mass: number;
	Radius: number;
	Color: string;
	Position: Vector2;
	DPosition: Vector2;
	Force: Vector2;
	
	constructor(mass: number, radius: number, color: string, position: Vector2, dPosition: Vector2)
	{
		this.Mass = mass;
		this.Radius = radius;
		this.Color = color;
		this.Position = position;
		this.DPosition = dPosition;
	}
	
	ClearForce()
	{
		this.Force = new Vector2(0, 0);	
	}

	AddForce(force: Vector2)
	{
		this.Force = this.Force.Plus(force);
	}
	
	OnUpdate(interval: number)
	{
		this.DPosition = this.DPosition.Plus(this.Force.Mult(interval).Div(this.Mass));
		this.Position = this.Position.Plus(this.DPosition.Mult(interval));
	}
}


class Phys4MathObject extends HeaderMathObject
{
	BallList: Array<Ball>;
	RightBorder: number;

	constructor(pos: Vector2, size: Vector2)
	{
		super(20, -10, 210, -10, pos, size)
		
		this.Reset();
		var thisVar = this;
		
		this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function(){ thisVar.Reset();});
		this.AddButton(new Vector2(25, 5), new Vector2(10, 10), "black", function(){ thisVar.Randomize();});
		
		this.RightBorder = 200;
		this.StartTimer(0.01);
	}

	Reset(): void
	{
		this.BallList = new Array<Ball>();
		this.BallList.push(new Ball(3, 9, "#f1aeb2", new Vector2(50, 110), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 12, "#d07c7F", new Vector2(55, 40), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 15, "#e8b44f", new Vector2(45, 80), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 10, "#8b9c1d", new Vector2(55, 10), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 8, "#687a4e", new Vector2(80, 10), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 10, "#cbc7ae", new Vector2(85, 40), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 11, "#683c32", new Vector2(85, 80), new Vector2(0, 0)));
	}

	Randomize(): void
	{
		for(var ball of this.BallList)
		{
			ball.DPosition = new Vector2((Math.random()- 0.5), Math.random()- 0.5).Mult(100);
		}
	}

	OnUpdate(interval: number)
	{
		var gravity = new Vector2(0, -30);
		var force = 2000;

		for(var ball of this.BallList)
		{
			ball.ClearForce();
			ball.AddForce(gravity.Mult(ball.Mass));
				
			if(ball.Position.Y - ball.Radius < 0)
			{
				ball.AddForce(new Vector2(0, force));
			}
			if(ball.Position.X - ball.Radius < 0)
			{
				ball.AddForce(new Vector2(force, 0));
			}
			if(ball.Position.X + ball.Radius > this.RightBorder)
			{
				ball.AddForce(new Vector2(-force, 0));
			}
		}
		
		
		for(var i = 0; i < this.BallList.length; i++)
			for(var o = i+1; o < this.BallList.length; o++)
			{
				var collideForce = this.GetCollideForce(this.BallList[i], this.BallList[o]);
				this.BallList[i].AddForce(collideForce.Mult(-1));
				this.BallList[o].AddForce(collideForce);
			}
		
		
		for(var ball of this.BallList)
		{	
			ball.OnUpdate(interval);
		}
	}
	
	GetCollideForce(ball1: Ball, ball2: Ball): Vector2
	{
		var force = 600;
		
		var delta = ball2.Position.Minus(ball1.Position);
		var dist = delta.Length();
		if(dist < ball1.Radius + ball2.Radius)
		{
			return delta.Div(dist).Mult(force);
		}
		return new Vector2(0, 0);
	}
	
	FinalPaintVirt(): void
	{
		this.DrawAxis();
		for(var ball of this.BallList)
		{
			this.Context2d.CircleX(ball.Position, ball.Radius, ball.Color, 1, ball.Color);
//			this.Context2d.ArrowX(ball.Position, ball.Position.Plus(ball.DPosition), 5, 2, "#0000AA", 1);
		}
		this.Context2d.ArrowX(new Vector2(this.RightBorder, 0), new Vector2(this.RightBorder, this.TopY), 5, 2, "grey", 1);
	}

	
}
