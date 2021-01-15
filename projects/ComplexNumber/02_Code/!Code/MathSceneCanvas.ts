

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
