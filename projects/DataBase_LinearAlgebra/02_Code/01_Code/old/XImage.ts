




class XImage
{
	Image: HTMLImageElement;
	IsLoaded: boolean;
	OnLoad: () => void
	
	
	constructor(src: string, onLoad: () => void)
	{
		var thisObj = this;
		this.OnLoad = onLoad;
		this.Image = new Image(50, 50);
		this.Image.onload = function() 
		{ 
			thisObj.IsLoaded = true;
			thisObj.OnLoad();
		}; 
		this.Image.src = src;	
	}
	
	DrawImageNatural(canvas: Canvas2d, pos: Vector2): void
	{
		canvas.Context.drawImage(this.Image, 0, 0, this.Image.naturalWidth, this.Image.naturalHeight, pos.X, pos.Y, this.Image.naturalWidth, this.Image.naturalHeight);
	}

}

