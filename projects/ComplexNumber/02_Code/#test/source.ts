

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

	BeginPath(): void
	{
		this.Context.beginPath();
	}
	
	Circle(pos: Vector2, radius: number, color: string | null): void
	{
		this.Arc(pos, radius, 0, 360);	
		if(color != null)
			this.Fill(color);
	}

	Arc(pos: Vector2, radius: number, angle1: number, angle2: number): void
	{
		this.BeginPath();
		this.Context.arc(pos.X, pos.Y, radius, angle1, angle2);
		this.Stroke();
	}

	Stroke(): void
	{
		this.Context.stroke();
	}
	
	Fill(color: string): void
	{
		this.Context.fillStyle = color;
		this.Context.fill();
	}

	FillText(text: string, pos: Vector2): void
	{
		this.Context.font = "30px serif";
		this.Context.fillStyle = "#000000";
		this.Context.textAlign = "center";
		this.Context.textBaseline  = "middle";
		this.Context.fillText(text, pos.X, pos.Y);
	}

	StrokeRect(conner: Vector2, size: Vector2): void 
	{
		this.Context.strokeRect(conner.X, conner.Y, size.X, size.Y);	
	}

	Line(start: Vector2, end: Vector2): void
	{
		this.BeginPath();
		this.MoveTo(start);
		this.LineTo(end);
		this.Stroke();
	}

	Arrow(start: Vector2, end: Vector2, length: number, width: number): void
	{
		var delta = end.Minus(start);
		var tang = delta.Norm();
		var ort = tang.RotateLeft();
		var point1 = end.Plus(tang.Mult(-length)).Plus(ort.Mult(width));
		var point2 = end.Plus(tang.Mult(-length)).Plus(ort.Mult(-width));
		
		this.Line(start, end);
		this.Line(point1, end);
		this.Line(point2, end);
	}
	
	MoveTo(pos: Vector2): void
	{
		this.Context.moveTo(pos.X, pos.Y);
	}

	LineTo(pos: Vector2): void
	{
		this.Context.lineTo(pos.X, pos.Y);
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
	
	
	SetColor(color: string): void
	{
		this.Context.strokeStyle  = color;		
	}

	GetColor(): string
	{
		return this.Context.strokeStyle as string;
	}


	DrawImageNatural(image: XImage, pos: Vector2): void
	{
		this.Context.drawImage(image.Image, 0, 0, image.Image.naturalWidth, image.Image.naturalHeight, pos.X, pos.Y, image.Image.naturalWidth, image.Image.naturalHeight);
//		this.Context.drawImage(image.Image, 0, 0, image.Image.naturalWidth, image.Image.naturalWidth, pos.X, pos.Y, image.Image.naturalWidth, image.Image.naturalWidth);
	}
	
	
	SetFont(size:number, font: string): void
	{
		this.Context.font = size.toLocaleString() + "px " + font;		
	}
	
	DrawText(text: string, pos: Vector2): void
	{
		this.Context.textBaseline = "top";
		this.Context.fillText(text, pos.X, pos.Y);		
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
		this.Context2d.StrokeRect(this.Pos, this.Size);	
		this.Context2d.Translate(this.CenterPos);
		this.PaintVirt();	
		this.Context2d.Translate(this.CenterPos.Inverse());
	}
	
	abstract PaintVirt(): void;
	abstract OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult;
	abstract OnMouseMoveVirt(event: MouseEvent, pos: Vector2) : void;
	
}




// ../!Code/ComplexMathObject.ts



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





