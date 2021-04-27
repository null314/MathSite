
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











