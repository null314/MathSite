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
// ../!Code/Complex.ts
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
// ../!Code/XImage.ts
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
// ../!Code/Context2d.ts
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
    Context2d.prototype.Scale = function (Pos) {
        this.Context.scale(Pos.X, Pos.Y);
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
// ../!Code/Canvas.ts
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
// ../!Code/DragResult.ts
var DragResult;
(function (DragResult) {
    DragResult[DragResult["NoDrag"] = 0] = "NoDrag";
    DragResult[DragResult["Drag"] = 1] = "Drag";
})(DragResult || (DragResult = {}));
// ../!Code/MathObject.ts
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
        this.Context2d.FillRectX(this.Pos, this.Size, "white");
        this.Context2d.Translate(this.CenterPos);
        this.PaintVirt();
        this.Context2d.Restore();
    };
    return MathObject;
}());
// ../!Code/TextMathObject.ts
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
        this.Context2d.FillTextX(this.GetText(), new Vector2(0, 0), null, null, null, null);
    };
    TextMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        return DragResult.NoDrag;
    };
    TextMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    return TextMathObject;
}(MathObject));
// ../!Code/MathSceneCanvas.ts
var MathSceneCanvas = /** @class */ (function (_super) {
    __extends(MathSceneCanvas, _super);
    function MathSceneCanvas(canvasId) {
        var _this = _super.call(this, canvasId) || this;
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
        this.Context2d.StartFrame();
        for (var _i = 0, _a = this.MathObjectList; _i < _a.length; _i++) {
            var m = _a[_i];
            m.Paint();
        }
        this.Context2d.EndFrame();
    };
    return MathSceneCanvas;
}(Canvas));
// ../!Code/Vector2.ts
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
// ../!Code/HeaderMathObject.ts
var TdButton = /** @class */ (function () {
    function TdButton(pos, size, color, func) {
        this.Pos = pos;
        this.Size = size;
        this.Pos2 = pos.Plus(size);
        this.Color = color;
        this.Func = func;
    }
    return TdButton;
}());
var HeaderMathObject = /** @class */ (function (_super) {
    __extends(HeaderMathObject, _super);
    function HeaderMathObject(headerHeight, leftX, rightX, bottomY, pos, size) {
        var _this = _super.call(this, pos, size, new Vector2(0, 0)) || this;
        _this.HeaderHeight = headerHeight;
        _this.LeftX = leftX;
        _this.RightX = rightX;
        _this.BottomY = bottomY;
        _this.HeaderShift = new Vector2(0, _this.HeaderHeight);
        _this.GlobalToInner = (_this.RightX - _this.LeftX) / _this.Size.X;
        _this.InnerToGobal = 1 / _this.GlobalToInner;
        _this.TopY = _this.BottomY + _this.Size.Minus(_this.HeaderShift).Y * _this.GlobalToInner;
        _this.ButtonList = new Array();
        return _this;
    }
    HeaderMathObject.prototype.SetParent = function (mathSceneCanvas) {
        this.Context2d = mathSceneCanvas.Context2d;
        this.MathSceneCanvas = mathSceneCanvas;
    };
    HeaderMathObject.prototype.AddButton = function (pos, size, color, func) {
        this.ButtonList.push(new TdButton(pos, size, color, func));
    };
    HeaderMathObject.prototype.PaintVirt = function () {
        this.Context2d.StrokeRectX(new Vector2(0, 0), this.Size, "black", 1);
        this.Context2d.StrokeRectX(new Vector2(0, this.HeaderHeight), this.Size.Minus(this.HeaderShift), "black", 1);
        for (var _i = 0, _a = this.ButtonList; _i < _a.length; _i++) {
            var b = _a[_i];
            this.Context2d.StrokeRectX(b.Pos, b.Size, b.Color, 1);
        }
        this.Context2d.Translate(this.HeaderShift.Plus(new Vector2(-this.LeftX * this.InnerToGobal, this.TopY * this.InnerToGobal)));
        this.Context2d.Scale(new Vector2(this.InnerToGobal, -this.InnerToGobal));
        this.FinalPaintVirt();
        this.Context2d.Restore();
    };
    HeaderMathObject.prototype.StartTimer = function (interval) {
        var thisValue = this;
        var myfunc = setInterval(function () {
            thisValue.OnUpdate(interval);
            thisValue.MathSceneCanvas.Repaint();
        }, interval * 1000);
    };
    HeaderMathObject.prototype.DrawAxis = function () {
        this.Context2d.ArrowX(new Vector2(this.LeftX, 0), new Vector2(this.RightX, 0), 10, 3, "gray", 1);
        this.Context2d.ArrowX(new Vector2(0, this.BottomY), new Vector2(0, this.TopY), 10, 3, "gray", 1);
    };
    HeaderMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        var p = pos.Plus(this.CenterShift);
        for (var _i = 0, _a = this.ButtonList; _i < _a.length; _i++) {
            var b = _a[_i];
            if (p.X >= b.Pos.X && p.X <= b.Pos2.X &&
                p.Y >= b.Pos.Y && p.Y <= b.Pos2.Y) {
                b.Func();
                return DragResult.NoDrag;
            }
        }
        return DragResult.NoDrag;
    };
    HeaderMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    HeaderMathObject.prototype.IsInside = function (pos, radius) {
        var result = pos.X + radius < this.RightX &&
            pos.X - radius > this.LeftX &&
            pos.Y + radius < this.TopY &&
            pos.Y - radius > this.BottomY;
        return result;
    };
    return HeaderMathObject;
}(MathObject));
// ../!Code/Phys1MathObject.ts
var Phys1MathObject = /** @class */ (function (_super) {
    __extends(Phys1MathObject, _super);
    function Phys1MathObject(pos, size) {
        var _this = _super.call(this, 20, -10, 100, -10, pos, size) || this;
        _this.Reset();
        var thisVar = _this;
        _this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function () { thisVar.Reset(); });
        _this.StartTimer(0.1);
        return _this;
    }
    Phys1MathObject.prototype.Reset = function () {
        this.Position = new Vector2(10, 10);
        this.DPosition = new Vector2(20, 20);
    };
    Phys1MathObject.prototype.OnUpdate = function (interval) {
        this.Position = this.Position.Plus(this.DPosition.Mult(interval));
    };
    Phys1MathObject.prototype.FinalPaintVirt = function () {
        this.DrawAxis();
        if (this.IsInside(this.Position, 10)) {
            this.Context2d.CircleX(this.Position, 10, "black", 1, null);
            this.Context2d.ArrowX(this.Position, this.Position.Plus(this.DPosition), 5, 2, "#0000AA", 1);
        }
    };
    return Phys1MathObject;
}(HeaderMathObject));
// ../!Code/Phys2MathObject.ts
var Phys2MathObject = /** @class */ (function (_super) {
    __extends(Phys2MathObject, _super);
    function Phys2MathObject(pos, size) {
        var _this = _super.call(this, 20, -10, 100, -10, pos, size) || this;
        _this.Reset();
        var thisVar = _this;
        _this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function () { thisVar.Reset(); });
        _this.StartTimer(0.1);
        return _this;
    }
    Phys2MathObject.prototype.Reset = function () {
        this.Position = new Vector2(10, 10);
        this.DPosition = new Vector2(20, 40);
        this.DDPosition = new Vector2(0, -30);
    };
    Phys2MathObject.prototype.OnUpdate = function (interval) {
        this.Position = this.Position.Plus(this.DPosition.Mult(interval));
        this.DPosition = this.DPosition.Plus(this.DDPosition.Mult(interval));
    };
    Phys2MathObject.prototype.FinalPaintVirt = function () {
        this.DrawAxis();
        if (this.IsInside(this.Position, 10)) {
            this.Context2d.CircleX(this.Position, 10, "black", 1, null);
            this.Context2d.ArrowX(this.Position, this.Position.Plus(this.DPosition), 5, 2, "#0000AA", 1);
        }
    };
    return Phys2MathObject;
}(HeaderMathObject));
// ../!Code/Phys3MathObject.ts
var Phys3MathObject = /** @class */ (function (_super) {
    __extends(Phys3MathObject, _super);
    function Phys3MathObject(pos, size) {
        var _this = _super.call(this, 20, -10, 290, -10, pos, size) || this;
        _this.Reset();
        var thisVar = _this;
        _this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function () { thisVar.Reset(); });
        _this.StartTimer(0.01);
        return _this;
    }
    Phys3MathObject.prototype.Reset = function () {
        this.Position = new Vector2(10, 10);
        this.DPosition = new Vector2(20, 40);
    };
    Phys3MathObject.prototype.OnUpdate = function (interval) {
        var force = 300;
        var mass = 1;
        var ddPosition = new Vector2(0, -30);
        if (this.Position.Y - 10 < 0) {
            ddPosition = ddPosition.Plus(new Vector2(0, force / mass));
        }
        this.DPosition = this.DPosition.Plus(ddPosition.Mult(interval));
        this.Position = this.Position.Plus(this.DPosition.Mult(interval));
    };
    Phys3MathObject.prototype.FinalPaintVirt = function () {
        this.DrawAxis();
        if (this.IsInside(this.Position, 10)) {
            this.Context2d.CircleX(this.Position, 10, "black", 1, null);
            this.Context2d.ArrowX(this.Position, this.Position.Plus(this.DPosition), 5, 2, "#0000AA", 1);
        }
    };
    return Phys3MathObject;
}(HeaderMathObject));
// ../!Code/Phys4MathObject.ts
var Ball = /** @class */ (function () {
    function Ball(mass, radius, color, position, dPosition) {
        this.Mass = mass;
        this.Radius = radius;
        this.Color = color;
        this.Position = position;
        this.DPosition = dPosition;
    }
    Ball.prototype.ClearForce = function () {
        this.Force = new Vector2(0, 0);
    };
    Ball.prototype.AddForce = function (force) {
        this.Force = this.Force.Plus(force);
    };
    Ball.prototype.OnUpdate = function (interval) {
        this.DPosition = this.DPosition.Plus(this.Force.Mult(interval).Div(this.Mass));
        this.Position = this.Position.Plus(this.DPosition.Mult(interval));
    };
    return Ball;
}());
var Phys4MathObject = /** @class */ (function (_super) {
    __extends(Phys4MathObject, _super);
    function Phys4MathObject(pos, size) {
        var _this = _super.call(this, 20, -10, 210, -10, pos, size) || this;
        _this.Reset();
        var thisVar = _this;
        _this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function () { thisVar.Reset(); });
        _this.AddButton(new Vector2(25, 5), new Vector2(10, 10), "black", function () { thisVar.Randomize(); });
        _this.RightBorder = 200;
        _this.StartTimer(0.01);
        return _this;
    }
    Phys4MathObject.prototype.Reset = function () {
        this.BallList = new Array();
        this.BallList.push(new Ball(3, 9, "#f1aeb2", new Vector2(50, 110), new Vector2(0, 0)));
        this.BallList.push(new Ball(1, 12, "#d07c7F", new Vector2(55, 40), new Vector2(0, 0)));
        this.BallList.push(new Ball(1, 15, "#e8b44f", new Vector2(45, 80), new Vector2(0, 0)));
        this.BallList.push(new Ball(1, 10, "#8b9c1d", new Vector2(55, 10), new Vector2(0, 0)));
        this.BallList.push(new Ball(1, 8, "#687a4e", new Vector2(80, 10), new Vector2(0, 0)));
        this.BallList.push(new Ball(1, 10, "#cbc7ae", new Vector2(85, 40), new Vector2(0, 0)));
        this.BallList.push(new Ball(1, 11, "#683c32", new Vector2(85, 80), new Vector2(0, 0)));
    };
    Phys4MathObject.prototype.Randomize = function () {
        for (var _i = 0, _a = this.BallList; _i < _a.length; _i++) {
            var ball = _a[_i];
            ball.DPosition = new Vector2((Math.random() - 0.5), Math.random() - 0.5).Mult(100);
        }
    };
    Phys4MathObject.prototype.OnUpdate = function (interval) {
        var gravity = new Vector2(0, -30);
        var force = 2000;
        for (var _i = 0, _a = this.BallList; _i < _a.length; _i++) {
            var ball = _a[_i];
            ball.ClearForce();
            ball.AddForce(gravity.Mult(ball.Mass));
            if (ball.Position.Y - ball.Radius < 0) {
                ball.AddForce(new Vector2(0, force));
            }
            if (ball.Position.X - ball.Radius < 0) {
                ball.AddForce(new Vector2(force, 0));
            }
            if (ball.Position.X + ball.Radius > this.RightBorder) {
                ball.AddForce(new Vector2(-force, 0));
            }
        }
        for (var i = 0; i < this.BallList.length; i++)
            for (var o = i + 1; o < this.BallList.length; o++) {
                var collideForce = this.GetCollideForce(this.BallList[i], this.BallList[o]);
                this.BallList[i].AddForce(collideForce.Mult(-1));
                this.BallList[o].AddForce(collideForce);
            }
        for (var _b = 0, _c = this.BallList; _b < _c.length; _b++) {
            var ball = _c[_b];
            ball.OnUpdate(interval);
        }
    };
    Phys4MathObject.prototype.GetCollideForce = function (ball1, ball2) {
        var force = 600;
        var delta = ball2.Position.Minus(ball1.Position);
        var dist = delta.Length();
        if (dist < ball1.Radius + ball2.Radius) {
            return delta.Div(dist).Mult(force);
        }
        return new Vector2(0, 0);
    };
    Phys4MathObject.prototype.FinalPaintVirt = function () {
        this.DrawAxis();
        for (var _i = 0, _a = this.BallList; _i < _a.length; _i++) {
            var ball = _a[_i];
            this.Context2d.CircleX(ball.Position, ball.Radius, ball.Color, 1, ball.Color);
            //			this.Context2d.ArrowX(ball.Position, ball.Position.Plus(ball.DPosition), 5, 2, "#0000AA", 1);
        }
        this.Context2d.ArrowX(new Vector2(this.RightBorder, 0), new Vector2(this.RightBorder, this.TopY), 5, 2, "grey", 1);
    };
    return Phys4MathObject;
}(HeaderMathObject));
