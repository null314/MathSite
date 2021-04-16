var colorScheme = new ColorScheme();
var scene = new MathSceneCanvas("canvasSumCommutativity", colorScheme);
var a1 = scene.AddMathObject(new SingleMathObject(new Complex(0.8, 1), colorScheme.Arrow1Color, SingleMathObjectType.Simple, 2, new Vector2(0, 0), new Vector2(200, 200)));
var a2 = scene.AddMathObject(new SingleMathObject(new Complex(0.5, -0.8), colorScheme.Arrow2Color, SingleMathObjectType.Simple, 2, new Vector2(250, 0), new Vector2(200, 200)));
var s1 = scene.AddMathObject(new SumMathObject(a1, a2, colorScheme.Arrow3Color, SumMathObjectType.Front, false, 2, new Vector2(500, 0), new Vector2(200, 200)));
var s2 = scene.AddMathObject(new SumMathObject(a1, a2, colorScheme.Arrow3Color, SumMathObjectType.Back, false, 2, new Vector2(750, 0), new Vector2(200, 200)));

scene.AddMathObject(new TextMathObject(function() { return "+";}, new Vector2(225, 100), new Vector2(50, 50)));
scene.AddMathObject(new TextMathObject(function() { return "=";}, new Vector2(475, 100), new Vector2(50, 50)));
scene.AddMathObject(new TextMathObject(function() { return "=";}, new Vector2(725, 100), new Vector2(50, 50)));

a1.SetText("x");
a2.SetText("y");
s1.SetText("x + y");
s2.SetText("y + x");

scene.Repaint();
