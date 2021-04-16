

// ../01_Code/Complex.ts
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

// ../01_Code/XImage.ts





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



// ../01_Code/Context2d.ts

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


// ../01_Code/Context3d.ts
class Context3d
{
	Matrix: Matrix3;
	Context2d: Context2d;
	Scale: number;
	Distance: number;

	DrawList: Array<Td>

	constructor(context2d: Context2d)
	{
		this.Context2d = context2d;
		this.Scale = 300;
		this.Distance = 8;
		this.Matrix = new Matrix3();
		
		this.DrawList = new Array<Td>(); 
		
	}

	GetViewVector3() : Vector3
	{
		return this.Matrix.Transp().MultVector3(new Vector3(0, 0, 1));		
	}

	DrawCircle(pos: Vector3, radius: number, color: string | null): void
	{	
		var posGlobal = this.Matrix.MultVector3(pos);
		var radiusProj = posGlobal.Proj(radius, this.Distance) * this.Scale; 
		var z = posGlobal.Z;
		if(radiusProj <= 0)
			return;
		
		var posProj = posGlobal.ToVector2Proj(this.Distance).Mult(this.Scale); 

		this.DrawList.push(new CircleTd(posProj, radiusProj, color, z));	
	}

	DrawLine(pos1: Vector3, pos2: Vector3): void
	{
		var posGlobal1 = this.Matrix.MultVector3(pos1);
		var posGlobal2 = this.Matrix.MultVector3(pos2);
		var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var z = (posGlobal1.Z + posGlobal2.Z)/2;

		this.DrawList.push(new LineTd(posProj1, posProj2, z));
	}

	DrawArrow(pos1: Vector3, pos2: Vector3, length: number, width: number): void
	{
		var posGlobal1 = this.Matrix.MultVector3(pos1);
		var posGlobal2 = this.Matrix.MultVector3(pos2);
		var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var z = (posGlobal1.Z + posGlobal2.Z)/2;

		this.DrawList.push(new ArrowTd(posProj1, posProj2, length, width, z));
	}

	DrawText(t: string, pos: Vector3) : void
	{
/*		var posGlobal1 = this.Matrix.MultVector3(pos);
		var posProj = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var sceneCanvas = this.SceneCanvas;

		this.DrawList.push([posGlobal1.Z, () => 
		{
			sceneCanvas.FillText(t, sceneCanvas.Center.Plus(posProj));
		}]);
	*/	
	}

	StartFrame()
	{
		this.DrawList = new Array<Td>();
	}

	EndFrame()
	{
		var compare = function (a,b) {
		  if (a.Z < b.Z)
			return -1;
		  if (a.Z > b.Z)
			return 1;
		  return 0;
		};
	
		this.DrawList.sort(compare);

		for(var d of this.DrawList)
		{
			d.Paint(this.Context2d);
		}
	}

}



// ../01_Code/MathObject.ts


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




// ../01_Code/TdMathObject.ts


abstract class TdMathObject extends MathObject
{
	Context3d: Context3d;
	Alpha: number;
	Beta: number;
	StartDragPos: Vector2;
	StartDragAlpha: number;
	StartDragBeta: number;
	ButtonList: Array<TdButton>;
	
	constructor(pos: Vector2, size: Vector2, centerShift: Vector2)
	{
		super(pos, size, centerShift);
		
		this.Alpha = 0;
		this.Beta = 0;
		this.ButtonList = new Array<TdButton>();
	}

	SetParent(mathSceneCanvas: MathSceneCanvas): void
	{
		this.Context2d = mathSceneCanvas.Context2d;
		this.MathSceneCanvas = mathSceneCanvas;	
		this.Context3d = new Context3d(this.Context2d);
	}


	AddButton(pos: Vector2, size: Vector2, color: string, func: ()=>void): void
	{
		this.ButtonList.push(new TdButton(pos, size, color, func));		
	}

	PaintVirt(): void
	{
		var r1 = Matrix3.RotationMatrixY(this.Alpha / 180);
		var r2 = Matrix3.RotationMatrixX(this.Beta / 180);
		this.Context3d.Matrix = r2.Mult(r1);
		
		this.Context3d.StartFrame();
		this.Paint3dVirt();
		this.Context3d.EndFrame();

		this.Context2d.Translate(this.CenterShift.Mult(-1));
		for(var b of this.ButtonList)
		{
			this.Context2d.StrokeRect(b.Pos, b.Size);
		}
		this.Context2d.Translate(this.CenterShift);
	}

	abstract Paint3dVirt(): void

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
		
