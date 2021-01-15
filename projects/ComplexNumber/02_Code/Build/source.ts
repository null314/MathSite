

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

	Mult(c: Complex): Complex
	{
		return new Complex(this.Re*c.Re - this.Im*c.Im, this.Re*c.Im + this.Im*c.Re);
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
}

// !Code/Context2d.ts

class Context2d
{
	Context: CanvasRenderingContext2D;
	Size: Vector2;
	Center: Vector2;
	
	constructor(Canvas: HTMLCanvasElement) 
	{
		this.Context = Canvas.getContext("2d");	
		this.Size = new Vector2(Canvas.width, Canvas.height);
 		this.Center = this.Size.Div(2);
	}

	BeginPath(): void
	{
		this.Context.beginPath();
	}
	
	Circle(pos: Vector2, radius: number): void
	{
		this.Arc(pos, radius, 0, 360);	
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
}


// !Code/Canvas.ts

abstract class Canvas
{
	Canvas: HTMLCanvasElement;
	Context: Context2d;

	constructor(canvasId: string) 
	{
		this.Canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		this.Context = new Context2d(this.Canvas);
		
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
	Context: Context2d;
	InnerTopLeftConner: Vector2;
	InnerBottomRightConner: Vector2;
	
	constructor(pos: Vector2, size: Vector2, centerShift: Vector2, context: Context2d)
	{
		this.Context = context;
		this.Pos = pos;
		this.Size = size;	
		this.BottomConnerPos = pos.Plus(size);
		this.CenterShift = centerShift;
		this.CenterPos = pos.Plus(centerShift);
		this.InnerTopLeftConner = centerShift.Mult(-1);
		this.InnerBottomRightConner = size.Minus(centerShift);
	}
	
	IsInto(pos: Vector2): boolean
	{
		var r = 
			pos.X >= this.Pos.X && pos.X <= this.BottomConnerPos.X &&
			pos.Y >= this.Pos.Y && pos.Y <= this.Pos.Y + this.Size.Y;
		return r;
	}
	
	Paint(): void
	{
		this.Context.StrokeRect(this.Pos, this.Size);	
		this.Context.Translate(this.CenterPos);
		this.PaintVirt();	
		this.Context.Translate(this.CenterPos.Inverse());
	}
	
	abstract PaintVirt(): void;
	abstract OnMouseDownVirt(event: MouseEvent, pos: Vector2) : DragResult;
	abstract OnMouseMoveVirt(event: MouseEvent, pos: Vector2) : void;
	
}


// !Code/ComplexMathObject.ts



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





// !Code/SingleMathObject.ts
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


// !Code/SumMathObject.ts
class SumMathObject extends ComplexMathObject
{
	Arg1: SingleMathObject;
	Arg2: SingleMathObject;
	Sum: Complex;
	
	constructor(arg1: SingleMathObject, arg2: SingleMathObject, maxRe: number, pos: Vector2, size: Vector2, context: Context2d)
	{
		super(maxRe, pos, size, context);
		this.Arg1 = arg1;
		this.Arg2 = arg2;
	}	

	PaintVirt(): void
	{
		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Sum = complex1.Plus(complex2);
		
		this.DrawArrow(new Complex(0, 0), complex1);	
		this.DrawArrow(new Complex(0, 0), complex2);	
		this.DrawArrow(complex1, this.Sum);
		this.DrawArrow(complex2, this.Sum);	
		this.DrawArrow(new Complex(0, 0), this.Sum);
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
	Arg: SingleMathObject;
	Conjugate: Complex;
	
	constructor(arg: SingleMathObject, maxRe: number, pos: Vector2, size: Vector2, context: Context2d)
	{
		super(maxRe, pos, size, context);
		this.Arg = arg;
	}	

	PaintVirt(): void
	{
		this.PaintPlain();
		
		var complex = this.Arg.Complex;
		this.Conjugate = complex.Conjugate();
		
		this.DrawArrow(new Complex(0, 0), this.Conjugate);
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
	Arg1: SingleMathObject;
	Arg2: SingleMathObject;
	Mult: Complex;
	
	constructor(arg1: SingleMathObject, arg2: SingleMathObject, maxRe: number, pos: Vector2, size: Vector2, context: Context2d)
	{
		super(maxRe, pos, size, context);
		this.Arg1 = arg1;
		this.Arg2 = arg2;
	}	

	PaintVirt(): void
	{
		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Mult = complex1.Mult(complex2);	
		this.DrawArrow(new Complex(0, 0), this.Mult);	
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
	
	constructor(arg1: SingleMathObject, arg2: SingleMathObject, maxRe: number, pos: Vector2, size: Vector2, context: Context2d)
	{
		super(maxRe, pos, size, context);
		this.Arg1 = arg1;
		this.Arg2 = arg2;
	}	

	PaintVirt(): void
	{
		this.PaintPlain();
		
		var complex1 = this.Arg1.Complex;
		var complex2 = this.Arg2.Complex;
		this.Div = complex1.Div(complex2);	
		this.DrawArrow(new Complex(0, 0), this.Div);
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


	AddSingle(complex: Complex, maxRe: number, pos: Vector2, size: Vector2): SingleMathObject
	{
		var mo = new SingleMathObject(complex, maxRe, pos, size, this.Context);
		this.MathObjectList.push(mo);
		return mo;
	}
	
	AddSum(arg1: SingleMathObject, arg2: SingleMathObject, maxRe: number, pos: Vector2, size: Vector2): void
	{
		this.MathObjectList.push(new SumMathObject(arg1, arg2, maxRe, pos, size, this.Context));
	}

	AddConjugate(arg: SingleMathObject, maxRe: number, pos: Vector2, size: Vector2): void
	{
		this.MathObjectList.push(new ConjugateMathObject(arg, maxRe, pos, size, this.Context));
	}

	AddMult(arg1: SingleMathObject, arg2: SingleMathObject, maxRe: number, pos: Vector2, size: Vector2): void
	{
		this.MathObjectList.push(new MultMathObject(arg1, arg2, maxRe, pos, size, this.Context));
	}

	AddDiv(arg1: SingleMathObject, arg2: SingleMathObject, maxRe: number, pos: Vector2, size: Vector2): void
	{
		this.MathObjectList.push(new DivMathObject(arg1, arg2, maxRe, pos, size, this.Context));
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
		this.Context.StartFrame();
		for(let m of this.MathObjectList)
		{
			m.Paint();
		}
		
		this.Context.EndFrame();
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