var colorScheme = new ColorScheme();
var scene = new MathSceneCanvas("canvasMultOneMagnitude", colorScheme);

var a1 = scene.AddMathObject(new SingleMathObject(new Complex(0.7, 1.2), colorScheme.Arrow1Color, SingleMathObjectType.Simple, 2, new Vector2(0, 0), new Vector2(200, 200)));
var a2 = scene.AddMathObject(new SingleMathObject(new Complex(0.4, 0.9), colorScheme.Arrow2Color, SingleMathObjectType.One, 2, new Vector2(300, 0), new Vector2(200, 200)));
var s = scene.AddMathObject(new MultMathObject(a1, a2, colorScheme.Arrow3Color, 2, new Vector2(600, 0), new Vector2(200, 200)));
a1.SetText("x");
a1.DrawArc = true;

a2.SetText("y");
a2.DrawArc = true;

s.SetText("x × y");
s.DrawArc = true;

scene.AddMathObject(new TextMathObject(function() { return "×";}, new Vector2(250, 100), new Vector2(50, 50)));

scene.AddMathObject(new TextMathObject(function() { return "=";}, new Vector2(550, 100), new Vector2(50, 50)));


scene.Repaint();