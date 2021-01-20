

{
/*var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');

var image = new Image(50, 50);   // Размер изображения
image.onload = drawImageActualSize; // Рисуем изображение, когда оно будет загружено

// load an image of intrinsic size 300x227 in CSS pixels
image.src = 'img.jpg';*/


	var scene = new MathSceneCanvas("canvas1");

	var a1 = scene.AddSingle(new Complex(1, 1), "#FF0000", SingleMathObjectType.Real, 2, new Vector2(100, 100), new Vector2(200, 200));
	var a2 = scene.AddSingle(new Complex(1, -1), "#0000FF", SingleMathObjectType.One, 2, new Vector2(400, 100), new Vector2(200, 200));
	var s = scene.AddSum(a1, a2, "#00FF00", SumMathObjectType.FrontAndBack, true, 2, new Vector2(700, 100), new Vector2(200, 200));
	scene.AddConjugate(a1, "#00FF00", 2, new Vector2(100, 300), new Vector2(200, 200));
	scene.AddMult(a1, a2, "#00FF00", 2, new Vector2(400, 300), new Vector2(200, 200));
	scene.AddDiv(a1, a2, "#00FF00", 2, new Vector2(700, 300), new Vector2(200, 200));

	scene.Repaint();
	
	a1.SetText("x");
	a2.SetText("y");
	s.SetText("x + y");
}

/*
function drawImageActualSize() 
{
  // use the intrinsic size of image in CSS pixels for the canvas element
  canvas.width = this.naturalWidth;
  canvas.height = this.naturalHeight;


  // will draw the image as 300x227 ignoring the custom size of 60x45
  // given in the constructor
  ctx.drawImage(this, 0, 0, 100, 100);

  // To use the custom size we'll have to specify the scale parameters
  // using the element's width and height properties - lets draw one
  // on top in the corner:
  ctx.drawImage(this, 0, 0, this.width, this.height);
}
*/