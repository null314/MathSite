

{
	var scene = new MathSceneCanvas("canvas1");

//	var a1 = scene.AddMathObject(new PlaneTdMathObject(
//		-4, 2, -4, 4, 0.4, 1, function(x, y) { return Math.sin(y) * Math.exp(x); }, 
//	new Vector2(0, 0), new Vector2(400, 400), new Vector2(200, 200)));
	var a1 = scene.AddMathObject(new ExpTdMathObject(-3, 3, -4, 4, 0.1, 1, function(c: Complex) { return new Complex(Math.cos(c.Im), Math.sin(c.Im)).MultNumber(Math.exp(c.Re)); }, 
	new Vector2(0, 0), new Vector2(400, 400), new Vector2(200, 200)));

	scene.Repaint();

}
