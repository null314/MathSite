var scene = new MathSceneCanvas("canvasSum");
var a1 = scene.AddMathObject(new SingleMathObject(new Complex(0.8, 1), "#FF0000", SingleMathObjectType.Simple, 2, new Vector2(0, 0), new Vector2(200, 200)));
var a2 = scene.AddMathObject(new SingleMathObject(new Complex(0.8, -0.5), "#0000FF", SingleMathObjectType.Simple, 2, new Vector2(300, 0), new Vector2(200, 200)));
var s = scene.AddMathObject(new SumMathObject(a1, a2, "#00FF00", SumMathObjectType.FrontAndBack, false, 2, new Vector2(600, 0), new Vector2(200, 200)));
a1.SetText("x");
a2.SetText("y");
s.SetText("x + y");

scene.AddMathObject(new TextMathObject(function() { return "+";}, new Vector2(250, 100), new Vector2(50, 50)));

scene.AddMathObject(new TextMathObject(function() { return "=";}, new Vector2(550, 100), new Vector2(50, 50)));

scene.Repaint();
