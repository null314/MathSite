

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
		
		this.LineX(start, end, color, lineWidth);
		this.LineX(point1, end, color, lineWidth);
		this.LineX(point2, end, color, lineWidth);
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

	LineX(start: Vector2, end: Vector2, lineColor: string, lineWidth: number): void
	{
		this.Context.beginPath();
		this.MoveTo(start);
		this.LineTo(end);
		this.Context.strokeStyle = lineColor;
		this.Context.lineWidth = lineWidth;
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


// 01_Code/Context3d.ts
class Context3d
{
	Matrix: Matrix3;
	Context2d: Context2d;
	Scale: number;
	Distance: number;

	DrawList: Array<Primitive>

	constructor(context2d: Context2d)
	{
		this.Context2d = context2d;
		this.Scale = 300;
		this.Distance = 8;
		this.Matrix = new Matrix3();
		
		this.DrawList = new Array<Primitive>(); 
	}

	GetViewVector3() : Vector3
	{
		return this.Matrix.Transp().MultVector3(new Vector3(0, 0, 1));		
	}

	DrawCircle(pos: Vector3, radius: number, lineColor: string | null, lineWidth: number, fillColor: string | null): void
	{	
		var posGlobal = this.Matrix.MultVector3(pos);
		var radiusProj = posGlobal.Proj(radius, this.Distance) * this.Scale; 
		var z = posGlobal.Z;
		if(radiusProj <= 0)
			return;
		
		var posProj = posGlobal.ToVector2Proj(this.Distance).Mult(this.Scale); 

		this.DrawList.push(new CirclePrimitive(posProj, radiusProj, lineColor, lineWidth, fillColor, z));	
	}

	DrawLine(pos1: Vector3, pos2: Vector3, lineColor: string, lineWidth: number): void
	{
		var posGlobal1 = this.Matrix.MultVector3(pos1);
		var posGlobal2 = this.Matrix.MultVector3(pos2);
		var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var z = (posGlobal1.Z + posGlobal2.Z)/2;

		this.DrawList.push(new LinePrimitive(posProj1, posProj2, lineColor, lineWidth, z));
	}

	DrawArrow(pos1: Vector3, pos2: Vector3, arrowLength: number, arrowWidth: number, color: string, lineWidth: number): void
	{
		var posGlobal1 = this.Matrix.MultVector3(pos1);
		var posGlobal2 = this.Matrix.MultVector3(pos2);
		var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale); 
		var z = (posGlobal1.Z + posGlobal2.Z)/2;

		this.DrawList.push(new ArrowPrimitive(posProj1, posProj2, arrowLength, arrowWidth, color, lineWidth, z));
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
		this.DrawList = new Array<Primitive>();
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

// 01_Code/Vector3.ts
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


// 01_Code/Matrix3.ts
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
//	abstract OnUpdate(interval: number): void;
//	abstract CheckForRestart(): boolean;
//	abstract Init(): void;


	
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
	
/*	StartTimer(interval: number): void
	{
		var thisValue = this;
		
		var myfunc = setInterval(function() 
		{
			thisValue.OnUpdate(interval);
			thisValue.ContainerCanvas.Repaint();
			if(thisValue.CheckForRestart())
				thisValue.Init();
		}, 
		interval * 1000);	
	}*/
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


// 01_Code/SceneXObject.ts

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


abstract class SceneXObject extends XObject
{
	Context3d: Context3d;
	Alpha: number;
	Beta: number;
	StartDragPos: Vector2;
	StartDragAlpha: number;
	StartDragBeta: number;
	ButtonList: Array<XButton>;
	
	constructor(pos: Vector2, size: Vector2, centerShift: Vector2)
	{
		super(pos, size, centerShift);
		
		this.Alpha = 0;
		this.Beta = 0;
		this.ButtonList = new Array<XButton>();
	}

/*	SetParent(containerCanvas: ContainerCanvas): void
	{
		this.Context2d = mathSceneCanvas.Context2d;
		this.MathSceneCanvas = mathSceneCanvas;	
		this.Context3d = new Context3d(this.Context2d);
	}*/

	InitCanvas(containerCanvas: ContainerCanvas): void
	{
		this.Context3d = new Context3d(this.Context2d);
	}

	AddButton(pos: Vector2, size: Vector2, color: string, func: ()=>void): void
	{
		this.ButtonList.push(new XButton(pos, size, color, func));		
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
			this.Context2d.StrokeRectX(b.Pos, b.Size, b.Color, 1);
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
		
		this.ContainerCanvas.Repaint();
	}
}













// 01_Code/Primitive.ts

abstract class Primitive
{
	Z: number;
	
	constructor(z: number)
	{
		this.Z = z;
	}
	
	abstract Paint(c: Context2d): void;
}

class LinePrimitive extends Primitive
{
	Pos1: Vector2;
	Pos2: Vector2;
	Color: string;
	LineWidth: number;
	
	constructor(pos1: Vector2, pos2: Vector2, color: string, lineWidth: number, z: number)
	{
		super(z);
		this.Pos1 = pos1;
		this.Pos2 = pos2;
		this.Color = color;
		this.LineWidth = lineWidth;
	}

	Paint(context2d: Context2d): void
	{
		context2d.LineX(this.Pos1, this.Pos2, this.Color, this.LineWidth);	
	}
}

class ArrowPrimitive extends Primitive
{
	Pos1: Vector2;
	Pos2: Vector2;
	ArrowLenght: number;
	ArrowWidth: number;
	Color: string;
	LineWidth: number;
	
	constructor(pos1: Vector2, pos2: Vector2, arrowLength: number, arrowWidth: number, color: string, lineWidth: number, z: number)
	{
		super(z);
		this.Pos1 = pos1;
		this.Pos2 = pos2;
		this.ArrowLenght = arrowLength;
		this.ArrowWidth = arrowWidth;
		this.Color = color;
		this.LineWidth = lineWidth;
	}

	Paint(context2d: Context2d): void
	{
		context2d.ArrowX(this.Pos1, this.Pos2, this.ArrowLenght, this.ArrowWidth, this.Color, this.LineWidth);	
	}
}

class CirclePrimitive extends Primitive
{
	Pos: Vector2;
	Radius: number;
	LineColor: string | null;
	LineWidth: number;
	FillColor: string;
	
	constructor(pos: Vector2, radius: number, lineColor: string | null, lineWidth: number, fillColor: string | null, z: number)
	{
		super(z);
		this.Pos = pos;
		this.Radius = radius;
		this.LineColor = lineColor;
		this.LineWidth = lineWidth;
		this.FillColor = fillColor;
	}

	Paint(context2d: Context2d): void
	{
		context2d.CircleX(this.Pos, this.Radius, this.LineColor, this.LineWidth, this.FillColor);
	}
}




// 01_Code/VectorXObject.ts




class VectorXObject extends SceneXObject
{
/*	StartX: number;
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
	PlaneTdMathObjectState: PlaneTdMathObjectState;*/
	
	constructor(/*startX: number, endX: number, startY: number, endY: number, step: number, 
	scale: number, func: (x: number, y: number) => number, */ pos: Vector2, size: Vector2, centerShift: Vector2)
	{
		super(pos, size, centerShift);		
		
/*		this.StartX = startX;
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
		this.AddButton(new Vector2(110, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftRight(); });*/
	}
	
/*	ButtonShiftUp()
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
	}*/

	Paint3dVirt(): void
	{
		this.Context3d.DrawArrow(new Vector3(0, 0, 0), new Vector3(1, 0, 0), 5, 2, "blue", 1);
		this.Context3d.DrawArrow(new Vector3(0, 0, 0), new Vector3(0, 1, 0), 5, 2, "blue", 1);
		this.Context3d.DrawArrow(new Vector3(0, 0, 0), new Vector3(0, 0, 1), 5, 2, "blue", 1);
		
/*		if(this.PlaneTdMathObjectState == PlaneTdMathObjectState.Plane)
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
			
		}*/
	}
}


var container = new ContainerCanvas("canvasModel1");
container.AddXObject(new VectorXObject(new Vector2(0, 0), new Vector2(200, 200), new Vector2(100, 100)));
container.Repaint();
