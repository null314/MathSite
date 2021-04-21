class Model4XObject extends AxesXObject
{
	Position: Vector2;
	DPosition: Vector2;
	RightBorder: number;
	
	constructor(pos: Vector2, size: Vector2)
	{
		super(20, -10, 110, -10, pos, size)
		this.RightBorder = 95;
		this.Init();
		this.StartTimer(0.01);
		var thisVar = this;
		this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function(){ thisVar.Init();});
	}

	Init(): void
	{
		this.Position = new Vector2(10, 10);
		this.DPosition = new Vector2(20, 40);
	}

	OnUpdate(dt: number)
	{
		var gravityAcceleration = new Vector2(0, -30);
		var wallElasticityForce = 300; 
		var ballMass = 1;
		var ballRadius = 10;

//		вычислить силу гравитации			
		var force = gravityAcceleration.Mult(ballMass);

//		добавить силу отталкивания от пола
		if(this.Position.Y - ballRadius < 0)
		{
			force = force.Plus(new Vector2(0, wallElasticityForce));
		}
//		добавить силу отталкивания от левой стены
		if(this.Position.X - ballRadius < 0)
		{
			force = force.Plus(new Vector2(wallElasticityForce, 0));
		}
//		добавить силу отталкивания от правой стены
		if(this.Position.X + ballRadius > this.RightBorder)
		{
			force = force.Plus(new Vector2(-wallElasticityForce, 0));
		}
		
//		вычислить ускорение
//		var ddPosition = force / ballMass;
		var ddPosition = force.Div(ballMass);

//		правило производной		
//		this.DPosition = this.DPosition + ddPosition * dt;
		this.DPosition = this.DPosition.Plus(ddPosition.Mult(dt));
		
//		правило производной		
//		this.Position = this.Position + this.DPosition * dt;
		this.Position = this.Position.Plus(this.DPosition.Mult(dt));
	}
	
	CheckForRestart(): boolean
	{
		return false;
	}
	
	FinalPaintVirt(): void
	{
		this.DrawAxis();
		if(this.IsInside(this.Position, 10))	
		{
			this.Context2d.CircleX(this.Position, 10, "#cbc7ae", 1, "#cbc7ae");
			this.Context2d.ArrowX(this.Position, this.Position.Plus(this.DPosition), 5, 2, "grey", 1);
		}
		this.Context2d.ArrowX(new Vector2(this.RightBorder, 0), new Vector2(this.RightBorder, this.TopY), 10, 3, "grey", 1);
	}
}

var container = new ContainerCanvas("canvasModel4");
container.AddXObject(new Model4XObject(new Vector2(0, 0), new Vector2(200, 200)));
container.Repaint();
