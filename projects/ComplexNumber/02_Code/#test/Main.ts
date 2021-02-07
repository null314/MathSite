

{
	var scene = new MathSceneCanvas("canvas1");

	var a1 = scene.AddMathObject(new SingleMathObject(new Complex(1, 1), "#FF0000", SingleMathObjectType.Real, 2, new Vector2(100, 100), new Vector2(200, 200)));
	var a2 = scene.AddMathObject(new SingleMathObject(new Complex(1, -1), "#0000FF", SingleMathObjectType.One, 2, new Vector2(400, 100), new Vector2(200, 200)));
	var s = scene.AddMathObject(new SumMathObject(a1, a2, "#00FF00", SumMathObjectType.FrontAndBack, true, 2, new Vector2(700, 100), new Vector2(200, 200)));
	scene.AddMathObject(new ConjugateMathObject(a1, "#00FF00", 2, new Vector2(100, 300), new Vector2(200, 200)));
	scene.AddMathObject(new MultMathObject(a1, a2, "#00FF00", 2, new Vector2(400, 300), new Vector2(200, 200)));
	scene.AddMathObject(new DivMathObject(a1, a2, "#00FF00", 2, new Vector2(700, 300), new Vector2(200, 200)));

	scene.Repaint();
	
	a1.SetText("x");
	a2.SetText("y");
	s.SetText("x + y");

	scene.Repaint();
	
}
