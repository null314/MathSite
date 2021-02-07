

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