		this.StartDragPos = pos;
		this.StartDragAlpha = this.Alpha;
		this.StartDragBeta = this.Beta;
		return DragResult.Drag;
	}
	
	OnMouseMoveVirt(event: MouseEvent, pos: Vector2) : void
	{
		var delta = pos.Minus(this.StartDragPos);
		
		this.Alpha = this.StartDragAlpha + delta.X;
		this.Beta= this.StartDragBeta + delta.Y;
		
		this.MathSceneCanvas.Repaint();
	}
}


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











// ../01_Code/TestAxisTdMathObject.ts
class TestAxisTdMathObject extends TdMathObject
{
	
	constructor(pos: Vector2, size: Vector2, centerShift: Vector2)
	{
		super(pos, size, centerShift);		
	}
	

	Paint3dVirt(): void
	{
		this.Context3d.DrawLine(new Vector3(-1, 0, 0), new Vector3(1, 0, 0));
		this.Context3d.DrawLine(new Vector3(0, -1, 0), new Vector3(0, 1, 0));
		this.Context3d.DrawLine(new Vector3(0, 0, -1), new Vector3(0, 0, 1));
		this.Context3d.DrawCircle(new Vector3(1.5, 0, 0), 0.5, "white");
		this.Context3d.DrawCircle(new Vector3(0, 1.5, 0), 0.5, "white");
		this.Context3d.DrawCircle(new Vector3(0, 0, 1.5), 0.5, "white");
		this.Context3d.DrawCircle(new Vector3(-1.5, 0, 0), 0.5, "white");
		this.Context3d.DrawCircle(new Vector3(0, -1.5, 0), 0.5, "white");
		this.Context3d.DrawCircle(new Vector3(0, 0, -1.5), 0.5, "white");
	}
	
}



// ../01_Code/PlaneTdMathObject.ts


enum PlaneTdMathObjectState
{
	Plane,
	AxisX,
	AxisY,	
}


class PlaneTdMathObject extends TdMathObject
{
	StartX: number;
	EndX: number;
	StartY: number;
	EndY: number;
	Step: number;
	LenX: number;
	LenY: number;
	CenterX: number;
	CenterY: number;
	Scale: number;
	Func: (x: number, y: number) => number;
	PlaneTdMathObjectState: PlaneTdMathObjectState;
	
	constructor(startX: number, endX: number, startY: number, endY: number, step: number, scale: number, func: (x: number, y: number) => number,  pos: Vector2, size: Vector2, centerShift: Vector2)
	{
		super(pos, size, centerShift);		
		
		this.StartX = startX;
		this.StartY = startY;
		this.EndX = endX;
		this.EndY = endY;
		this.Step = step;
		this.LenX = this.EndX - this.StartX;
		this.LenY = this.EndY - this.StartY;
		this.CenterX = (this.StartX + this.EndX)/2;
		this.CenterY = (this.StartY + this.EndY)/2;
		this.Scale = scale;
		this.Func = func;
		this.PlaneTdMathObjectState = PlaneTdMathObjectState.Plane;
		
		var thisObject = this;
		this.AddButton(new Vector2(10, 10), new Vector2(10, 10), "black", function() { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.Plane;});
		this.AddButton(new Vector2(20, 10), new Vector2(10, 10), "black", function() { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.AxisX;});
		this.AddButton(new Vector2(30, 10), new Vector2(10, 10), "black", function() { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.AxisY;});

		this.AddButton(new Vector2(100, 10), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftUp(); });
		this.AddButton(new Vector2(100, 30), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftDown(); });
		this.AddButton(new Vector2(90, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftLeft(); });
		this.AddButton(new Vector2(110, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftRight(); });
	}
	
	ButtonShiftUp()
	{
		this.Shift(0, -0.1);
	}

	ButtonShiftDown()
	{
		this.Shift(0, 0.1);
	}

	ButtonShiftLeft()
	{
		this.Shift(-0.1, 0);
	}
	
	ButtonShiftRight()
	{
		this.Shift(0.1, 0);
	}
	
	Shift(shiftX: number, shiftY: number)
	{	
		this.StartX += this.LenX * shiftX;
		this.EndX += this.LenX * shiftX;
		this.StartY += this.LenY * shiftY;
		this.EndY += this.LenY * shiftY;
		this.CenterX = (this.StartX + this.EndX)/2;
		this.CenterY = (this.StartY + this.EndY)/2;	
	}

	Paint3dVirt(): void
	{
		this.Context3d.DrawArrow(this.Convert(new Vector3(this.StartX, 0, 0)), this.Convert(new Vector3(this.EndX, 0, 0)), 5, 2);
		this.Context3d.DrawArrow(this.Convert(new Vector3(0, 0, this.StartY)), this.Convert(new Vector3(0, 0, this.EndY)), 5, 2);
		
		if(this.PlaneTdMathObjectState == PlaneTdMathObjectState.Plane)
		{		
			for(var x = this.StartX; x <= this.EndX; x += this.Step)
				for(var y = this.StartY; y <= this.EndY; y += this.Step)
				{
					var value = this.Func(x, y);				
					this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step/2*this.Scale, "white");			
				}
		}

		if(this.PlaneTdMathObjectState == PlaneTdMathObjectState.AxisX)
		{
			for(var x = this.StartX; x <= this.EndX; x += this.Step)
			{
				var y = 0;
				var value = this.Func(x, y);			
				this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step/2*this.Scale, "white");			
			}
		}

		if(this.PlaneTdMathObjectState == PlaneTdMathObjectState.AxisY)
		{
			for(var y = this.StartY; y <= this.EndY; y += this.Step)
			{
				var x = 0;
				var value = this.Func(x, y);			
				this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step/2*this.Scale, "white");			
			}
			
		}
	}
	
	Convert(pos: Vector3)
	{
		return new Vector3((pos.X - this.CenterX)*this.Scale, -pos.Y*this.Scale, -(pos.Z-this.CenterY)*this.Scale);		
	}
	
}



