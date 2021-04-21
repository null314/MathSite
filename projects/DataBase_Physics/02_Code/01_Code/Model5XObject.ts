class Ball
{
	Mass: number;
	Radius: number;
	Color: string;
	Position: Vector2;
	DPosition: Vector2;
	Force: Vector2;
	
	constructor(mass: number, radius: number, color: string, position: Vector2, dPosition: Vector2)
	{
		this.Mass = mass;
		this.Radius = radius;
		this.Color = color;
		this.Position = position;
		this.DPosition = dPosition;
	}
	
	ClearForce()
	{
		this.Force = new Vector2(0, 0);	
	}

	AddForce(force: Vector2)
	{
		this.Force = this.Force.Plus(force);
	}
	
	OnUpdate(dt: number)
	{
//		вычислить ускорение
//		var ddPosition = this.Force / this.Mass;
		var ddPosition = this.Force.Div(this.Mass);

//		правило производной		
//		this.DPosition = this.DPosition + ddPosition * dt;
		this.DPosition = this.DPosition.Plus(ddPosition.Mult(dt));

//		правило производной		
//		this.Position = this.Position + this.DPosition * dt;
		this.Position = this.Position.Plus(this.DPosition.Mult(dt));
	}
}

class Model5XObject extends AxesXObject
{
	BallList: Array<Ball>;
	RightBorder: number;

	constructor(pos: Vector2, size: Vector2)
	{
		super(20, -10, 210, -10, pos, size)
		this.Init();
		this.RightBorder = 200;
		this.StartTimer(0.01);

		var thisVar = this;
		this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function(){ thisVar.Init();});
		this.AddButton(new Vector2(25, 5), new Vector2(10, 10), "black", function(){ thisVar.Randomize();});		
	}

	Init(): void
	{
		this.BallList = new Array<Ball>();
		this.BallList.push(new Ball(3, 9, "#f1aeb2", new Vector2(80, 110), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 12, "#d07c7F", new Vector2(85, 40), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 15, "#e8b44f", new Vector2(75, 80), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 10, "#8b9c1d", new Vector2(85, 10), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 8, "#687a4e", new Vector2(120, 10), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 10, "#cbc7ae", new Vector2(115, 40), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 11, "#683c32", new Vector2(115, 80), new Vector2(0, 0)));
	}

	Randomize(): void
	{
		for(var ball of this.BallList)
		{
			ball.DPosition = new Vector2((Math.random()- 0.5), Math.random()- 0.5).Mult(100);
		}
	}

	OnUpdate(dt: number)
	{
		var gravityAcceleration = new Vector2(0, -30);
		var wallElasticityForce = 2000;

		for(var ball of this.BallList)
//			обнулить силы
			ball.ClearForce();

		for(var ball of this.BallList)
		{
//			добавить силу гравитации			
			ball.AddForce(gravityAcceleration.Mult(ball.Mass));
				
//			добавить силу отталкивания от пола
			if(ball.Position.Y - ball.Radius < 0)
			{
				ball.AddForce(new Vector2(0, wallElasticityForce));
			}
//			добавить силу отталкивания от левой стены
			if(ball.Position.X - ball.Radius < 0)
			{
				ball.AddForce(new Vector2(wallElasticityForce, 0));
			}
//			добавить силу отталкивания от правой стены
			if(ball.Position.X + ball.Radius > this.RightBorder)
			{
				ball.AddForce(new Vector2(-wallElasticityForce, 0));
			}
		}
		
//		добавить силу отталкивания шариков друг от друга
		for(var i = 0; i < this.BallList.length; i++)
			for(var o = i+1; o < this.BallList.length; o++)
			{
				var collideForce = this.GetCollideForce(this.BallList[i], this.BallList[o]);
				this.BallList[i].AddForce(collideForce.Mult(-1));
				this.BallList[o].AddForce(collideForce);
			}
		
		for(var ball of this.BallList)
		{	
			ball.OnUpdate(dt);
		}
	}
	
	CheckForRestart(): boolean
	{
		return false;
	}

	GetCollideForce(ball1: Ball, ball2: Ball): Vector2
	{
		var ballElasticityForce = 600;
		
		var delta = ball2.Position.Minus(ball1.Position);
		var dist = delta.Length();
		if(dist < ball1.Radius + ball2.Radius)
		{
			return delta.Div(dist).Mult(ballElasticityForce);
		}
		return new Vector2(0, 0);
	}
	
	FinalPaintVirt(): void
	{
		this.DrawAxis();
		for(var ball of this.BallList)
		{
			this.Context2d.CircleX(ball.Position, ball.Radius, ball.Color, 1, ball.Color);
		}
		this.Context2d.ArrowX(new Vector2(this.RightBorder, 0), new Vector2(this.RightBorder, this.TopY), 10, 3, "grey", 1);
	}
}

var container = new ContainerCanvas("canvasModel5");
container.AddXObject(new Model5XObject(new Vector2(0, 0), new Vector2(400, 300)));
container.Repaint();
