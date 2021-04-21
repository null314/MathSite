
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