// ../01_Code/ExpTdMathObject.ts



class ExpTdMathObject extends TdMathObject
{
	StartX: number;
	EndX: number;
	StartY: number;
	EndY: number;
	Step: number;
	LenX: number;
	LenY: number;
	CenterX: number;
	CenterY: number;
	Scale: number;
	Center: Complex;
	Angle: number;
	StartC: Complex;
	EndC: Complex;
	OrtC: Complex;
	
	Func: (c: Complex) => Complex;
	
	constructor(startX: number, endX: number, startY: number, endY: number, step: number, scale: number, func: (x: Complex) => Complex,  pos: Vector2, size: Vector2, centerShift: Vector2)
	{
		super(pos, size, centerShift);		
		
		this.StartX = startX;
		this.StartY = startY;
		this.EndX = endX;
		this.EndY = endY;
		this.Step = step;
		this.LenX = this.EndX - this.StartX;
		this.LenY = this.EndY - this.StartY;
		this.CenterX = (this.StartX + this.EndX)/2;
		this.CenterY = (this.StartY + this.EndY)/2;
		this.Scale = scale;
		this.Func = func;
		this.Center = new Complex(0, 0);
		this.Angle = 0;
		this.Recalc();
		
		
		var thisObject = this;
		this.AddButton(new Vector2(10, 10), new Vector2(10, 10), "black", function() { thisObject.ButtonRotateLeft();});
		this.AddButton(new Vector2(20, 10), new Vector2(10, 10), "black", function() { thisObject.ButtonRotateRight();});

		this.AddButton(new Vector2(100, 10), new Vector2(10, 10), "black", function() { thisObject.ButtonShift(new Complex(0, 0.5)); });
		this.AddButton(new Vector2(100, 30), new Vector2(10, 10), "black", function() { thisObject.ButtonShift(new Complex(0, -0.5)); });
		this.AddButton(new Vector2(90, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShift(new Complex(-0.5, 0));});
		this.AddButton(new Vector2(110, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShift(new Complex(0.5, 0));});
	}
	
	ButtonRotateRight()
	{
		this.Angle -= Math.PI/12;
		if(this.Angle < 0)
			this.Angle = 0;
		
		this.Recalc();
		
	}

	ButtonRotateLeft()
	{
		this.Angle += Math.PI/12;
		if(this.Angle > Math.PI/2)
			this.Angle = Math.PI/2;
		this.Recalc();
	}

	ButtonShift(c: Complex)
	{
		this.Center = this.Center.Plus(c);
		this.Recalc();
	}
	
	Recalc()
	{	
		var dir = new Complex(Math.cos(this.Angle), Math.sin(this.Angle));
		var k = Math.tan(this.Angle);
			
		this.OrtC = dir.Mult(new Complex(0, 1));
		var startC1 = this.Calc1(this.StartX, k);
		var endC1 = this.Calc1(this.EndX, k);

		var startC2 = this.Calc2(this.StartY, k);
		var endC2 = this.Calc2(this.EndY, k);
		
		this.StartC = startC1.Im > startC2.Im ? startC1 : startC2;
		this.EndC = endC1.Im < endC2.Im ? endC1 : endC2;
		
	}

