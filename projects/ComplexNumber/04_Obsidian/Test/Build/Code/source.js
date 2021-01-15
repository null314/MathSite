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
// !Code/Complex.ts
var Complex = /** @class */ (function () {
    function Complex(re, im) {
        this.Re = re;
        this.Im = im;
    }
    Complex.prototype.Plus = function (c) {
        return new Complex(this.Re + c.Re, this.Im + c.Im);
    };
    Complex.prototype.Mult = function (c) {
        return new Complex(this.Re * c.Re - this.Im * c.Im, this.Re * c.Im + this.Im * c.Re);
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
    return Complex;
}());
// !Code/Context2d.ts
var Context2d = /** @class */ (function () {
    function Context2d(Canvas) {
        this.Context = Canvas.getContext("2d");
        this.Size = new Vector2(Canvas.width, Canvas.height);
        this.Center = this.Size.Div(2);
    }
    Context2d.prototype.BeginPath = function () {
        this.Context.beginPath();
    };
    Context2d.prototype.Circle = function (pos, radius) {
        this.Arc(pos, radius, 0, 360);
    };
    Context2d.prototype.Arc = function (pos, radius, angle1, angle2) {
        this.BeginPath();
        this.Context.arc(pos.X, pos.Y, radius, angle1, angle2);
        this.Stroke();
    };
    Context2d.prototype.Stroke = function () {
        this.Context.stroke();
    };
    Context2d.prototype.Fill = function (color) {
        this.Context.fillStyle = color;
        this.Context.fill();
    };
    Context2d.prototype.FillText = function (text, pos) {
        this.Context.font = "30px serif";
        this.Context.fillStyle = "#000000";
        this.Context.textAlign = "center";
        this.Context.textBaseline = "middle";
        this.Context.fillText(text, pos.X, pos.Y);
    };
    Context2d.prototype.StrokeRect = function (conner, size) {
        this.Context.strokeRect(conner.X, conner.Y, size.X, size.Y);
    };
    Context2d.prototype.Line = function (start, end) {
        this.BeginPath();
        this.MoveTo(start);
        this.LineTo(end);
        this.Stroke();
    };
    Context2d.prototype.Arrow = function (start, end, length, width) {
        var delta = end.Minus(start);
        var tang = delta.Norm();
        var ort = tang.RotateLeft();
        var point1 = end.Plus(tang.Mult(-length)).Plus(ort.Mult(width));
        var point2 = end.Plus(tang.Mult(-length)).Plus(ort.Mult(-width));
        this.Line(start, end);
        this.Line(point1, end);
        this.Line(point2, end);
    };
    Context2d.prototype.MoveTo = function (pos) {
        this.Context.moveTo(pos.X, pos.Y);
    };
    Context2d.prototype.LineTo = function (pos) {
        this.Context.lineTo(pos.X, pos.Y);
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
    return Context2d;
}());
// !Code/Canvas.ts
var Canvas = /** @class */ (function () {
    function Canvas(canvasId) {
        this.Canvas = document.getElementById(canvasId);
        this.Context = new Context2d(this.Canvas);
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
// !Code/DragResult.ts
var DragResult;
(function (DragResult) {
    DragResult[DragResult["NoDrag"] = 0] = "NoDrag";
    DragResult[DragResult["Drag"] = 1] = "Drag";
})(DragResult || (DragResult = {}));
// !Code/MathObject.ts
var MathObject = /** @class */ (function () {
    function MathObject(pos, size, centerShift, context) {
        this.Context = context;
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
            pos.Y >= this.Pos.Y && pos.Y <= this.Pos.Y + this.Size.Y;
        return r;
    };
    MathObject.prototype.Paint = function () {
        this.Context.StrokeRect(this.Pos, this.Size);
        this.Context.Translate(this.CenterPos);
        this.PaintVirt();
        this.Context.Translate(this.CenterPos.Inverse());
    };
    return MathObject;
}());
// !Code/ComplexMathObject.ts
var ComplexMathObject = /** @class */ (function (_super) {
    __extends(ComplexMathObject, _super);
    function ComplexMathObject(maxRe, pos, size, context) {
        var _this = _super.call(this, pos, size, size.Div(2), context) || this;
        _this.MaxRe = maxRe;
        _this.ReToX = size.X / (2 * _this.MaxRe);
        _this.ImToY = -_this.ReToX;
        return _this;
    }
    ComplexMathObject.prototype.DrawArrow = function (start, end) {
        this.Context.Arrow(new Vector2(start.Re * this.ReToX, start.Im * this.ImToY), new Vector2(end.Re * this.ReToX, end.Im * this.ImToY), 10, 2);
    };
    ComplexMathObject.prototype.PaintPlain = function () {
        this.Context.Arrow(new Vector2(this.InnerTopLeftConner.X, 0), new Vector2(this.InnerBottomRightConner.X, 0), 10, 5);
        this.Context.Arrow(new Vector2(0, this.InnerBottomRightConner.Y), new Vector2(0, this.InnerTopLeftConner.Y), 10, 5);
        this.Context.Circle(new Vector2(0, 0), this.ReToX);
    };
    return ComplexMathObject;
}(MathObject));
// !Code/SingleMathObject.ts
var SingleMathObject = /** @class */ (function (_super) {
    __extends(SingleMathObject, _super);
    function SingleMathObject(complex, maxRe, pos, size, context) {
        var _this = _super.call(this, maxRe, pos, size, context) || this;
        _this.Complex = complex;
        return _this;
    }
    SingleMathObject.prototype.PaintVirt = function () {
        this.PaintPlain();
        this.DrawArrow(new Complex(0, 0), this.Complex);
    };
    SingleMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        this.Complex.Re = pos.X / this.ReToX;
        this.Complex.Im = pos.Y / this.ImToY;
        return DragResult.Drag;
    };
    SingleMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
        this.Complex.Re = pos.X / this.ReToX;
        this.Complex.Im = pos.Y / this.ImToY;
    };
    return SingleMathObject;
}(ComplexMathObject));
// !Code/SumMathObject.ts
var SumMathObject = /** @class */ (function (_super) {
    __extends(SumMathObject, _super);
    function SumMathObject(arg1, arg2, maxRe, pos, size, context) {
        var _this = _super.call(this, maxRe, pos, size, context) || this;
        _this.Arg1 = arg1;
        _this.Arg2 = arg2;
        return _this;
    }
    SumMathObject.prototype.PaintVirt = function () {
        this.PaintPlain();
        var complex1 = this.Arg1.Complex;
        var complex2 = this.Arg2.Complex;
        this.Sum = complex1.Plus(complex2);
        this.DrawArrow(new Complex(0, 0), complex1);
        this.DrawArrow(new Complex(0, 0), complex2);
        this.DrawArrow(complex1, this.Sum);
        this.DrawArrow(complex2, this.Sum);
        this.DrawArrow(new Complex(0, 0), this.Sum);
    };
    SumMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        return DragResult.NoDrag;
    };
    SumMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    return SumMathObject;
}(ComplexMathObject));
// !Code/ConjugateMathObject.ts
var ConjugateMathObject = /** @class */ (function (_super) {
    __extends(ConjugateMathObject, _super);
    function ConjugateMathObject(arg, maxRe, pos, size, context) {
        var _this = _super.call(this, maxRe, pos, size, context) || this;
        _this.Arg = arg;
        return _this;
    }
    ConjugateMathObject.prototype.PaintVirt = function () {
        this.PaintPlain();
        var complex = this.Arg.Complex;
        this.Conjugate = complex.Conjugate();
        this.DrawArrow(new Complex(0, 0), this.Conjugate);
    };
    ConjugateMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        return DragResult.NoDrag;
    };
    ConjugateMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    return ConjugateMathObject;
}(ComplexMathObject));
// !Code/MultMathObject.ts
var MultMathObject = /** @class */ (function (_super) {
    __extends(MultMathObject, _super);
    function MultMathObject(arg1, arg2, maxRe, pos, size, context) {
        var _this = _super.call(this, maxRe, pos, size, context) || this;
        _this.Arg1 = arg1;
        _this.Arg2 = arg2;
        return _this;
    }
    MultMathObject.prototype.PaintVirt = function () {
        this.PaintPlain();
        var complex1 = this.Arg1.Complex;
        var complex2 = this.Arg2.Complex;
        this.Mult = complex1.Mult(complex2);
        this.DrawArrow(new Complex(0, 0), this.Mult);
    };
    MultMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        return DragResult.NoDrag;
    };
    MultMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    return MultMathObject;
}(ComplexMathObject));
// !Code/DivMathObject.ts
var DivMathObject = /** @class */ (function (_super) {
    __extends(DivMathObject, _super);
    function DivMathObject(arg1, arg2, maxRe, pos, size, context) {
        var _this = _super.call(this, maxRe, pos, size, context) || this;
        _this.Arg1 = arg1;
        _this.Arg2 = arg2;
        return _this;
    }
    DivMathObject.prototype.PaintVirt = function () {
        this.PaintPlain();
        var complex1 = this.Arg1.Complex;
        var complex2 = this.Arg2.Complex;
        this.Div = complex1.Div(complex2);
        this.DrawArrow(new Complex(0, 0), this.Div);
    };
    DivMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        return DragResult.NoDrag;
    };
    DivMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    return DivMathObject;
}(ComplexMathObject));
// !Code/MathSceneCanvas.ts
var MathSceneCanvas = /** @class */ (function (_super) {
    __extends(MathSceneCanvas, _super);
    function MathSceneCanvas(canvasId) {
        var _this = _super.call(this, canvasId) || this;
        _this.MathObjectList = new Array();
        return _this;
    }
    MathSceneCanvas.prototype.AddSingle = function (complex, maxRe, pos, size) {
        var mo = new SingleMathObject(complex, maxRe, pos, size, this.Context);
        this.MathObjectList.push(mo);
        return mo;
    };
    MathSceneCanvas.prototype.AddSum = function (arg1, arg2, maxRe, pos, size) {
        this.MathObjectList.push(new SumMathObject(arg1, arg2, maxRe, pos, size, this.Context));
    };
    MathSceneCanvas.prototype.AddConjugate = function (arg, maxRe, pos, size) {
        this.MathObjectList.push(new ConjugateMathObject(arg, maxRe, pos, size, this.Context));
    };
    MathSceneCanvas.prototype.AddMult = function (arg1, arg2, maxRe, pos, size) {
        this.MathObjectList.push(new MultMathObject(arg1, arg2, maxRe, pos, size, this.Context));
    };
    MathSceneCanvas.prototype.AddDiv = function (arg1, arg2, maxRe, pos, size) {
        this.MathObjectList.push(new DivMathObject(arg1, arg2, maxRe, pos, size, this.Context));
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
        //		console.log("move");		
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
        this.Context.StartFrame();
        for (var _i = 0, _a = this.MathObjectList; _i < _a.length; _i++) {
            var m = _a[_i];
            m.Paint();
        }
        this.Context.EndFrame();
    };
    return MathSceneCanvas;
}(Canvas));
// !Code/Vector2.ts
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
