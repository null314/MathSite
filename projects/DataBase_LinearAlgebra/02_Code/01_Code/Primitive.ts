
abstract class Primitive
{
	Z: number;
	
	constructor(z: number)
	{
		this.Z = z;
	}
	
	abstract Paint(c: Context2d): void;
}

class LinePrimitive extends Primitive
{
	Pos1: Vector2;
	Pos2: Vector2;
	Color: string;
	LineWidth: number;
	
	constructor(pos1: Vector2, pos2: Vector2, color: string, lineWidth: number, z: number)
	{
		super(z);
		this.Pos1 = pos1;
		this.Pos2 = pos2;
		this.Color = color;
		this.LineWidth = lineWidth;
	}

	Paint(context2d: Context2d): void
	{
		context2d.LineX(this.Pos1, this.Pos2, this.Color, this.LineWidth);	
	}
}

class ArrowPrimitive extends Primitive
{
	Pos1: Vector2;
	Pos2: Vector2;
	ArrowLenght: number;
	ArrowWidth: number;
	Color: string;
	LineWidth: number;
	
	constructor(pos1: Vector2, pos2: Vector2, arrowLength: number, arrowWidth: number, color: string, lineWidth: number, z: number)
	{
		super(z);
		this.Pos1 = pos1;
		this.Pos2 = pos2;
		this.ArrowLenght = arrowLength;
		this.ArrowWidth = arrowWidth;
		this.Color = color;
		this.LineWidth = lineWidth;
	}

	Paint(context2d: Context2d): void
	{
		context2d.ArrowX(this.Pos1, this.Pos2, this.ArrowLenght, this.ArrowWidth, this.Color, this.LineWidth);	
	}
}

class CirclePrimitive extends Primitive
{
	Pos: Vector2;
	Radius: number;
	LineColor: string | null;
	LineWidth: number;
	FillColor: string;
	
	constructor(pos: Vector2, radius: number, lineColor: string | null, lineWidth: number, fillColor: string | null, z: number)
	{
		super(z);
		this.Pos = pos;
		this.Radius = radius;
		this.LineColor = lineColor;
		this.LineWidth = lineWidth;
		this.FillColor = fillColor;
	}

	Paint(context2d: Context2d): void
	{
		context2d.CircleX(this.Pos, this.Radius, this.LineColor, this.LineWidth, this.FillColor);
	}
}


