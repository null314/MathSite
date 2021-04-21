
class Model1XObject extends AxesXObject
{
	Position: Vector2;
	DPosition: Vector2;
	
	constructor(pos: Vector2, size: Vector2)
	{
		super(20, -10, 100, -10, pos, size)
		this.Init();
		this.StartTimer(0.01);
		var thisVar = this;
		this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function(){ thisVar.Init();});		
	}

	Init(): void
	{
		this.Position = new Vector2(10, 10);
		this.DPosition = new Vector2(20, 20);
	}

	OnUpdate(dt: number)
	{
//		правило производной		
//		this.Position = this.Position + this.DPosition * dt;
		this.Position = this.Position.Plus(this.DPosition.Mult(dt));
	}
	
	CheckForRestart(): boolean
	{
		return this.Position.X > 100;
	}
	
	FinalPaintVirt(): void
	{
		this.DrawAxis();
		if(this.IsInside(this.Position, 10))	
		{
			this.Context2d.CircleX(this.Position, 10, "#cbc7ae", 1, "#cbc7ae");
			this.Context2d.ArrowX(this.Position, this.Position.Plus(this.DPosition), 5, 2, "grey", 1);
		}
	}
}

var container = new ContainerCanvas("canvasModel1");
container.AddXObject(new Model1XObject(new Vector2(0, 0), new Vector2(200, 200)));
container.Repaint();
