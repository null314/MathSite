

// 01_Code/Context2d.ts

class Context2d
{
	Context: CanvasRenderingContext2D;
	Size: Vector2;
	
	constructor(Canvas: HTMLCanvasElement) 
	{
		this.Context = Canvas.getContext("2d");	
		this.Size = new Vector2(Canvas.width, Canvas.height);
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

	ClearRectX(conner: Vector2, size: Vector2): void 
	{
		this.Context.clearRect(conner.X, conner.Y, size.X, size.Y);
	}

	StrokeRectX(conner: Vector2, size: Vector2, color: string, lineWidth: number): void 
	{
		this.Context.strokeStyle = color;
		this.Context.lineWidth = lineWidth;
		this.Context.strokeRect(conner.X, conner.Y, size.X, size.Y);	
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


// 01_Code/Canvas.ts

abstract class Canvas
{
	Canvas: HTMLCanvasElement;
	Context2d: Context2d;
	Size: Vector2;

	constructor(canvasId: string) 
	{
		this.Canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		this.Context2d = new Context2d(this.Canvas);
		this.Size = new Vector2(this.Canvas.width, this.Canvas.height);
		
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



// 01_Code/XObject.ts


abstract class XObject
{
	Pos: Vector2;
	BottomConnerPos: Vector2;
	Size: Vector2;
	CenterShift: Vector2;
	CenterPos: Vector2;
	ContainerCanvas: ContainerCanvas;
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

	abstract InitCanvas(containerCanvas: ContainerCanvas): void;
	abstract PaintVirt(): void;
	abstract OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult;
	abstract OnMouseMoveVirt(event: MouseEvent, pos: Vector2) : void;
	abstract OnUpdate(interval: number): void;
	abstract CheckForRestart(): boolean;
	abstract Init(): void;


	
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
	
	StartTimer(interval: number): void
	{
		var thisValue = this;
		
		var myfunc = setInterval(function() 
		{
			thisValue.OnUpdate(interval);
			thisValue.ContainerCanvas.Repaint();
			if(this.CheckForRestart())
				this.Init();
		}, 
		interval * 1000);	
	}
	
}




// 01_Code/ContainerCanvas.ts

enum DragResult
{
	NoDrag,
	Drag,	
}

class ContainerCanvas extends Canvas
{
	XObjectList: Array<XObject>;
	DragXObject: XObject
	

	constructor(canvasId: string) 
	{
		super(canvasId);
		this.XObjectList = new Array<XObject>();
	}

	AddXObject<T extends XObject>(xobject: T): T
	{
		xobject.ContainerCanvas = this;
		xobject.Context2d = this.Context2d;
		xobject.InitCanvas(this);
		this.XObjectList.push(xobject);
		return xobject;
	}
	
	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : void
	{
		var needRepaint = false;
		for(let m of this.XObjectList)
		{
			if(m.IsInto(pos))
			{
				var dragResult = m.OnMouseDownVirt(event, pos.Minus(m.CenterPos));
				needRepaint = true;
				
				if(dragResult == DragResult.Drag)
					this.DragXObject = m;
			}		
		}
		
		if(needRepaint)
			this.Repaint();
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2) : void
	{
		if(this.DragXObject != null)
		{
			this.DragXObject.OnMouseMoveVirt(event, pos.Minus(this.DragXObject.CenterPos));
			this.Repaint();
		}
	}
	
	OnMouseUpVirt(event: MouseEvent, pos: Vector2) : void
	{
		if(this.DragXObject != null)
			this.DragXObject = null;
	}
	
	Repaint(): void
	{
		this.Context2d.ClearRectX(new Vector2(0, 0), this.Size);
		for(let m of this.XObjectList)
		{
			m.Paint();
		}
	}
}


// 01_Code/Vector2.ts
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

// 01_Code/AxesXObject.ts


class XButton
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



abstract class AxesXObject extends XObject
{
	HeaderHeight: number;
	LeftX: number;
	RightX: number;
	BottomY: number;
	GlobalToInner: number;
	InnerToGobal: number;
	TopY: number;
	HeaderShift: Vector2;
	ButtonList: Array<XButton>;

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
		this.ButtonList = new Array<XButton>();
	}

	abstract FinalPaintVirt(): void	

	InitCanvas(containerCanvas: ContainerCanvas): void
	{
	}

	AddButton(pos: Vector2, size: Vector2, color: string, func: ()=>void): void
	{
		this.ButtonList.push(new XButton(pos, size, color, func));		
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




// 01_Code/Model5XObject.ts
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
	
	OnUpdate(dt: number)
	{
//		вычислить ускорение
//		var ddPosition = this.Force / this.Mass;
		var ddPosition = this.Force.Div(this.Mass);

//		правило производной		
//		this.DPosition = this.DPosition + ddPosition * dt;
		this.DPosition = this.DPosition.Plus(ddPosition.Mult(dt));

//		правило производной		
//		this.Position = this.Position + this.DPosition * dt;
		this.Position = this.Position.Plus(this.DPosition.Mult(dt));
	}
}

class Model5XObject extends AxesXObject
{
	BallList: Array<Ball>;
	RightBorder: number;

	constructor(pos: Vector2, size: Vector2)
	{
		super(20, -10, 210, -10, pos, size)
		this.Init();
		this.RightBorder = 200;
		this.StartTimer(0.01);

		var thisVar = this;
		this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function(){ thisVar.Init();});
		this.AddButton(new Vector2(25, 5), new Vector2(10, 10), "black", function(){ thisVar.Randomize();});		
	}

	Init(): void
	{
		this.BallList = new Array<Ball>();
		this.BallList.push(new Ball(3, 9, "#f1aeb2", new Vector2(80, 110), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 12, "#d07c7F", new Vector2(85, 40), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 15, "#e8b44f", new Vector2(75, 80), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 10, "#8b9c1d", new Vector2(85, 10), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 8, "#687a4e", new Vector2(120, 10), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 10, "#cbc7ae", new Vector2(115, 40), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 11, "#683c32", new Vector2(115, 80), new Vector2(0, 0)));
	}

	Randomize(): void
	{
		for(var ball of this.BallList)
		{
			ball.DPosition = new Vector2((Math.random()- 0.5), Math.random()- 0.5).Mult(100);
		}
	}

	OnUpdate(dt: number)
	{
		var gravityAcceleration = new Vector2(0, -30);
		var wallElasticityForce = 2000;

		for(var ball of this.BallList)
//			обнулить силы
			ball.ClearForce();

		for(var ball of this.BallList)
		{
//			добавить силу гравитации			
			ball.AddForce(gravityAcceleration.Mult(ball.Mass));
				
//			добавить силу отталкивания от пола
			if(ball.Position.Y - ball.Radius < 0)
			{
				ball.AddForce(new Vector2(0, wallElasticityForce));
			}
//			добавить силу отталкивания от левой стены
			if(ball.Position.X - ball.Radius < 0)
			{
				ball.AddForce(new Vector2(wallElasticityForce, 0));
			}
//			добавить силу отталкивания от правой стены
			if(ball.Position.X + ball.Radius > this.RightBorder)
			{
				ball.AddForce(new Vector2(-wallElasticityForce, 0));
			}
		}
		
//		добавить силу отталкивания шариков друг от друга
		for(var i = 0; i < this.BallList.length; i++)
			for(var o = i+1; o < this.BallList.length; o++)
			{
				var collideForce = this.GetCollideForce(this.BallList[i], this.BallList[o]);
				this.BallList[i].AddForce(collideForce.Mult(-1));
				this.BallList[o].AddForce(collideForce);
			}
		
		for(var ball of this.BallList)
		{	
			ball.OnUpdate(dt);
		}
	}
	
	CheckForRestart(): boolean
	{
		return false;
	}

	GetCollideForce(ball1: Ball, ball2: Ball): Vector2
	{
		var ballElasticityForce = 600;
		
		var delta = ball2.Position.Minus(ball1.Position);
		var dist = delta.Length();
		if(dist < ball1.Radius + ball2.Radius)
		{
			return delta.Div(dist).Mult(ballElasticityForce);
		}
		return new Vector2(0, 0);
	}
	
	FinalPaintVirt(): void
	{
		this.DrawAxis();
		for(var ball of this.BallList)
		{
			this.Context2d.CircleX(ball.Position, ball.Radius, ball.Color, 1, ball.Color);
		}
		this.Context2d.ArrowX(new Vector2(this.RightBorder, 0), new Vector2(this.RightBorder, this.TopY), 10, 3, "grey", 1);
	}
}

var container = new ContainerCanvas("canvasModel5");
container.AddXObject(new Model5XObject(new Vector2(0, 0), new Vector2(400, 300)));
container.Repaint();