// ../!Code/SingleMathObject.ts


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
	
	constructor(complex: Complex, color: string, singleMathObjectType: SingleMathObjectType, maxRe: number, pos: Vector2, size: Vector2)
	{
		super(maxRe, pos, size);
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
		var oldColor = this.Context2d.GetColor();

		this.PaintPlain();
		this.Context2d.SetColor(this.Color);
		this.DrawArrow(new Complex(0, 0), this.Complex);	
		this.Context2d.SetColor(oldColor);
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


// ../!Code/SumMathObject.ts


enum SumMathObjectType
{
	Front,
	Back, 
	FrontAndBack	
}


class SumMathObject extends ComplexMathObject
{
	Arg1: SingleMathObject;
	Arg2: SingleMathObject;
	SumMathObjectType: SumMathObjectType;
	Sum: Complex;
	UpShift: boolean;
	Color: string;
	
	constructor(arg1: SingleMathObject, arg2: SingleMathObject, color: string, sumMathObjectType: SumMathObjectType, upShift: boolean, maxRe: number, pos: Vector2, size: Vector2)
	{
		super(maxRe, pos, size);
		this.Arg1 = arg1;
		this.Arg2 = arg2;
		this.SumMathObjectType = sumMathObjectType;
		this.UpShift = upShift;
		this.Color = color;
	}	

	GetValue(): Complex
	{
		return this.Sum;	
	}

	PaintVirt(): void
	{
		var oldColor = this.Context2d.GetColor();

		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Sum = complex1.Plus(complex2);
		
		if(this.SumMathObjectType == SumMathObjectType.Front || this.SumMathObjectType == SumMathObjectType.FrontAndBack)
		{		
			this.Context2d.SetColor(this.Arg1.Color);
			this.DrawArrow(new Complex(0, 0), complex1);	
			this.Context2d.SetColor(this.Arg2.Color);
			this.DrawArrow(complex1, this.Sum);
		}

		if(this.SumMathObjectType == SumMathObjectType.Back || this.SumMathObjectType == SumMathObjectType.FrontAndBack)
		{
			this.Context2d.SetColor(this.Arg2.Color);
			this.DrawArrow(new Complex(0, 0), complex2);	
			this.Context2d.SetColor(this.Arg1.Color);
			this.DrawArrow(complex2, this.Sum);	
		}
		
		this.Context2d.SetColor(this.Color);
		if(this.UpShift)
			this.DrawArrow(new Complex(0, 0.05), this.Sum.Plus(new Complex(0, 0.05)));
		else
			this.DrawArrow(new Complex(0, 0), this.Sum);

		this.Context2d.SetColor(oldColor);
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}




// ../!Code/ConjugateMathObject.ts
class ConjugateMathObject extends ComplexMathObject
{
	Arg: ComplexMathObject;
	Conjugate: Complex;
	Color: string;
	
	constructor(arg: ComplexMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2)
	{
		super(maxRe, pos, size);
		this.Arg = arg;
		this.Color = color;
	}	

	PaintVirt(): void
	{
		var oldColor = this.Context2d.GetColor();
		this.PaintPlain();
		
		var complex = this.Arg.GetValue();
		this.Conjugate = complex.Conjugate();
		
		this.Context2d.SetColor(this.Color);
		this.DrawArrow(new Complex(0, 0), this.Conjugate);
		this.Context2d.SetColor(oldColor);
	}

	GetValue(): Complex
	{
		return this.Conjugate;	
	}


	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}




// ../!Code/MultMathObject.ts

class MultMathObject extends ComplexMathObject
{
	Arg1: SingleMathObject;
	Arg2: SingleMathObject;
	Mult: Complex;
	Color: string;
	
	constructor(arg1: SingleMathObject, arg2: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2)
	{
		super(maxRe, pos, size);
		this.Arg1 = arg1;
		this.Arg2 = arg2;
		this.Color = color;
	}	

	GetValue(): Complex
	{
		return this.Mult;
	}

	PaintVirt(): void
	{
		var oldColor = this.Context2d.GetColor();
		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Mult = complex1.Mult(complex2);	
		this.Context2d.SetColor(this.Color);
		this.DrawArrow(new Complex(0, 0), this.Mult);	
		this.Context2d.SetColor(oldColor);
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}




// ../!Code/DivMathObject.ts

class DivMathObject extends ComplexMathObject
{
	Arg1: SingleMathObject;
	Arg2: SingleMathObject;
	Div: Complex;
	Color: string;
	
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
		var oldColor = this.Context2d.GetColor();
		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Div = complex1.Div(complex2);	

		this.Context2d.SetColor(this.Color);
		this.DrawArrow(new Complex(0, 0), this.Div);

		this.Context2d.SetColor(oldColor);
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
	
/*	AddSingle(complex: Complex, color: string, singleMathObjectType: SingleMathObjectType, maxRe: number, pos: Vector2, size: Vector2): SingleMathObject
	{
		var mo = new SingleMathObject(complex, color, singleMathObjectType, maxRe, pos, size, this);
		this.MathObjectList.push(mo);
		return mo;
	}
	
	AddSum(arg1: SingleMathObject, arg2: SingleMathObject, color: string, sumMathObjectType: SumMathObjectType, upShift: boolean, maxRe: number, pos: Vector2, size: Vector2): SumMathObject
	{
		var s = new SumMathObject(arg1, arg2, color, sumMathObjectType, upShift, maxRe, pos, size, this);
		this.MathObjectList.push(s);
		return s;
	}

	AddConjugate(arg: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2): ConjugateMathObject
	{
		var s = new ConjugateMathObject(arg, color, maxRe, pos, size, this);
		this.MathObjectList.push(s);
		return s;
	}

	AddMult(arg1: SingleMathObject, arg2: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2): MultMathObject
	{
		var s = new MultMathObject(arg1, arg2, color, maxRe, pos, size, this);
		this.MathObjectList.push(s);
		return s;
	}

	AddDiv(arg1: SingleMathObject, arg2: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2): DivMathObject
	{
		var s = new DivMathObject(arg1, arg2, color, maxRe, pos, size, this);
		this.MathObjectList.push(s);
		return s;
	}


	AddPlane(pos: Vector2, size: Vector2, centerShift: Vector2): TdMathObject
	{
		var s = new TdMathObject(pos, size, centerShift, this);
		this.MathObjectList.push(s);
		return s;
	}*/

	
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

// Main.ts


{
	var scene = new MathSceneCanvas("canvas1");

	var a1 = scene.AddMathObject(new SingleMathObject(new Complex(1, 1), "#FF0000", SingleMathObjectType.Real, 2, new Vector2(100, 100), new Vector2(200, 200)));
	var a2 = scene.AddMathObject(new SingleMathObject(new Complex(1, -1), "#0000FF", SingleMathObjectType.One, 2, new Vector2(400, 100), new Vector2(200, 200)));
	var s = scene.AddMathObject(new SumMathObject(a1, a2, "#00FF00", SumMathObjectType.FrontAndBack, true, 2, new Vector2(700, 100), new Vector2(200, 200)));
	scene.AddMathObject(new ConjugateMathObject(a1, "#00FF00", 2, new Vector2(100, 300), new Vector2(200, 200)));
	scene.AddMathObject(new MultMathObject(a1, a2, "#00FF00", 2, new Vector2(400, 300), new Vector2(200, 200)));
	scene.AddMathObject(new DivMathObject(a1, a2, "#00FF00", 2, new Vector2(700, 300), new Vector2(200, 200)));

	scene.Repaint();
	
	a1.SetText("x");
	a2.SetText("y");
	s.SetText("x + y");

	scene.Repaint();
	
}
