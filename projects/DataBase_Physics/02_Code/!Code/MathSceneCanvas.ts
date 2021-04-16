

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