	Calc1(x: number, k: number): Complex
	{
		return new Complex(x, k*(x - this.Center.Re)+this.Center.Im);
	}

	Calc2(y: number, k: number): Complex
	{
		return new Complex((y - this.Center.Im)/k+this.Center.Re, y);
	}

	Paint3dVirt(): void
	{
		var delta = this.EndC.Minus(this.StartC);
		var norm = delta.Norm();
		var mag = delta.Magnitude();
		var ort = this.ConvertDir(this.OrtC);

		this.Context3d.DrawArrow(this.Convert(new Complex(this.StartX, 0), 0), this.Convert(new Complex(this.EndX, 0), 0), 5, 2);
		this.Context3d.DrawArrow(this.Convert(new Complex(0, this.StartY), 0), this.Convert(new Complex(0, this.EndY), 0), 5, 2);	

		this.Context3d.DrawArrow(this.Convert(this.StartC, 0), this.Convert(this.EndC, 0), 5, 2);
		this.Context3d.DrawArrow(this.Convert(this.Center, 0), this.Convert(this.Center, 0).Plus(new Vector3(0, -1, 0)), 5, 2);	
		this.Context3d.DrawArrow(this.Convert(this.Center, 0), this.Convert(this.Center, 0).Plus(ort), 5, 2);	


		for(var i = 0; i < mag; i += this.Step)
		{
			var p = this.StartC.Plus(norm.MultNumber(i));
			var value = this.Func(p);

			var start = this.Convert(p, 0);
			var end = start.Plus(new Vector3(0, -value.Re, 0)).Plus(ort.Mult(value.Im));
			this.Context3d.DrawCircle(end, this.Step/2, "white");
			this.Context3d.DrawLine(start, end);
		}
		
	}
	
	Convert(pos: Complex, h: number)
	{
		return new Vector3((pos.Re - this.CenterX)*this.Scale, -h*this.Scale, -(pos.Im-this.CenterY)*this.Scale);
	}

	ConvertDir(pos: Complex)
	{
		return new Vector3(pos.Re*this.Scale, 0, -pos.Im*this.Scale);
	}
	
}



// ../01_Code/Td.ts
abstract class Td
{
	Z: number;
	
	constructor(z: number)
	{
		this.Z = z;
	}
	
	abstract Paint(c: Context2d): void;
}

class LineTd extends Td
{
	Pos1: Vector2;
	Pos2: Vector2;
	
	constructor(pos1: Vector2, pos2: Vector2, z: number)
	{
		super(z);
		this.Pos1 = pos1;
		this.Pos2 = pos2;
	}

	Paint(context2d: Context2d): void
	{
		context2d.Line(this.Pos1, this.Pos2);	
	}
}

class ArrowTd extends Td
{
	Pos1: Vector2;
	Pos2: Vector2;
	Lenght: number;
	Width: number;
	
	constructor(pos1: Vector2, pos2: Vector2, length: number, width: number, z: number)
	{
		super(z);
		this.Pos1 = pos1;
		this.Pos2 = pos2;
		this.Lenght = length;
		this.Width = width;
	}

	Paint(context2d: Context2d): void
	{
		context2d.Arrow(this.Pos1, this.Pos2, this.Lenght, this.Width);	
	}
}

class CircleTd extends Td
{
	Pos: Vector2;
	Radius: number;
	Color: string | null;
	
	constructor(pos: Vector2, radius: number, color: string | null, z: number)
	{
		super(z);
		this.Pos = pos;
		this.Radius = radius;
		this.Color = color;
	}

	Paint(context2d: Context2d): void
	{
		context2d.Circle(this.Pos, this.Radius, this.Color);
	}
}




// ../01_Code/Canvas.ts

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



// ../01_Code/DragResult.ts
enum DragResult
{
	NoDrag,
	Drag,	
}


// ../01_Code/MathSceneCanvas.ts


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


// ../01_Code/Vector2.ts
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

// ../01_Code/Vector3.ts
class Vector3
{
	X: number;
	Y: number;
	Z: number;

	constructor(x: number, y: number, z: number)
 	{
		this.X = x;
		this.Y = y;
		this.Z = z;
	}

	Get(r: number): number
	{
		switch(r)
		{
			case 0: return this.X;
			case 1: return this.Y;
			case 2: return this.Z;
		}
	}

	Set(r: number, v: number): void
	{
		switch(r)
		{
			case 0: 
				this.X = v;
				break;
			case 1: 
				this.Y = v;
				break;
			case 2: 
				this.Z = v;
				break;
		}
	}
	
	Plus(vec: Vector3): Vector3
	{
		return new Vector3(this.X + vec.X, this.Y + vec.Y, this.Z + vec.Z); 
	}

