
class Context2d
{
	Context: CanvasRenderingContext2D;
	Size: Vector2;
	
	constructor(Canvas: HTMLCanvasElement) 
	{
		this.Context = Canvas.getContext("2d");	
		this.Size = new Vector2(Canvas.width, Canvas.height);
	}

	BeginPath(): void
	{
		this.Context.beginPath();
	}
	
	Circle(pos: Vector2, radius: number, color: string | null): void
	{
		this.Arc(pos, radius, 0, 360);	
		if(color != null)
			this.Fill(color);
	}

	Arc(pos: Vector2, radius: number, angle1: number, angle2: number): void
	{
		this.BeginPath();
		this.Context.arc(pos.X, pos.Y, radius, angle1, angle2);
		this.Stroke();
	}

	Stroke(): void
	{
		this.Context.stroke();
	}
	
	Fill(color: string): void
	{
		this.Context.fillStyle = color;
		this.Context.fill();
	}

	FillText(text: string, pos: Vector2): void
	{
		this.Context.font = "30px serif";
		this.Context.fillStyle = "#000000";
		this.Context.textAlign = "center";
		this.Context.textBaseline  = "middle";
		this.Context.fillText(text, pos.X, pos.Y);
	}

	StrokeRect(conner: Vector2, size: Vector2): void 
	{
		this.Context.strokeRect(conner.X, conner.Y, size.X, size.Y);	
	}

	Line(start: Vector2, end: Vector2): void
	{
		this.BeginPath();
		this.MoveTo(start);
		this.LineTo(end);
		this.Stroke();
	}

	Arrow(start: Vector2, end: Vector2, length: number, width: number): void
	{
		var delta = end.Minus(start);
		var tang = delta.Norm();
		var ort = tang.RotateLeft();
		var point1 = end.Plus(tang.Mult(-length)).Plus(ort.Mult(width));
		var point2 = end.Plus(tang.Mult(-length)).Plus(ort.Mult(-width));
		
		this.Line(start, end);
		this.Line(point1, end);
		this.Line(point2, end);
	}
	
	MoveTo(pos: Vector2): void
	{
		this.Context.moveTo(pos.X, pos.Y);
	}

	LineTo(pos: Vector2): void
	{
		this.Context.lineTo(pos.X, pos.Y);
	}

	StartFrame(): void
	{
//		this.Context.setTransform(1, 0, 0, 1, 0, 0);
		this.Context.clearRect(0, 0, this.Context.canvas.width, this.Context.canvas.height);
	}

	EndFrame(): void
	{
//		this.Stroke();
//		this.Context.beginPath();
	}

	Translate(Pos: Vector2): void
	{
		this.Context.translate(Pos.X, Pos.Y);	
	}
	
	
	SetColor(color: string): void
	{
		this.Context.strokeStyle  = color;		
	}

	GetColor(): string
	{
		return this.Context.strokeStyle as string;
	}


	DrawImageNatural(image: XImage, pos: Vector2): void
	{
		this.Context.drawImage(image.Image, 0, 0, image.Image.naturalWidth, image.Image.naturalHeight, pos.X, pos.Y, image.Image.naturalWidth, image.Image.naturalHeight);
//		this.Context.drawImage(image.Image, 0, 0, image.Image.naturalWidth, image.Image.naturalWidth, pos.X, pos.Y, image.Image.naturalWidth, image.Image.naturalWidth);
	}
	
	
	SetFont(size:number, font: string): void
	{
		this.Context.font = size.toLocaleString() + "px " + font;		
	}
	
	DrawText(text: string, pos: Vector2): void
	{
		this.Context.textBaseline = "top";
		this.Context.fillText(text, pos.X, pos.Y);		
	}
}
