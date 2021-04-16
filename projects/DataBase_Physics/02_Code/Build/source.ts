

// !Code/Complex.ts
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

// !Code/XImage.ts





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



// !Code/Context2d.ts

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


// !Code/Canvas.ts

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



// !Code/DragResult.ts
enum DragResult
{
	NoDrag,
	Drag,	
}


// !Code/MathObject.ts


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




// !Code/TextMathObject.ts



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





// !Code/ComplexMathObject.ts



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

	DrawArrowX(start: Complex, end: Complex, color: string, lineWidth: number): void
	{
		this.Context2d.ArrowX(
			new Vector2(start.Re * this.ReToX, start.Im * this.ImToY),	
			new Vector2(end.Re * this.ReToX, end.Im * this.ImToY), 10, 2, color, lineWidth);	
	}
	
	PaintPlain(): void
	{
		if(this.Image != null && this.Image.IsLoaded)
			this.Context2d.DrawImageNatural(this.Image, this.InnerTopLeftConner.Plus(new Vector2(10, 10)));

		if(this.Text != null)
		{
			this.Context2d.FillTextX(this.Text, this.InnerTopLeftConner.Plus(new Vector2(10, 10)), "20px serif", null, "left", "top");
		}

		this.Context2d.ArrowX(new Vector2(this.InnerTopLeftConner.X, 0), new Vector2(this.InnerBottomRightConner.X, 0), 10, 5, "grey", 1);
		this.Context2d.ArrowX(new Vector2(0, this.InnerBottomRightConner.Y), new Vector2(0, this.InnerTopLeftConner.Y), 10, 5, "grey", 1);	
		this.Context2d.CircleX(new Vector2(0, 0), this.ReToX, "grey", 1, null);
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





// !Code/SingleMathObject.ts


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


// !Code/SumMathObject.ts


enum SumMathObjectType
{
	Front,
	Back, 
	FrontAndBack	
}


class SumMathObject extends ComplexMathObject
{
	Arg1: ComplexMathObject;
	Arg2: ComplexMathObject;
	SumMathObjectType: SumMathObjectType;
	Sum: Complex;
	UpShift: boolean;
	Color: string;
	
	constructor(arg1: ComplexMathObject, arg2: ComplexMathObject, color: string, sumMathObjectType: SumMathObjectType, upShift: boolean, maxRe: number, pos: Vector2, size: Vector2)
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
		this.PaintPlain();
		
		var complex1 = this.Arg1.GetValue();
		var complex2 = this.Arg2.GetValue();
		this.Sum = complex1.Plus(complex2);
		
		if(this.SumMathObjectType == SumMathObjectType.Front || this.SumMathObjectType == SumMathObjectType.FrontAndBack)
		{		
			this.DrawArrowX(new Complex(0, 0), complex1, this.Arg1.Color, 2);
			this.DrawArrowX(complex1, this.Sum, this.Arg2.Color, 2);
		}

		if(this.SumMathObjectType == SumMathObjectType.Back || this.SumMathObjectType == SumMathObjectType.FrontAndBack)
		{
			this.DrawArrowX(new Complex(0, 0), complex2, this.Arg2.Color, 2);	
			this.DrawArrowX(complex2, this.Sum, this.Arg1.Color, 2);	
		}
		
		if(this.UpShift)
			this.DrawArrowX(new Complex(0, 0.05), this.Sum.Plus(new Complex(0, 0.05)), this.Color, 2);
		else
			this.DrawArrowX(new Complex(0, 0), this.Sum, this.Color, 2);
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}




// !Code/ConjugateMathObject.ts
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
		this.PaintPlain();
		
		var complex = this.Arg.GetValue();
		this.Conjugate = complex.Conjugate();
		
		this.DrawArrowX(new Complex(0, 0), this.Conjugate, this.Color, 2);
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




// !Code/MultMathObject.ts

class MultMathObject extends ComplexMathObject
{
	Arg1: ComplexMathObject;
	Arg2: ComplexMathObject;
	Mult: Complex;
	Color: string;
	DrawArc: boolean;
	
	constructor(arg1: ComplexMathObject, arg2: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2)
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
		this.PaintPlain();
		
		var complex1 = this.Arg1.GetValue();
		var complex2 = this.Arg2.GetValue();
		this.Mult = complex1.Mult(complex2);	

		this.DrawArrowX(new Complex(0, 0), this.Mult, this.Color, 2);

		if(this.DrawArc)
		{
			var argument1 = complex1.Argument();
			var argument2 = complex2.Argument();
			var argument3 = argument1 + argument2;
			
			this.Context2d.ArcX(new Vector2(0, 0), 20, 0, -argument1, this.Arg1.Color, 1, null);				
			this.Context2d.ArcX(new Vector2(0, 0), 22, -argument1, -argument1-argument2, this.Arg2.Color, 1, null);				
		}
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}




// !Code/DivMathObject.ts

class DivMathObject extends ComplexMathObject
{
	Arg1: SingleMathObject;
	Arg2: SingleMathObject;
	Div: Complex;
	Color: string;
	DrawArc: boolean;

	
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
		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Div = complex1.Div(complex2);	

		this.DrawArrowX(new Complex(0, 0), this.Div, this.Color, 2);

		if(this.DrawArc)
		{
			var argument1 = complex1.Argument();
			var argument2 = -complex2.Argument();
			var argument3 = argument1 + argument2;
			
			this.Context2d.ArcX(new Vector2(0, 0), 20, 0, -argument1, this.Arg1.Color, 1, null);				
			this.Context2d.ArcX(new Vector2(0, 0), 22, -argument1, -argument1-argument2, this.Arg2.Color, 1, null);				
		}
	}

	OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult
	{
		return DragResult.NoDrag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2): void
	{
	}

}




// !Code/MathSceneCanvas.ts


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


// !Code/Vector2.ts
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