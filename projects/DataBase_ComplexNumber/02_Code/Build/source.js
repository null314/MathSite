var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// 01_Code/Complex.ts
var Complex = /** @class */ (function () {
    function Complex(re, im) {
        this.Re = re;
        this.Im = im;
    }
    Complex.prototype.Plus = function (c) {
        return new Complex(this.Re + c.Re, this.Im + c.Im);
    };
    Complex.prototype.Minus = function (c) {
        return new Complex(this.Re - c.Re, this.Im - c.Im);
    };
    Complex.prototype.Mult = function (c) {
        return new Complex(this.Re * c.Re - this.Im * c.Im, this.Re * c.Im + this.Im * c.Re);
    };
    Complex.prototype.MultNumber = function (c) {
        return new Complex(this.Re * c, this.Im * c);
    };
    Complex.prototype.Magnitude = function () {
        return Math.sqrt(this.MagnitudeSqr());
    };
    Complex.prototype.MagnitudeSqr = function () {
        return this.Re * this.Re + this.Im * this.Im;
    };
    Complex.prototype.Div = function (c) {
        var magnitudeSqr = c.MagnitudeSqr();
        return new Complex((this.Re * c.Re + this.Im * c.Im) / magnitudeSqr, (this.Im * c.Re - this.Re * c.Im) / magnitudeSqr);
    };
    Complex.prototype.Conjugate = function () {
        return new Complex(this.Re, -this.Im);
    };
    Complex.prototype.Norm = function () {
        var magnitude = this.Magnitude();
        return new Complex(this.Re / magnitude, this.Im / magnitude);
    };
    Complex.prototype.Argument = function () {
        if (this.Im > 0)
            return Math.acos(this.Re / this.Magnitude());
        else
            return -Math.acos(this.Re / this.Magnitude());
    };
    return Complex;
}());
// 01_Code/XImage.ts
var XImage = /** @class */ (function () {
    function XImage(src, onLoad) {
        var thisObj = this;
        this.OnLoad = onLoad;
        this.Image = new Image(50, 50);
        this.Image.onload = function () {
            thisObj.IsLoaded = true;
            thisObj.OnLoad();
        };
        this.Image.src = src;
    }
    return XImage;
}());
// 01_Code/Context2d.ts
var Context2d = /** @class */ (function () {
    function Context2d(Canvas) {
        this.Context = Canvas.getContext("2d");
        this.Size = new Vector2(Canvas.width, Canvas.height);
    }
    Context2d.prototype.DrawImageNatural = function (image, pos) {
        this.Context.drawImage(image.Image, 0, 0, image.Image.naturalWidth, image.Image.naturalHeight, pos.X, pos.Y, image.Image.naturalWidth, image.Image.naturalHeight);
        //		this.Context.drawImage(image.Image, 0, 0, image.Image.naturalWidth, image.Image.naturalWidth, pos.X, pos.Y, image.Image.naturalWidth, image.Image.naturalWidth);
    };
    Context2d.prototype.FillTextX = function (text, pos, font, color, halign, valign) {
        this.Context.font = font == null ? "30px serif" : font;
        this.Context.fillStyle = color == null ? "black" : color;
        this.Context.textAlign = halign == null ? "center" : halign;
        this.Context.textBaseline = valign == null ? "middle" : valign;
        this.Context.fillText(text, pos.X, pos.Y);
    };
    Context2d.prototype.ArrowX = function (start, end, length, width, color, lineWidth) {
        var delta = end.Minus(start);
        var tang = delta.Norm();
        var ort = tang.RotateLeft();
        var point1 = end.Plus(tang.Mult(-length)).Plus(ort.Mult(width));
        var point2 = end.Plus(tang.Mult(-length)).Plus(ort.Mult(-width));
        this.Context.strokeStyle = color == null ? "black" : color;
        this.Context.lineWidth = lineWidth;
        this.Line(start, end);
        this.Line(point1, end);
        this.Line(point2, end);
    };
    Context2d.prototype.FillRectX = function (conner, size, color) {
        this.Context.fillStyle = color;
        this.Context.fillRect(conner.X, conner.Y, size.X, size.Y);
    };
    Context2d.prototype.StrokeRectX = function (conner, size, color, lineWidth) {
        this.Context.strokeStyle = color;
        this.Context.lineWidth = lineWidth;
        this.Context.strokeRect(conner.X, conner.Y, size.X, size.Y);
    };
    Context2d.prototype.StartFrame = function () {
        //		this.Context.setTransform(1, 0, 0, 1, 0, 0);
        this.Context.clearRect(0, 0, this.Context.canvas.width, this.Context.canvas.height);
    };
    Context2d.prototype.EndFrame = function () {
        //		this.Stroke();
        //		this.Context.beginPath();
    };
    Context2d.prototype.Translate = function (Pos) {
        this.Context.translate(Pos.X, Pos.Y);
    };
    Context2d.prototype.Save = function () {
        this.Context.save();
    };
    Context2d.prototype.Restore = function () {
        this.Context.restore();
    };
    Context2d.prototype.CircleX = function (pos, radius, lineColor, lineWidth, fillColor) {
        this.Context.beginPath();
        this.Context.arc(pos.X, pos.Y, radius, 0, 360);
        if (lineColor != null) {
            this.Context.strokeStyle = lineColor;
            this.Context.lineWidth = lineWidth;
            this.Context.stroke();
        }
        if (fillColor != null) {
            this.Context.fillStyle = fillColor;
            this.Context.fill();
        }
    };
    Context2d.prototype.ArcX = function (pos, radius, angle1, angle2, lineColor, lineWidth, fillColor) {
        this.Context.beginPath();
        if (angle1 < angle2)
            this.Context.arc(pos.X, pos.Y, radius, angle1, angle2);
        else
            this.Context.arc(pos.X, pos.Y, radius, angle2, angle1);
        if (lineColor != null) {
            this.Context.strokeStyle = lineColor;
            this.Context.lineWidth = lineWidth;
            this.Context.stroke();
        }
        if (fillColor != null) {
            this.Context.fillStyle = fillColor;
            this.Context.fill();
        }
    };
    Context2d.prototype.Line = function (start, end) {
        this.Context.beginPath();
        this.MoveTo(start);
        this.LineTo(end);
        this.Context.stroke();
    };
    Context2d.prototype.MoveTo = function (pos) {
        this.Context.moveTo(pos.X, pos.Y);
    };
    Context2d.prototype.LineTo = function (pos) {
        this.Context.lineTo(pos.X, pos.Y);
    };
    return Context2d;
}());
// 01_Code/Canvas.ts
var Canvas = /** @class */ (function () {
    function Canvas(canvasId) {
        this.Canvas = document.getElementById(canvasId);
        this.Context2d = new Context2d(this.Canvas);
        var thisClosure = this;
        this.Canvas.addEventListener("mousedown", function (e) { thisClosure.OnMouseDown(e); }, false);
        this.Canvas.addEventListener("mousemove", function (e) { thisClosure.OnMouseMove(e); }, false);
        this.Canvas.addEventListener("mouseup", function (e) { thisClosure.OnMouseUp(e); }, false);
    }
    Canvas.prototype.GetMousePos = function (event) {
        var rect = this.Canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        return new Vector2(x, y);
    };
    Canvas.prototype.OnMouseDown = function (event) {
        this.OnMouseDownVirt(event, this.GetMousePos(event));
    };
    Canvas.prototype.OnMouseMove = function (event) {
        this.OnMouseMoveVirt(event, this.GetMousePos(event));
    };
    Canvas.prototype.OnMouseUp = function (event) {
        this.OnMouseUpVirt(event, this.GetMousePos(event));
    };
    return Canvas;
}());
// 01_Code/DragResult.ts
var DragResult;
(function (DragResult) {
    DragResult[DragResult["NoDrag"] = 0] = "NoDrag";
    DragResult[DragResult["Drag"] = 1] = "Drag";
})(DragResult || (DragResult = {}));
// 01_Code/MathObject.ts
var MathObject = /** @class */ (function () {
    function MathObject(pos, size, centerShift) {
        this.Pos = pos;
        this.Size = size;
        this.BottomConnerPos = pos.Plus(size);
        this.CenterShift = centerShift;
        this.CenterPos = pos.Plus(centerShift);
        this.InnerTopLeftConner = centerShift.Mult(-1);
        this.InnerBottomRightConner = size.Minus(centerShift);
    }
    MathObject.prototype.IsInto = function (pos) {
        var r = pos.X >= this.Pos.X && pos.X <= this.BottomConnerPos.X &&
            pos.Y >= this.Pos.Y && pos.Y <= this.BottomConnerPos.Y;
        return r;
    };
    MathObject.prototype.Paint = function () {
        this.Context2d.Save();
        this.Context2d.FillRectX(this.Pos, this.Size, this.MathSceneCanvas.ColorScheme.BackgroundColor);
        this.Context2d.Translate(this.CenterPos);
        this.PaintVirt();
        this.Context2d.Restore();
    };
    return MathObject;
}());
// 01_Code/TextMathObject.ts
var TextMathObject = /** @class */ (function (_super) {
    __extends(TextMathObject, _super);
    function TextMathObject(getText, pos, size) {
        var _this = _super.call(this, pos.Minus(size.Div(2)), size, size.Div(2)) || this;
        _this.GetText = getText;
        return _this;
    }
    TextMathObject.prototype.SetParent = function (mathSceneCanvas) {
        this.Context2d = mathSceneCanvas.Context2d;
        this.MathSceneCanvas = mathSceneCanvas;
    };
    TextMathObject.prototype.PaintVirt = function () {
        this.Context2d.FillTextX(this.GetText(), new Vector2(0, 0), "20px serif", this.MathSceneCanvas.ColorScheme.AxisColor, null, null);
    };
    TextMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        return DragResult.NoDrag;
    };
    TextMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    return TextMathObject;
}(MathObject));
// 01_Code/ComplexMathObject.ts
var ComplexMathObject = /** @class */ (function (_super) {
    __extends(ComplexMathObject, _super);
    function ComplexMathObject(maxRe, pos, size) {
        var _this = _super.call(this, pos, size, size.Div(2)) || this;
        _this.MaxRe = maxRe;
        _this.ReToX = size.X / (2 * _this.MaxRe);
        _this.ImToY = -_this.ReToX;
        return _this;
    }
    ComplexMathObject.prototype.SetParent = function (mathSceneCanvas) {
        this.Context2d = mathSceneCanvas.Context2d;
        this.MathSceneCanvas = mathSceneCanvas;
    };
    ComplexMathObject.prototype.DrawArrowX = function (start, end, color, lineWidth) {
        this.Context2d.ArrowX(new Vector2(start.Re * this.ReToX, start.Im * this.ImToY), new Vector2(end.Re * this.ReToX, end.Im * this.ImToY), 10, 2, color, lineWidth);
    };
    ComplexMathObject.prototype.PaintPlain = function () {
        if (this.Image != null && this.Image.IsLoaded)
            this.Context2d.DrawImageNatural(this.Image, this.InnerTopLeftConner.Plus(new Vector2(10, 10)));
        if (this.Text != null) {
            this.Context2d.FillTextX(this.Text, this.InnerTopLeftConner.Plus(new Vector2(10, 10)), "20px serif", this.MathSceneCanvas.ColorScheme.FontColor, "left", "top");
        }
        this.Context2d.ArrowX(new Vector2(this.InnerTopLeftConner.X, 0), new Vector2(this.InnerBottomRightConner.X, 0), 10, 5, this.MathSceneCanvas.ColorScheme.AxisColor, 1);
        this.Context2d.ArrowX(new Vector2(0, this.InnerBottomRightConner.Y), new Vector2(0, this.InnerTopLeftConner.Y), 10, 5, this.MathSceneCanvas.ColorScheme.AxisColor, 1);
        this.Context2d.CircleX(new Vector2(0, 0), this.ReToX, this.MathSceneCanvas.ColorScheme.AxisColor, 1, null);
    };
    ComplexMathObject.prototype.SetText = function (text) {
        this.Text = text;
        this.MathSceneCanvas.Repaint();
    };
    ComplexMathObject.prototype.SetImage = function (src) {
        var thisObj = this;
        this.Image = new XImage(src, function () {
            thisObj.MathSceneCanvas.Repaint();
        });
    };
    return ComplexMathObject;
}(MathObject));
// 01_Code/SingleMathObject.ts
var SingleMathObjectType;
(function (SingleMathObjectType) {
    SingleMathObjectType[SingleMathObjectType["Simple"] = 0] = "Simple";
    SingleMathObjectType[SingleMathObjectType["Real"] = 1] = "Real";
    SingleMathObjectType[SingleMathObjectType["One"] = 2] = "One";
})(SingleMathObjectType || (SingleMathObjectType = {}));
var SingleMathObject = /** @class */ (function (_super) {
    __extends(SingleMathObject, _super);
    function SingleMathObject(complex, color, singleMathObjectType, maxRe, pos, size) {
        var _this = _super.call(this, maxRe, pos, size) || this;
        _this.Complex = complex;
        _this.Color = color;
        _this.SingleMathObjectType = singleMathObjectType;
        _this.DrawArc = false;
        return _this;
    }
    SingleMathObject.prototype.GetValue = function () {
        return this.Complex;
    };
    SingleMathObject.prototype.PaintVirt = function () {
        this.PaintPlain();
        this.DrawArrowX(new Complex(0, 0), this.Complex, this.Color, 2);
        if (this.DrawArc) {
            var argument = this.Complex.Argument();
            this.Context2d.ArcX(new Vector2(0, 0), 20, 0, -argument, this.Color, 1, null);
        }
    };
    SingleMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        this.SetValue(pos);
        return DragResult.Drag;
    };
    SingleMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
        this.SetValue(pos);
    };
    SingleMathObject.prototype.GetColor = function () {
        return this.Color;
    };
    SingleMathObject.prototype.SetValue = function (pos) {
        this.Complex.Re = pos.X / this.ReToX;
        this.Complex.Im = pos.Y / this.ImToY;
        if (this.SingleMathObjectType == SingleMathObjectType.Real)
            this.Complex.Im = 0;
        if (this.SingleMathObjectType == SingleMathObjectType.One) {
            this.Complex = this.Complex.Norm();
        }
    };
    return SingleMathObject;
}(ComplexMathObject));
// 01_Code/SumMathObject.ts
var SumMathObjectType;
(function (SumMathObjectType) {
    SumMathObjectType[SumMathObjectType["Front"] = 0] = "Front";
    SumMathObjectType[SumMathObjectType["Back"] = 1] = "Back";
    SumMathObjectType[SumMathObjectType["FrontAndBack"] = 2] = "FrontAndBack";
})(SumMathObjectType || (SumMathObjectType = {}));
var SumMathObject = /** @class */ (function (_super) {
    __extends(SumMathObject, _super);
    function SumMathObject(arg1, arg2, color, sumMathObjectType, upShift, maxRe, pos, size) {
        var _this = _super.call(this, maxRe, pos, size) || this;
        _this.Arg1 = arg1;
        _this.Arg2 = arg2;
        _this.SumMathObjectType = sumMathObjectType;
        _this.UpShift = upShift;
        _this.Color = color;
        return _this;
    }
    SumMathObject.prototype.GetValue = function () {
        return this.Sum;
    };
    SumMathObject.prototype.PaintVirt = function () {
        this.PaintPlain();
        var complex1 = this.Arg1.GetValue();
        var complex2 = this.Arg2.GetValue();
        this.Sum = complex1.Plus(complex2);
        if (this.SumMathObjectType == SumMathObjectType.Front || this.SumMathObjectType == SumMathObjectType.FrontAndBack) {
            this.DrawArrowX(new Complex(0, 0), complex1, this.Arg1.GetColor(), 2);
            this.DrawArrowX(complex1, this.Sum, this.Arg2.GetColor(), 2);
        }
        if (this.SumMathObjectType == SumMathObjectType.Back || this.SumMathObjectType == SumMathObjectType.FrontAndBack) {
            this.DrawArrowX(new Complex(0, 0), complex2, this.Arg2.GetColor(), 2);
            this.DrawArrowX(complex2, this.Sum, this.Arg1.GetColor(), 2);
        }
        if (this.UpShift)
            this.DrawArrowX(new Complex(0, 0.05), this.Sum.Plus(new Complex(0, 0.05)), this.Color, 2);
        else
            this.DrawArrowX(new Complex(0, 0), this.Sum, this.Color, 2);
    };
    SumMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        return DragResult.NoDrag;
    };
    SumMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    SumMathObject.prototype.GetColor = function () {
        return this.Color;
    };
    return SumMathObject;
}(ComplexMathObject));
// 01_Code/ConjugateMathObject.ts
var ConjugateMathObject = /** @class */ (function (_super) {
    __extends(ConjugateMathObject, _super);
    function ConjugateMathObject(arg, color, maxRe, pos, size) {
        var _this = _super.call(this, maxRe, pos, size) || this;
        _this.Arg = arg;
        _this.Color = color;
        return _this;
    }
    ConjugateMathObject.prototype.PaintVirt = function () {
        this.PaintPlain();
        var complex = this.Arg.GetValue();
        this.Conjugate = complex.Conjugate();
        this.DrawArrowX(new Complex(0, 0), this.Conjugate, this.Color, 2);
    };
    ConjugateMathObject.prototype.GetValue = function () {
        return this.Conjugate;
    };
    ConjugateMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        return DragResult.NoDrag;
    };
    ConjugateMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    ConjugateMathObject.prototype.GetColor = function () {
        return this.Color;
    };
    return ConjugateMathObject;
}(ComplexMathObject));
// 01_Code/MultMathObject.ts
var MultMathObject = /** @class */ (function (_super) {
    __extends(MultMathObject, _super);
    function MultMathObject(arg1, arg2, color, maxRe, pos, size) {
        var _this = _super.call(this, maxRe, pos, size) || this;
        _this.Arg1 = arg1;
        _this.Arg2 = arg2;
        _this.Color = color;
        return _this;
    }
    MultMathObject.prototype.GetValue = function () {
        return this.Mult;
    };
    MultMathObject.prototype.PaintVirt = function () {
        this.PaintPlain();
        var complex1 = this.Arg1.GetValue();
        var complex2 = this.Arg2.GetValue();
        this.Mult = complex1.Mult(complex2);
        this.DrawArrowX(new Complex(0, 0), this.Mult, this.Color, 2);
        if (this.DrawArc) {
            var argument1 = complex1.Argument();
            var argument2 = complex2.Argument();
            var argument3 = argument1 + argument2;
            this.Context2d.ArcX(new Vector2(0, 0), 20, 0, -argument1, this.Arg1.GetColor(), 1, null);
            this.Context2d.ArcX(new Vector2(0, 0), 22, -argument1, -argument1 - argument2, this.Arg2.GetColor(), 1, null);
        }
    };
    MultMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        return DragResult.NoDrag;
    };
    MultMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    MultMathObject.prototype.GetColor = function () {
        return this.Color;
    };
    return MultMathObject;
}(ComplexMathObject));
// 01_Code/DivMathObject.ts
var DivMathObject = /** @class */ (function (_super) {
    __extends(DivMathObject, _super);
    function DivMathObject(arg1, arg2, color, maxRe, pos, size) {
        var _this = _super.call(this, maxRe, pos, size) || this;
        _this.Arg1 = arg1;
        _this.Arg2 = arg2;
        _this.Color = color;
        return _this;
    }
    DivMathObject.prototype.GetValue = function () {
        return this.Div;
    };
    DivMathObject.prototype.PaintVirt = function () {
        this.PaintPlain();
        var complex1 = this.Arg1.Complex;
        var complex2 = this.Arg2.Complex;
        this.Div = complex1.Div(complex2);
        this.DrawArrowX(new Complex(0, 0), this.Div, this.Color, 2);
        if (this.DrawArc) {
            var argument1 = complex1.Argument();
            var argument2 = -complex2.Argument();
            var argument3 = argument1 + argument2;
            this.Context2d.ArcX(new Vector2(0, 0), 20, 0, -argument1, this.Arg1.Color, 1, null);
            this.Context2d.ArcX(new Vector2(0, 0), 22, -argument1, -argument1 - argument2, this.Arg2.Color, 1, null);
        }
    };
    DivMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        return DragResult.NoDrag;
    };
    DivMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    DivMathObject.prototype.GetColor = function () {
        return this.Color;
    };
    return DivMathObject;
}(ComplexMathObject));
// 01_Code/MathSceneCanvas.ts
var ColorScheme = /** @class */ (function () {
    function ColorScheme() {
        var body = document.body;
        this.BackgroundColor = body.getAttribute("data-backgroundColor");
        this.FontColor = body.getAttribute("data-fontColor");
        this.AxisColor = body.getAttribute("data-axisColor");
        this.Arrow1Color = body.getAttribute("data-arrow1Color");
        this.Arrow2Color = body.getAttribute("data-arrow2Color");
        this.Arrow3Color = body.getAttribute("data-arrow3Color");
    }
    return ColorScheme;
}());
var MathSceneCanvas = /** @class */ (function (_super) {
    __extends(MathSceneCanvas, _super);
    function MathSceneCanvas(canvasId, colorScheme) {
        var _this = _super.call(this, canvasId) || this;
        _this.ColorScheme = colorScheme;
        _this.MathObjectList = new Array();
        return _this;
    }
    MathSceneCanvas.prototype.AddMathObject = function (mathObject) {
        mathObject.SetParent(this);
        this.MathObjectList.push(mathObject);
        return mathObject;
    };
    MathSceneCanvas.prototype.OnMouseDownVirt = function (event, pos) {
        var needRepaint = false;
        for (var _i = 0, _a = this.MathObjectList; _i < _a.length; _i++) {
            var m = _a[_i];
            if (m.IsInto(pos)) {
                var dragResult = m.OnMouseDownVirt(event, pos.Minus(m.CenterPos));
                needRepaint = true;
                if (dragResult == DragResult.Drag)
                    this.DragMathObject = m;
            }
        }
        if (needRepaint)
            this.Repaint();
    };
    MathSceneCanvas.prototype.OnMouseMoveVirt = function (event, pos) {
        if (this.DragMathObject != null) {
            this.DragMathObject.OnMouseMoveVirt(event, pos.Minus(this.DragMathObject.CenterPos));
            this.Repaint();
        }
    };
    MathSceneCanvas.prototype.OnMouseUpVirt = function (event, pos) {
        if (this.DragMathObject != null)
            this.DragMathObject = null;
    };
    MathSceneCanvas.prototype.Repaint = function () {
        this.Context2d.StartFrame();
        for (var _i = 0, _a = this.MathObjectList; _i < _a.length; _i++) {
            var m = _a[_i];
            m.Paint();
        }
        this.Context2d.EndFrame();
    };
    return MathSceneCanvas;
}(Canvas));
// 01_Code/Vector2.ts
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.X = x;
        this.Y = y;
    }
    Vector2.prototype.Plus = function (vec) {
        return new Vector2(this.X + vec.X, this.Y + vec.Y);
    };
    Vector2.prototype.Minus = function (vec) {
        return new Vector2(this.X - vec.X, this.Y - vec.Y);
    };
    Vector2.prototype.Mult = function (a) {
        return new Vector2(this.X * a, this.Y * a);
    };
    Vector2.prototype.Div = function (a) {
        return new Vector2(this.X / a, this.Y / a);
    };
    Vector2.prototype.Inverse = function () {
        return new Vector2(-this.X, -this.Y);
    };
    Vector2.prototype.Length = function () {
        return Math.sqrt(this.X * this.X + this.Y * this.Y);
    };
    Vector2.prototype.Norm = function () {
        return this.Div(this.Length());
    };
    Vector2.prototype.RotateLeft = function () {
        return new Vector2(-this.Y, this.X);
    };
    return Vector2;
}());
