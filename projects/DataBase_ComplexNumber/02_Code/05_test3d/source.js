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
// ../01_Code/Complex.ts
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
// ../01_Code/XImage.ts
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
// ../01_Code/Context2d.ts
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
// ../01_Code/Context3d.ts
var Context3d = /** @class */ (function () {
    function Context3d(context2d) {
        this.Context2d = context2d;
        this.Scale = 300;
        this.Distance = 8;
        this.Matrix = new Matrix3();
        this.DrawList = new Array();
    }
    Context3d.prototype.GetViewVector3 = function () {
        return this.Matrix.Transp().MultVector3(new Vector3(0, 0, 1));
    };
    Context3d.prototype.DrawCircle = function (pos, radius, color) {
        var posGlobal = this.Matrix.MultVector3(pos);
        var radiusProj = posGlobal.Proj(radius, this.Distance) * this.Scale;
        var z = posGlobal.Z;
        if (radiusProj <= 0)
            return;
        var posProj = posGlobal.ToVector2Proj(this.Distance).Mult(this.Scale);
        this.DrawList.push(new CircleTd(posProj, radiusProj, color, z));
    };
    Context3d.prototype.DrawLine = function (pos1, pos2) {
        var posGlobal1 = this.Matrix.MultVector3(pos1);
        var posGlobal2 = this.Matrix.MultVector3(pos2);
        var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale);
        var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale);
        var z = (posGlobal1.Z + posGlobal2.Z) / 2;
        this.DrawList.push(new LineTd(posProj1, posProj2, z));
    };
    Context3d.prototype.DrawArrow = function (pos1, pos2, length, width) {
        var posGlobal1 = this.Matrix.MultVector3(pos1);
        var posGlobal2 = this.Matrix.MultVector3(pos2);
        var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale);
        var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale);
        var z = (posGlobal1.Z + posGlobal2.Z) / 2;
        this.DrawList.push(new ArrowTd(posProj1, posProj2, length, width, z));
    };
    Context3d.prototype.DrawText = function (t, pos) {
        /*		var posGlobal1 = this.Matrix.MultVector3(pos);
                var posProj = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale);
                var sceneCanvas = this.SceneCanvas;
        
                this.DrawList.push([posGlobal1.Z, () =>
                {
                    sceneCanvas.FillText(t, sceneCanvas.Center.Plus(posProj));
                }]);
            */
    };
    Context3d.prototype.StartFrame = function () {
        this.DrawList = new Array();
    };
    Context3d.prototype.EndFrame = function () {
        var compare = function (a, b) {
            if (a.Z < b.Z)
                return -1;
            if (a.Z > b.Z)
                return 1;
            return 0;
        };
        this.DrawList.sort(compare);
        for (var _i = 0, _a = this.DrawList; _i < _a.length; _i++) {
            var d = _a[_i];
            d.Paint(this.Context2d);
        }
    };
    return Context3d;
}());
// ../01_Code/MathObject.ts
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
// ../01_Code/TdMathObject.ts
var TdMathObject = /** @class */ (function (_super) {
    __extends(TdMathObject, _super);
    function TdMathObject(pos, size, centerShift) {
        var _this = _super.call(this, pos, size, centerShift) || this;
        _this.Alpha = 0;
        _this.Beta = 0;
        _this.ButtonList = new Array();
        return _this;
    }
    TdMathObject.prototype.SetParent = function (mathSceneCanvas) {
        this.Context2d = mathSceneCanvas.Context2d;
        this.MathSceneCanvas = mathSceneCanvas;
        this.Context3d = new Context3d(this.Context2d);
    };
    TdMathObject.prototype.AddButton = function (pos, size, color, func) {
        this.ButtonList.push(new TdButton(pos, size, color, func));
    };
    TdMathObject.prototype.PaintVirt = function () {
        var r1 = Matrix3.RotationMatrixY(this.Alpha / 180);
        var r2 = Matrix3.RotationMatrixX(this.Beta / 180);
        this.Context3d.Matrix = r2.Mult(r1);
        this.Context3d.StartFrame();
        this.Paint3dVirt();
        this.Context3d.EndFrame();
        this.Context2d.Translate(this.CenterShift.Mult(-1));
        for (var _i = 0, _a = this.ButtonList; _i < _a.length; _i++) {
            var b = _a[_i];
            this.Context2d.StrokeRect(b.Pos, b.Size);
        }
        this.Context2d.Translate(this.CenterShift);
    };
    TdMathObject.prototype.OnMouseDownVirt = function (event, pos) {
        var p = pos.Plus(this.CenterShift);
        for (var _i = 0, _a = this.ButtonList; _i < _a.length; _i++) {
            var b = _a[_i];
            if (p.X >= b.Pos.X && p.X <= b.Pos2.X &&
                p.Y >= b.Pos.Y && p.Y <= b.Pos2.Y) {
                b.Func();
                return DragResult.NoDrag;
            }
        }
        this.StartDragPos = pos;
        this.StartDragAlpha = this.Alpha;
        this.StartDragBeta = this.Beta;
        return DragResult.Drag;
    };
    TdMathObject.prototype.OnMouseMoveVirt = function (event, pos) {
        var delta = pos.Minus(this.StartDragPos);
        this.Alpha = this.StartDragAlpha + delta.X;
        this.Beta = this.StartDragBeta + delta.Y;
        this.MathSceneCanvas.Repaint();
    };
    return TdMathObject;
}(MathObject));
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
// ../01_Code/TestAxisTdMathObject.ts
var TestAxisTdMathObject = /** @class */ (function (_super) {
    __extends(TestAxisTdMathObject, _super);
    function TestAxisTdMathObject(pos, size, centerShift) {
        return _super.call(this, pos, size, centerShift) || this;
    }
    TestAxisTdMathObject.prototype.Paint3dVirt = function () {
        this.Context3d.DrawLine(new Vector3(-1, 0, 0), new Vector3(1, 0, 0));
        this.Context3d.DrawLine(new Vector3(0, -1, 0), new Vector3(0, 1, 0));
        this.Context3d.DrawLine(new Vector3(0, 0, -1), new Vector3(0, 0, 1));
        this.Context3d.DrawCircle(new Vector3(1.5, 0, 0), 0.5, "white");
        this.Context3d.DrawCircle(new Vector3(0, 1.5, 0), 0.5, "white");
        this.Context3d.DrawCircle(new Vector3(0, 0, 1.5), 0.5, "white");
        this.Context3d.DrawCircle(new Vector3(-1.5, 0, 0), 0.5, "white");
        this.Context3d.DrawCircle(new Vector3(0, -1.5, 0), 0.5, "white");
        this.Context3d.DrawCircle(new Vector3(0, 0, -1.5), 0.5, "white");
    };
    return TestAxisTdMathObject;
}(TdMathObject));
// ../01_Code/PlaneTdMathObject.ts
var PlaneTdMathObjectState;
(function (PlaneTdMathObjectState) {
    PlaneTdMathObjectState[PlaneTdMathObjectState["Plane"] = 0] = "Plane";
    PlaneTdMathObjectState[PlaneTdMathObjectState["AxisX"] = 1] = "AxisX";
    PlaneTdMathObjectState[PlaneTdMathObjectState["AxisY"] = 2] = "AxisY";
})(PlaneTdMathObjectState || (PlaneTdMathObjectState = {}));
var PlaneTdMathObject = /** @class */ (function (_super) {
    __extends(PlaneTdMathObject, _super);
    function PlaneTdMathObject(startX, endX, startY, endY, step, scale, func, pos, size, centerShift) {
        var _this = _super.call(this, pos, size, centerShift) || this;
        _this.StartX = startX;
        _this.StartY = startY;
        _this.EndX = endX;
        _this.EndY = endY;
        _this.Step = step;
        _this.LenX = _this.EndX - _this.StartX;
        _this.LenY = _this.EndY - _this.StartY;
        _this.CenterX = (_this.StartX + _this.EndX) / 2;
        _this.CenterY = (_this.StartY + _this.EndY) / 2;
        _this.Scale = scale;
        _this.Func = func;
        _this.PlaneTdMathObjectState = PlaneTdMathObjectState.Plane;
        var thisObject = _this;
        _this.AddButton(new Vector2(10, 10), new Vector2(10, 10), "black", function () { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.Plane; });
        _this.AddButton(new Vector2(20, 10), new Vector2(10, 10), "black", function () { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.AxisX; });
        _this.AddButton(new Vector2(30, 10), new Vector2(10, 10), "black", function () { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.AxisY; });
        _this.AddButton(new Vector2(100, 10), new Vector2(10, 10), "black", function () { thisObject.ButtonShiftUp(); });
        _this.AddButton(new Vector2(100, 30), new Vector2(10, 10), "black", function () { thisObject.ButtonShiftDown(); });
        _this.AddButton(new Vector2(90, 20), new Vector2(10, 10), "black", function () { thisObject.ButtonShiftLeft(); });
        _this.AddButton(new Vector2(110, 20), new Vector2(10, 10), "black", function () { thisObject.ButtonShiftRight(); });
        return _this;
    }
    PlaneTdMathObject.prototype.ButtonShiftUp = function () {
        this.Shift(0, -0.1);
    };
    PlaneTdMathObject.prototype.ButtonShiftDown = function () {
        this.Shift(0, 0.1);
    };
    PlaneTdMathObject.prototype.ButtonShiftLeft = function () {
        this.Shift(-0.1, 0);
    };
    PlaneTdMathObject.prototype.ButtonShiftRight = function () {
        this.Shift(0.1, 0);
    };
    PlaneTdMathObject.prototype.Shift = function (shiftX, shiftY) {
        this.StartX += this.LenX * shiftX;
        this.EndX += this.LenX * shiftX;
        this.StartY += this.LenY * shiftY;
        this.EndY += this.LenY * shiftY;
        this.CenterX = (this.StartX + this.EndX) / 2;
        this.CenterY = (this.StartY + this.EndY) / 2;
    };
    PlaneTdMathObject.prototype.Paint3dVirt = function () {
        this.Context3d.DrawArrow(this.Convert(new Vector3(this.StartX, 0, 0)), this.Convert(new Vector3(this.EndX, 0, 0)), 5, 2);
        this.Context3d.DrawArrow(this.Convert(new Vector3(0, 0, this.StartY)), this.Convert(new Vector3(0, 0, this.EndY)), 5, 2);
        if (this.PlaneTdMathObjectState == PlaneTdMathObjectState.Plane) {
            for (var x = this.StartX; x <= this.EndX; x += this.Step)
                for (var y = this.StartY; y <= this.EndY; y += this.Step) {
                    var value = this.Func(x, y);
                    this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step / 2 * this.Scale, "white");
                }
        }
        if (this.PlaneTdMathObjectState == PlaneTdMathObjectState.AxisX) {
            for (var x = this.StartX; x <= this.EndX; x += this.Step) {
                var y = 0;
                var value = this.Func(x, y);
                this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step / 2 * this.Scale, "white");
            }
        }
        if (this.PlaneTdMathObjectState == PlaneTdMathObjectState.AxisY) {
            for (var y = this.StartY; y <= this.EndY; y += this.Step) {
                var x = 0;
                var value = this.Func(x, y);
                this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step / 2 * this.Scale, "white");
            }
        }
    };
    PlaneTdMathObject.prototype.Convert = function (pos) {
        return new Vector3((pos.X - this.CenterX) * this.Scale, -pos.Y * this.Scale, -(pos.Z - this.CenterY) * this.Scale);
    };
    return PlaneTdMathObject;
}(TdMathObject));
// ../01_Code/ExpTdMathObject.ts
var ExpTdMathObject = /** @class */ (function (_super) {
    __extends(ExpTdMathObject, _super);
    function ExpTdMathObject(startX, endX, startY, endY, step, scale, func, pos, size, centerShift) {
        var _this = _super.call(this, pos, size, centerShift) || this;
        _this.StartX = startX;
        _this.StartY = startY;
        _this.EndX = endX;
        _this.EndY = endY;
        _this.Step = step;
        _this.LenX = _this.EndX - _this.StartX;
        _this.LenY = _this.EndY - _this.StartY;
        _this.CenterX = (_this.StartX + _this.EndX) / 2;
        _this.CenterY = (_this.StartY + _this.EndY) / 2;
        _this.Scale = scale;
        _this.Func = func;
        _this.Center = new Complex(0, 0);
        _this.Angle = 0;
        _this.Recalc();
        var thisObject = _this;
        _this.AddButton(new Vector2(10, 10), new Vector2(10, 10), "black", function () { thisObject.ButtonRotateLeft(); });
        _this.AddButton(new Vector2(20, 10), new Vector2(10, 10), "black", function () { thisObject.ButtonRotateRight(); });
        _this.AddButton(new Vector2(100, 10), new Vector2(10, 10), "black", function () { thisObject.ButtonShift(new Complex(0, 0.5)); });
        _this.AddButton(new Vector2(100, 30), new Vector2(10, 10), "black", function () { thisObject.ButtonShift(new Complex(0, -0.5)); });
        _this.AddButton(new Vector2(90, 20), new Vector2(10, 10), "black", function () { thisObject.ButtonShift(new Complex(-0.5, 0)); });
        _this.AddButton(new Vector2(110, 20), new Vector2(10, 10), "black", function () { thisObject.ButtonShift(new Complex(0.5, 0)); });
        return _this;
    }
    ExpTdMathObject.prototype.ButtonRotateRight = function () {
        this.Angle -= Math.PI / 12;
        if (this.Angle < 0)
            this.Angle = 0;
        this.Recalc();
    };
    ExpTdMathObject.prototype.ButtonRotateLeft = function () {
        this.Angle += Math.PI / 12;
        if (this.Angle > Math.PI / 2)
            this.Angle = Math.PI / 2;
        this.Recalc();
    };
    ExpTdMathObject.prototype.ButtonShift = function (c) {
        this.Center = this.Center.Plus(c);
        this.Recalc();
    };
    ExpTdMathObject.prototype.Recalc = function () {
        var dir = new Complex(Math.cos(this.Angle), Math.sin(this.Angle));
        var k = Math.tan(this.Angle);
        this.OrtC = dir.Mult(new Complex(0, 1));
        var startC1 = this.Calc1(this.StartX, k);
        var endC1 = this.Calc1(this.EndX, k);
        var startC2 = this.Calc2(this.StartY, k);
        var endC2 = this.Calc2(this.EndY, k);
        this.StartC = startC1.Im > startC2.Im ? startC1 : startC2;
        this.EndC = endC1.Im < endC2.Im ? endC1 : endC2;
    };
    ExpTdMathObject.prototype.Calc1 = function (x, k) {
        return new Complex(x, k * (x - this.Center.Re) + this.Center.Im);
    };
    ExpTdMathObject.prototype.Calc2 = function (y, k) {
        return new Complex((y - this.Center.Im) / k + this.Center.Re, y);
    };
    ExpTdMathObject.prototype.Paint3dVirt = function () {
        var delta = this.EndC.Minus(this.StartC);
        var norm = delta.Norm();
        var mag = delta.Magnitude();
        var ort = this.ConvertDir(this.OrtC);
        this.Context3d.DrawArrow(this.Convert(new Complex(this.StartX, 0), 0), this.Convert(new Complex(this.EndX, 0), 0), 5, 2);
        this.Context3d.DrawArrow(this.Convert(new Complex(0, this.StartY), 0), this.Convert(new Complex(0, this.EndY), 0), 5, 2);
        this.Context3d.DrawArrow(this.Convert(this.StartC, 0), this.Convert(this.EndC, 0), 5, 2);
        this.Context3d.DrawArrow(this.Convert(this.Center, 0), this.Convert(this.Center, 0).Plus(new Vector3(0, -1, 0)), 5, 2);
        this.Context3d.DrawArrow(this.Convert(this.Center, 0), this.Convert(this.Center, 0).Plus(ort), 5, 2);
        for (var i = 0; i < mag; i += this.Step) {
            var p = this.StartC.Plus(norm.MultNumber(i));
            var value = this.Func(p);
            var start = this.Convert(p, 0);
            var end = start.Plus(new Vector3(0, -value.Re, 0)).Plus(ort.Mult(value.Im));
            this.Context3d.DrawCircle(end, this.Step / 2, "white");
            this.Context3d.DrawLine(start, end);
        }
    };
    ExpTdMathObject.prototype.Convert = function (pos, h) {
        return new Vector3((pos.Re - this.CenterX) * this.Scale, -h * this.Scale, -(pos.Im - this.CenterY) * this.Scale);
    };
    ExpTdMathObject.prototype.ConvertDir = function (pos) {
        return new Vector3(pos.Re * this.Scale, 0, -pos.Im * this.Scale);
    };
    return ExpTdMathObject;
}(TdMathObject));
// ../01_Code/Td.ts
var Td = /** @class */ (function () {
    function Td(z) {
        this.Z = z;
    }
    return Td;
}());
var LineTd = /** @class */ (function (_super) {
    __extends(LineTd, _super);
    function LineTd(pos1, pos2, z) {
        var _this = _super.call(this, z) || this;
        _this.Pos1 = pos1;
        _this.Pos2 = pos2;
        return _this;
    }
    LineTd.prototype.Paint = function (context2d) {
        context2d.Line(this.Pos1, this.Pos2);
    };
    return LineTd;
}(Td));
var ArrowTd = /** @class */ (function (_super) {
    __extends(ArrowTd, _super);
    function ArrowTd(pos1, pos2, length, width, z) {
        var _this = _super.call(this, z) || this;
        _this.Pos1 = pos1;
        _this.Pos2 = pos2;
        _this.Lenght = length;
        _this.Width = width;
        return _this;
    }
    ArrowTd.prototype.Paint = function (context2d) {
        context2d.Arrow(this.Pos1, this.Pos2, this.Lenght, this.Width);
    };
    return ArrowTd;
}(Td));
var CircleTd = /** @class */ (function (_super) {
    __extends(CircleTd, _super);
    function CircleTd(pos, radius, color, z) {
        var _this = _super.call(this, z) || this;
        _this.Pos = pos;
        _this.Radius = radius;
        _this.Color = color;
        return _this;
    }
    CircleTd.prototype.Paint = function (context2d) {
        context2d.Circle(this.Pos, this.Radius, this.Color);
    };
    return CircleTd;
}(Td));
// ../01_Code/Canvas.ts
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
// ../01_Code/DragResult.ts
var DragResult;
(function (DragResult) {
    DragResult[DragResult["NoDrag"] = 0] = "NoDrag";
    DragResult[DragResult["Drag"] = 1] = "Drag";
})(DragResult || (DragResult = {}));
// ../01_Code/MathSceneCanvas.ts
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
    /*	AddSingle(complex: Complex, color: string, singleMathObjectType: SingleMathObjectType, maxRe: number, pos: Vector2, size: Vector2): SingleMathObject
        {
            var mo = new SingleMathObject(complex, color, singleMathObjectType, maxRe, pos, size, this);
            this.MathObjectList.push(mo);
            return mo;
        }
        
        AddSum(arg1: SingleMathObject, arg2: SingleMathObject, color: string, sumMathObjectType: SumMathObjectType, upShift: boolean, maxRe: number, pos: Vector2, size: Vector2): SumMathObject
        {
            var s = new SumMathObject(arg1, arg2, color, sumMathObjectType, upShift, maxRe, pos, size, this);
            this.MathObjectList.push(s);
            return s;
        }
    
        AddConjugate(arg: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2): ConjugateMathObject
        {
            var s = new ConjugateMathObject(arg, color, maxRe, pos, size, this);
            this.MathObjectList.push(s);
            return s;
        }
    
        AddMult(arg1: SingleMathObject, arg2: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2): MultMathObject
        {
            var s = new MultMathObject(arg1, arg2, color, maxRe, pos, size, this);
            this.MathObjectList.push(s);
            return s;
        }
    
        AddDiv(arg1: SingleMathObject, arg2: SingleMathObject, color: string, maxRe: number, pos: Vector2, size: Vector2): DivMathObject
        {
            var s = new DivMathObject(arg1, arg2, color, maxRe, pos, size, this);
            this.MathObjectList.push(s);
            return s;
        }
    
    
        AddPlane(pos: Vector2, size: Vector2, centerShift: Vector2): TdMathObject
        {
            var s = new TdMathObject(pos, size, centerShift, this);
            this.MathObjectList.push(s);
            return s;
        }*/
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
// ../01_Code/Vector2.ts
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
// ../01_Code/Vector3.ts
var Vector3 = /** @class */ (function () {
    function Vector3(x, y, z) {
        this.X = x;
        this.Y = y;
        this.Z = z;
    }
    Vector3.prototype.Get = function (r) {
        switch (r) {
            case 0: return this.X;
            case 1: return this.Y;
            case 2: return this.Z;
        }
    };
    Vector3.prototype.Set = function (r, v) {
        switch (r) {
            case 0:
                this.X = v;
                break;
            case 1:
                this.Y = v;
                break;
            case 2:
                this.Z = v;
                break;
        }
    };
    Vector3.prototype.Plus = function (vec) {
        return new Vector3(this.X + vec.X, this.Y + vec.Y, this.Z + vec.Z);
    };
    Vector3.prototype.Minus = function (vec) {
        return new Vector3(this.X - vec.X, this.Y - vec.Y, this.Z - vec.Z);
    };
    Vector3.prototype.Mult = function (a) {
        return new Vector3(this.X * a, this.Y * a, this.Z * a);
    };
    Vector3.prototype.Div = function (a) {
        return new Vector3(this.X / a, this.Y / a, this.Z / a);
    };
    Vector3.prototype.ToVector2 = function () {
        return new Vector2(this.X, this.Y);
    };
    Vector3.prototype.ToVector2Proj = function (dist) {
        return new Vector2(this.Proj(this.X, dist), this.Proj(this.Y, dist));
    };
    Vector3.prototype.Proj = function (r, dist) {
        return r / (dist - this.Z);
    };
    Vector3.prototype.Len = function () {
        return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    };
    Vector3.prototype.Norm = function () {
        var len = this.Len();
        return this.Div(len);
    };
    Vector3.prototype.MultVector3 = function (v) {
        return new Vector3(this.Y * v.Z - this.Z * v.Y, -this.X * v.Z + this.Z * v.X, this.X * v.Y - this.Y * v.X);
    };
    return Vector3;
}());
// ../01_Code/Matrix3.ts
var Matrix3 = /** @class */ (function () {
    function Matrix3() {
        this.Value = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    Matrix3.prototype.Get = function (r, c) {
        return this.Value[r][c];
    };
    Matrix3.prototype.Set = function (r, c, v) {
        this.Value[r][c] = v;
    };
    Matrix3.prototype.GetAxisX = function () {
        return new Vector3(this.Value[0][0], this.Value[1][0], this.Value[2][0]);
    };
    Matrix3.prototype.GetAxisY = function () {
        return new Vector3(this.Value[0][1], this.Value[1][1], this.Value[2][1]);
    };
    Matrix3.prototype.GetAxisZ = function () {
        return new Vector3(this.Value[0][2], this.Value[1][2], this.Value[2][2]);
    };
    Matrix3.prototype.Mult = function (m) {
        var res = new Matrix3();
        var array = [0, 1, 2];
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var r = array_1[_i];
            for (var _a = 0, array_2 = array; _a < array_2.length; _a++) {
                var c = array_2[_a];
                var sum = 0;
                for (var _b = 0, array_3 = array; _b < array_3.length; _b++) {
                    var i = array_3[_b];
                    sum += this.Value[r][i] * m.Value[i][c];
                }
                res.Value[r][c] = sum;
            }
        }
        return res;
    };
    Matrix3.prototype.MultVector3 = function (v) {
        var res = new Vector3(0, 0, 0);
        var array = [0, 1, 2];
        for (var _i = 0, array_4 = array; _i < array_4.length; _i++) {
            var r = array_4[_i];
            var sum = 0;
            for (var _a = 0, array_5 = array; _a < array_5.length; _a++) {
                var i = array_5[_a];
                sum += this.Value[r][i] * v.Get(i);
            }
            res.Set(r, sum);
        }
        return res;
    };
    Matrix3.prototype.Transp = function () {
        var res = new Matrix3();
        var array = [0, 1, 2];
        for (var _i = 0, array_6 = array; _i < array_6.length; _i++) {
            var r = array_6[_i];
            for (var _a = 0, array_7 = array; _a < array_7.length; _a++) {
                var c = array_7[_a];
                res.Value[r][c] = this.Value[c][r];
            }
        }
        return res;
    };
    Matrix3.RotationMatrix = function (angle, axis1, axis2) {
        var m = new Matrix3();
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        m.Set(axis1, axis1, c);
        m.Set(axis2, axis2, c);
        m.Set(axis1, axis2, s);
        m.Set(axis2, axis1, -s);
        return m;
    };
    Matrix3.RotationMatrixX = function (angle) {
        return this.RotationMatrix(angle, 1, 2);
    };
    Matrix3.RotationMatrixY = function (angle) {
        return this.RotationMatrix(angle, 0, 2);
    };
    Matrix3.RotationMatrixZ = function (angle) {
        return this.RotationMatrix(angle, 0, 1);
    };
    return Matrix3;
}());
// Main.ts
{
    var scene = new MathSceneCanvas("canvas1");
    //	var a1 = scene.AddMathObject(new PlaneTdMathObject(
    //		-4, 2, -4, 4, 0.4, 1, function(x, y) { return Math.sin(y) * Math.exp(x); }, 
    //	new Vector2(0, 0), new Vector2(400, 400), new Vector2(200, 200)));
    var a1 = scene.AddMathObject(new ExpTdMathObject(-3, 3, -4, 4, 0.1, 1, function (c) { return new Complex(Math.cos(c.Im), Math.sin(c.Im)).MultNumber(Math.exp(c.Re)); }, new Vector2(0, 0), new Vector2(400, 400), new Vector2(200, 200)));
    scene.Repaint();
}
