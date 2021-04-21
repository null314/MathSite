abstract class Td
{
	Z: number;
	
	constructor(z: number)
	{
		this.Z = z;
	}
	
	abstract Paint(c: Context2d): void;
}

class LineTd extends Td
{
	Pos1: Vector2;
	Pos2: Vector2;
	
	constructor(pos1: Vector2, pos2: Vector2, z: number)
	{
		super(z);
		this.Pos1 = pos1;
		this.Pos2 = pos2;
	}

	Paint(context2d: Context2d): void
	{
		context2d.Line(this.Pos1, this.Pos2);	
	}
}

class ArrowTd extends Td
{
	Pos1: Vector2;
	Pos2: Vector2;
	Lenght: number;
	Width: number;
	
	constructor(pos1: Vector2, pos2: Vector2, length: number, width: number, z: number)
	{
		super(z);
		this.Pos1 = pos1;
		this.Pos2 = pos2;
		this.Lenght = length;
		this.Width = width;
	}

	Paint(context2d: Context2d): void
	{
		context2d.Arrow(this.Pos1, this.Pos2, this.Lenght, this.Width);	
	}
}

class CircleTd extends Td
{
	Pos: Vector2;
	Radius: number;
	Color: string | null;
	
	constructor(pos: Vector2, radius: number, color: string | null, z: number)
	{
		super(z);
		this.Pos = pos;
		this.Radius = radius;
		this.Color = color;
	}

	Paint(context2d: Context2d): void
	{
		context2d.Circle(this.Pos, this.Radius, this.Color);
	}
}


