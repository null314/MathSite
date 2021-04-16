class Phys3MathObject extends HeaderMathObject
{
	Position: Vector2;
	DPosition: Vector2;
	
	constructor(pos: Vector2, size: Vector2)
	{
		super(20, -10, 290, -10, pos, size)
		
		this.Reset();
		var thisVar = this;
		
		this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function(){ thisVar.Reset();});
		
		this.StartTimer(0.01);
	}

	Reset(): void
	{
		this.Position = new Vector2(10, 10);
		this.DPosition = new Vector2(20, 40);
	}

	OnUpdate(interval: number)
	{
		var force = 300; 
		var mass = 1;

		var ddPosition = new Vector2(0, -30);
		if(this.Position.Y - 10 < 0)
		{
			ddPosition = ddPosition.Plus(new Vector2(0, force / mass));
		}

		this.DPosition = this.DPosition.Plus(ddPosition.Mult(interval));
		this.Position = this.Position.Plus(this.DPosition.Mult(interval));
	}
	
	FinalPaintVirt(): void
	{
		this.DrawAxis();
		if(this.IsInside(this.Position, 10))	
		{
			this.Context2d.CircleX(this.Position, 10, "black", 1, null);
			this.Context2d.ArrowX(this.Position, this.Position.Plus(this.DPosition), 5, 2, "#0000AA", 1);
		}
	}

	
}
