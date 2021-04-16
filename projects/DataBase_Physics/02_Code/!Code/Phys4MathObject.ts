


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
	
	OnUpdate(interval: number)
	{
		this.DPosition = this.DPosition.Plus(this.Force.Mult(interval).Div(this.Mass));
		this.Position = this.Position.Plus(this.DPosition.Mult(interval));
	}
}


class Phys4MathObject extends HeaderMathObject
{
	BallList: Array<Ball>;
	RightBorder: number;

	constructor(pos: Vector2, size: Vector2)
	{
		super(20, -10, 210, -10, pos, size)
		
		this.Reset();
		var thisVar = this;
		
		this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function(){ thisVar.Reset();});
		this.AddButton(new Vector2(25, 5), new Vector2(10, 10), "black", function(){ thisVar.Randomize();});
		
		this.RightBorder = 200;
		this.StartTimer(0.01);
	}

	Reset(): void
	{
		this.BallList = new Array<Ball>();
		this.BallList.push(new Ball(3, 9, "#f1aeb2", new Vector2(50, 110), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 12, "#d07c7F", new Vector2(55, 40), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 15, "#e8b44f", new Vector2(45, 80), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 10, "#8b9c1d", new Vector2(55, 10), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 8, "#687a4e", new Vector2(80, 10), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 10, "#cbc7ae", new Vector2(85, 40), new Vector2(0, 0)));
		this.BallList.push(new Ball(1, 11, "#683c32", new Vector2(85, 80), new Vector2(0, 0)));
	}

	Randomize(): void
	{
		for(var ball of this.BallList)
		{
			ball.DPosition = new Vector2((Math.random()- 0.5), Math.random()- 0.5).Mult(100);
		}
	}

	OnUpdate(interval: number)
	{
		var gravity = new Vector2(0, -30);
		var force = 2000;

		for(var ball of this.BallList)
		{
			ball.ClearForce();
			ball.AddForce(gravity.Mult(ball.Mass));
				
			if(ball.Position.Y - ball.Radius < 0)
			{
				ball.AddForce(new Vector2(0, force));
			}
			if(ball.Position.X - ball.Radius < 0)
			{
				ball.AddForce(new Vector2(force, 0));
			}
			if(ball.Position.X + ball.Radius > this.RightBorder)
			{
				ball.AddForce(new Vector2(-force, 0));
			}
		}
		
		
		for(var i = 0; i < this.BallList.length; i++)
			for(var o = i+1; o < this.BallList.length; o++)
			{
				var collideForce = this.GetCollideForce(this.BallList[i], this.BallList[o]);
				this.BallList[i].AddForce(collideForce.Mult(-1));
				this.BallList[o].AddForce(collideForce);
			}
		
		
		for(var ball of this.BallList)
		{	
			ball.OnUpdate(interval);
		}
	}
	
	GetCollideForce(ball1: Ball, ball2: Ball): Vector2
	{
		var force = 600;
		
		var delta = ball2.Position.Minus(ball1.Position);
		var dist = delta.Length();
		if(dist < ball1.Radius + ball2.Radius)
		{
			return delta.Div(dist).Mult(force);
		}
		return new Vector2(0, 0);
	}
	
	FinalPaintVirt(): void
	{
		this.DrawAxis();
		for(var ball of this.BallList)
		{
			this.Context2d.CircleX(ball.Position, ball.Radius, ball.Color, 1, ball.Color);
//			this.Context2d.ArrowX(ball.Position, ball.Position.Plus(ball.DPosition), 5, 2, "#0000AA", 1);
		}
		this.Context2d.ArrowX(new Vector2(this.RightBorder, 0), new Vector2(this.RightBorder, this.TopY), 5, 2, "grey", 1);
	}

	
}
