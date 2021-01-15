{
	var scene = new MathSceneCanvas("canvas1");

	var a1 = scene.AddSingle(new Complex(1, 1), 2, new Vector2(100, 100), new Vector2(200, 200));
	var a2 = scene.AddSingle(new Complex(1, -1), 2, new Vector2(400, 100), new Vector2(200, 200));
	scene.AddSum(a1, a2, 2, new Vector2(700, 100), new Vector2(200, 200));
	scene.AddConjugate(a1, 2, new Vector2(100, 300), new Vector2(200, 200));
	scene.AddMult(a1, a2, 2, new Vector2(400, 300), new Vector2(200, 200));
	scene.AddDiv(a1, a2, 2, new Vector2(700, 300), new Vector2(200, 200));

	scene.Repaint();
}

