var colorScheme = new ColorScheme();
var scene = new MathSceneCanvas("canvasConjugateSum", colorScheme);

var a1 = scene.AddMathObject(new SingleMathObject(new Complex(1.2, 0.2), colorScheme.Arrow1Color, SingleMathObjectType.Simple, 2, new Vector2(0, 0), new Vector2(200, 200)));
var a2 = scene.AddMathObject(new SingleMathObject(new Complex(-0.3, 0.7), colorScheme.Arrow2Color, SingleMathObjectType.Simple, 2, new Vector2(300, 0), new Vector2(200, 200)));
var s = scene.AddMathObject(new SumMathObject(a1, a2, colorScheme.Arrow3Color, SumMathObjectType.FrontAndBack, false, 2, new Vector2(600, 0), new Vector2(200, 200)));

var c1 = scene.AddMathObject(new ConjugateMathObject(a1, colorScheme.Arrow1Color, 2, new Vector2(0, 300), new Vector2(200, 200)));
var c2 = scene.AddMathObject(new ConjugateMathObject(a2, colorScheme.Arrow2Color, 2, new Vector2(300, 300), new Vector2(200, 200)));
var cs = scene.AddMathObject(new SumMathObject(c1, c2, colorScheme.Arrow3Color, SumMathObjectType.FrontAndBack, false, 2, new Vector2(600, 300), new Vector2(200, 200)));

a1.SetText("x");
a2.SetText("y");
s.SetText("x + y");
c1.SetImage("Img/conj1.png");
c2.SetImage("Img/conj4.png");
cs.SetImage("Img/conj3.png");

scene.AddMathObject(new TextMathObject(function() { return "+";}, new Vector2(250, 100), new Vector2(50, 50)));
scene.AddMathObject(new TextMathObject(function() { return "=";}, new Vector2(550, 100), new Vector2(50, 50)));

scene.AddMathObject(new TextMathObject(function() { return "+";}, new Vector2(250, 400), new Vector2(50, 50)));
scene.AddMathObject(new TextMathObject(function() { return "=";}, new Vector2(550, 400), new Vector2(50, 50)));

scene.AddMathObject(new TextMathObject(function() { return "↓";}, new Vector2(100, 250), new Vector2(50, 50)));
scene.AddMathObject(new TextMathObject(function() { return "↓";}, new Vector2(400, 250), new Vector2(50, 50)));
scene.AddMathObject(new TextMathObject(function() { return "↓";}, new Vector2(700, 250), new Vector2(50, 50)));


scene.Repaint();