var colorScheme = new ColorScheme();
var scene = new MathSceneCanvas("canvasMultSquareIm", colorScheme);

var a1 = scene.AddMathObject(new SingleMathObject(new Complex(0, 1), colorScheme.Arrow1Color, SingleMathObjectType.Simple, 2, new Vector2(0, 0), new Vector2(200, 200)));
var a2 = scene.AddMathObject(new SingleMathObject(new Complex(0, 1), colorScheme.Arrow2Color, SingleMathObjectType.Simple, 2, new Vector2(300, 0), new Vector2(200, 200)));
var s = scene.AddMathObject(new MultMathObject(a1, a2, colorScheme.Arrow3Color, 2, new Vector2(600, 0), new Vector2(200, 200)));
a1.SetText("i");
a1.DrawArc = true;

a2.SetText("i");
a2.DrawArc = true;

s.SetText("i²");
s.DrawArc = true;

scene.AddMathObject(new TextMathObject(function() { return "×";}, new Vector2(250, 100), new Vector2(50, 50)));

scene.AddMathObject(new TextMathObject(function() { return "=";}, new Vector2(550, 100), new Vector2(50, 50)));


scene.Repaint();