	Minus(vec: Vector3): Vector3
	{
		return new Vector3(this.X - vec.X, this.Y - vec.Y, this.Z - vec.Z); 
	}

	Mult(a: number): Vector3
	{
		return new Vector3(this.X * a, this.Y * a, this.Z * a); 
	}

	Div(a: number): Vector3
	{
		return new Vector3(this.X / a, this.Y / a, this.Z / a); 
	}
	
	ToVector2(): Vector2
	{
		return new Vector2(this.X, this.Y);
	}
	
	ToVector2Proj(dist: number): Vector2
	{
		return new Vector2(this.Proj(this.X, dist), this.Proj(this.Y, dist));
	}

	Proj(r: number, dist: number): number
	{
		return r / (dist - this.Z);
	}

	Len(): number
	{
		return Math.sqrt(this.X*this.X + this.Y*this.Y + this.Z*this.Z);
	}

	Norm(): Vector3
	{
		var len = this.Len();
		return this.Div(len);
	}

	MultVector3(v: Vector3): Vector3
	{
		return new Vector3(this.Y * v.Z - this.Z*v.Y, -this.X * v.Z + this.Z*v.X, this.X * v.Y - this.Y*v.X);		
	}
}


// ../01_Code/Matrix3.ts
class Matrix3
{
	Value: number[][];

	constructor()
 	{
		this.Value = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
	}
	
	Get(r: number, c: number): number
	{
		return this.Value[r][c];
	}

	Set(r: number, c: number, v: number): void
	{
		this.Value[r][c] = v;
	}

	GetAxisX(): Vector3
	{
		return new Vector3(this.Value[0][0], this.Value[1][0], this.Value[2][0]);
	}

	GetAxisY(): Vector3
	{
		return new Vector3(this.Value[0][1], this.Value[1][1], this.Value[2][1]);
	}

	GetAxisZ(): Vector3
	{
		return new Vector3(this.Value[0][2], this.Value[1][2], this.Value[2][2]);
	}

	Mult(m: Matrix3): Matrix3
	{
		var res = new Matrix3();
 		var array = [0, 1, 2];

		for (let r of array) 
		{
			for (let c of array) 
			{
				var sum = 0;
				for (let i of array) 
				{
					sum += this.Value[r][i] * m.Value[i][c];
				}
				res.Value[r][c] = sum; 
			}
		}
		return res;
	}

	MultVector3(v: Vector3): Vector3
	{
		var res = new Vector3(0, 0, 0);
 		var array = [0, 1, 2];

		for (let r of array) 
		{
			var sum = 0;
			for (let i of array) 
			{
				sum += this.Value[r][i] * v.Get(i);
			}
			res.Set(r, sum); 
		}
		return res;
	}
 
	Transp(): Matrix3
	{
		var res = new Matrix3();
 		var array = [0, 1, 2];

		for (let r of array) 
		{
			for (let c of array) 
			{
				res.Value[r][c] = this.Value[c][r]; 
			}
		}
		return res;	
	}
	
	
	static RotationMatrix(angle: number, axis1: number, axis2: number): Matrix3
	{
		var m = new Matrix3();
		var c = Math.cos(angle); 
		var s = Math.sin(angle);
 		
		m.Set(axis1, axis1, c);
		m.Set(axis2, axis2, c);
		m.Set(axis1, axis2, s);
		m.Set(axis2, axis1, -s);
		
		return m;
	}

	static RotationMatrixX(angle: number): Matrix3
	{
		return this.RotationMatrix(angle, 1, 2); 
	}

	static RotationMatrixY(angle: number): Matrix3
	{
		return this.RotationMatrix(angle, 0, 2); 
	}

	static RotationMatrixZ(angle: number): Matrix3
	{
		return this.RotationMatrix(angle, 0, 1); 
	}

}


// Main.ts


{
	var scene = new MathSceneCanvas("canvas1");

//	var a1 = scene.AddMathObject(new PlaneTdMathObject(
//		-4, 2, -4, 4, 0.4, 1, function(x, y) { return Math.sin(y) * Math.exp(x); }, 
//	new Vector2(0, 0), new Vector2(400, 400), new Vector2(200, 200)));
	var a1 = scene.AddMathObject(new ExpTdMathObject(-3, 3, -4, 4, 0.1, 1, function(c: Complex) { return new Complex(Math.cos(c.Im), Math.sin(c.Im)).MultNumber(Math.exp(c.Re)); }, 
	new Vector2(0, 0), new Vector2(400, 400), new Vector2(200, 200)));

	scene.Repaint();

}
