// 01_Code/Context2d.ts
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
var Context2d = /** @class */ (function () {
    function Context2d(Canvas) {
        this.Context = Canvas.getContext("2d");
        this.Size = new Vector2(Canvas.width, Canvas.height);
    }
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
        this.LineX(start, end, color, lineWidth);
        this.LineX(point1, end, color, lineWidth);
        this.LineX(point2, end, color, lineWidth);
    };
    Context2d.prototype.FillRectX = function (conner, size, color) {
        this.Context.fillStyle = color;
        this.Context.fillRect(conner.X, conner.Y, size.X, size.Y);
    };
    Context2d.prototype.ClearRectX = function (conner, size) {
        this.Context.clearRect(conner.X, conner.Y, size.X, size.Y);
    };
    Context2d.prototype.StrokeRectX = function (conner, size, color, lineWidth) {
        this.Context.strokeStyle = color;
        this.Context.lineWidth = lineWidth;
        this.Context.strokeRect(conner.X, conner.Y, size.X, size.Y);
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
    Context2d.prototype.LineX = function (start, end, lineColor, lineWidth) {
        this.Context.beginPath();
        this.MoveTo(start);
        this.LineTo(end);
        this.Context.strokeStyle = lineColor;
        this.Context.lineWidth = lineWidth;
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
// 01_Code/Context3d.ts
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
    Context3d.prototype.DrawCircle = function (pos, radius, lineColor, lineWidth, fillColor) {
        var posGlobal = this.Matrix.MultVector3(pos);
        var radiusProj = posGlobal.Proj(radius, this.Distance) * this.Scale;
        var z = posGlobal.Z;
        if (radiusProj <= 0)
            return;
        var posProj = posGlobal.ToVector2Proj(this.Distance).Mult(this.Scale);
        this.DrawList.push(new CirclePrimitive(posProj, radiusProj, lineColor, lineWidth, fillColor, z));
    };
    Context3d.prototype.DrawLine = function (pos1, pos2, lineColor, lineWidth) {
        var posGlobal1 = this.Matrix.MultVector3(pos1);
        var posGlobal2 = this.Matrix.MultVector3(pos2);
        var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale);
        var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale);
        var z = (posGlobal1.Z + posGlobal2.Z) / 2;
        this.DrawList.push(new LinePrimitive(posProj1, posProj2, lineColor, lineWidth, z));
    };
    Context3d.prototype.DrawArrow = function (pos1, pos2, arrowLength, arrowWidth, color, lineWidth) {
        var posGlobal1 = this.Matrix.MultVector3(pos1);
        var posGlobal2 = this.Matrix.MultVector3(pos2);
        var posProj1 = posGlobal1.ToVector2Proj(this.Distance).Mult(this.Scale);
        var posProj2 = posGlobal2.ToVector2Proj(this.Distance).Mult(this.Scale);
        var z = (posGlobal1.Z + posGlobal2.Z) / 2;
        this.DrawList.push(new ArrowPrimitive(posProj1, posProj2, arrowLength, arrowWidth, color, lineWidth, z));
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
// 01_Code/Vector3.ts
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
// 01_Code/Matrix3.ts
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
// 01_Code/Canvas.ts
var Canvas = /** @class */ (function () {
    function Canvas(canvasId) {
        this.Canvas = document.getElementById(canvasId);
        this.Context2d = new Context2d(this.Canvas);
        this.Size = new Vector2(this.Canvas.width, this.Canvas.height);
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
// 01_Code/XObject.ts
var XObject = /** @class */ (function () {
    function XObject(pos, size, centerShift) {
        this.Pos = pos;
        this.Size = size;
        this.BottomConnerPos = pos.Plus(size);
        this.CenterShift = centerShift;
        this.CenterPos = pos.Plus(centerShift);
        this.InnerTopLeftConner = centerShift.Mult(-1);
        this.InnerBottomRightConner = size.Minus(centerShift);
    }
    //	abstract OnUpdate(interval: number): void;
    //	abstract CheckForRestart(): boolean;
    //	abstract Init(): void;
    XObject.prototype.IsInto = function (pos) {
        var r = pos.X >= this.Pos.X && pos.X <= this.BottomConnerPos.X &&
            pos.Y >= this.Pos.Y && pos.Y <= this.BottomConnerPos.Y;
        return r;
    };
    XObject.prototype.Paint = function () {
        this.Context2d.Save();
        this.Context2d.FillRectX(this.Pos, this.Size, "white");
        this.Context2d.Translate(this.CenterPos);
        this.PaintVirt();
        this.Context2d.Restore();
    };
    return XObject;
}());
// 01_Code/ContainerCanvas.ts
var DragResult;
(function (DragResult) {
    DragResult[DragResult["NoDrag"] = 0] = "NoDrag";
    DragResult[DragResult["Drag"] = 1] = "Drag";
})(DragResult || (DragResult = {}));
var ContainerCanvas = /** @class */ (function (_super) {
    __extends(ContainerCanvas, _super);
    function ContainerCanvas(canvasId) {
        var _this = _super.call(this, canvasId) || this;
        _this.XObjectList = new Array();
        return _this;
    }
    ContainerCanvas.prototype.AddXObject = function (xobject) {
        xobject.ContainerCanvas = this;
        xobject.Context2d = this.Context2d;
        xobject.InitCanvas(this);
        this.XObjectList.push(xobject);
        return xobject;
    };
    ContainerCanvas.prototype.OnMouseDownVirt = function (event, pos) {
        var needRepaint = false;
        for (var _i = 0, _a = this.XObjectList; _i < _a.length; _i++) {
            var m = _a[_i];
            if (m.IsInto(pos)) {
                var dragResult = m.OnMouseDownVirt(event, pos.Minus(m.CenterPos));
                needRepaint = true;
                if (dragResult == DragResult.Drag)
                    this.DragXObject = m;
            }
        }
        if (needRepaint)
            this.Repaint();
    };
    ContainerCanvas.prototype.OnMouseMoveVirt = function (event, pos) {
        if (this.DragXObject != null) {
            this.DragXObject.OnMouseMoveVirt(event, pos.Minus(this.DragXObject.CenterPos));
            this.Repaint();
        }
    };
    ContainerCanvas.prototype.OnMouseUpVirt = function (event, pos) {
        if (this.DragXObject != null)
            this.DragXObject = null;
    };
    ContainerCanvas.prototype.Repaint = function () {
        this.Context2d.ClearRectX(new Vector2(0, 0), this.Size);
        for (var _i = 0, _a = this.XObjectList; _i < _a.length; _i++) {
            var m = _a[_i];
            m.Paint();
        }
    };
    return ContainerCanvas;
}(Canvas));
// 01_Code/SceneXObject.ts
var XButton = /** @class */ (function () {
    function XButton(pos, size, color, func) {
        this.Pos = pos;
        this.Size = size;
        this.Pos2 = pos.Plus(size);
        this.Color = color;
        this.Func = func;
    }
    return XButton;
}());
var SceneXObject = /** @class */ (function (_super) {
    __extends(SceneXObject, _super);
    function SceneXObject(pos, size, centerShift) {
        var _this = _super.call(this, pos, size, centerShift) || this;
        _this.Alpha = 0;
        _this.Beta = 0;
        _this.ButtonList = new Array();
        return _this;
    }
    /*	SetParent(containerCanvas: ContainerCanvas): void
        {
            this.Context2d = mathSceneCanvas.Context2d;
            this.MathSceneCanvas = mathSceneCanvas;
            this.Context3d = new Context3d(this.Context2d);
        }*/
    SceneXObject.prototype.InitCanvas = function (containerCanvas) {
        this.Context3d = new Context3d(this.Context2d);
    };
    SceneXObject.prototype.AddButton = function (pos, size, color, func) {
        this.ButtonList.push(new XButton(pos, size, color, func));
    };
    SceneXObject.prototype.PaintVirt = function () {
        var r1 = Matrix3.RotationMatrixY(this.Alpha / 180);
        var r2 = Matrix3.RotationMatrixX(this.Beta / 180);
        this.Context3d.Matrix = r2.Mult(r1);
        this.Context3d.StartFrame();
        this.Paint3dVirt();
        this.Context3d.EndFrame();
        this.Context2d.Translate(this.CenterShift.Mult(-1));
        for (var _i = 0, _a = this.ButtonList; _i < _a.length; _i++) {
            var b = _a[_i];
            this.Context2d.StrokeRectX(b.Pos, b.Size, b.Color, 1);
        }
        this.Context2d.Translate(this.CenterShift);
    };
    SceneXObject.prototype.OnMouseDownVirt = function (event, pos) {
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
    SceneXObject.prototype.OnMouseMoveVirt = function (event, pos) {
        var delta = pos.Minus(this.StartDragPos);
        this.Alpha = this.StartDragAlpha + delta.X;
        this.Beta = this.StartDragBeta + delta.Y;
        this.ContainerCanvas.Repaint();
    };
    return SceneXObject;
}(XObject));
// 01_Code/Primitive.ts
var Primitive = /** @class */ (function () {
    function Primitive(z) {
        this.Z = z;
    }
    return Primitive;
}());
var LinePrimitive = /** @class */ (function (_super) {
    __extends(LinePrimitive, _super);
    function LinePrimitive(pos1, pos2, color, lineWidth, z) {
        var _this = _super.call(this, z) || this;
        _this.Pos1 = pos1;
        _this.Pos2 = pos2;
        _this.Color = color;
        _this.LineWidth = lineWidth;
        return _this;
    }
    LinePrimitive.prototype.Paint = function (context2d) {
        context2d.LineX(this.Pos1, this.Pos2, this.Color, this.LineWidth);
    };
    return LinePrimitive;
}(Primitive));
var ArrowPrimitive = /** @class */ (function (_super) {
    __extends(ArrowPrimitive, _super);
    function ArrowPrimitive(pos1, pos2, arrowLength, arrowWidth, color, lineWidth, z) {
        var _this = _super.call(this, z) || this;
        _this.Pos1 = pos1;
        _this.Pos2 = pos2;
        _this.ArrowLenght = arrowLength;
        _this.ArrowWidth = arrowWidth;
        _this.Color = color;
        _this.LineWidth = lineWidth;
        return _this;
    }
    ArrowPrimitive.prototype.Paint = function (context2d) {
        context2d.ArrowX(this.Pos1, this.Pos2, this.ArrowLenght, this.ArrowWidth, this.Color, this.LineWidth);
    };
    return ArrowPrimitive;
}(Primitive));
var CirclePrimitive = /** @class */ (function (_super) {
    __extends(CirclePrimitive, _super);
    function CirclePrimitive(pos, radius, lineColor, lineWidth, fillColor, z) {
        var _this = _super.call(this, z) || this;
        _this.Pos = pos;
        _this.Radius = radius;
        _this.LineColor = lineColor;
        _this.LineWidth = lineWidth;
        _this.FillColor = fillColor;
        return _this;
    }
    CirclePrimitive.prototype.Paint = function (context2d) {
        context2d.CircleX(this.Pos, this.Radius, this.LineColor, this.LineWidth, this.FillColor);
    };
    return CirclePrimitive;
}(Primitive));
// 01_Code/VectorXObject.ts
var VectorXObject = /** @class */ (function (_super) {
    __extends(VectorXObject, _super);
    /*	StartX: number;
        EndX: number;
        StartY: number;
        EndY: number;
        Step: number;
        LenX: number;
        LenY: number;
        CenterX: number;
        CenterY: number;
        Scale: number;
        Func: (x: number, y: number) => number;
        PlaneTdMathObjectState: PlaneTdMathObjectState;*/
    function VectorXObject(/*startX: number, endX: number, startY: number, endY: number, step: number,
    scale: number, func: (x: number, y: number) => number, */ pos, size, centerShift) {
        return _super.call(this, pos, size, centerShift) || this;
        /*		this.StartX = startX;
                this.StartY = startY;
                this.EndX = endX;
                this.EndY = endY;
                this.Step = step;
                this.LenX = this.EndX - this.StartX;
                this.LenY = this.EndY - this.StartY;
                this.CenterX = (this.StartX + this.EndX)/2;
                this.CenterY = (this.StartY + this.EndY)/2;
                this.Scale = scale;
                this.Func = func;
                this.PlaneTdMathObjectState = PlaneTdMathObjectState.Plane;
                
                var thisObject = this;
                this.AddButton(new Vector2(10, 10), new Vector2(10, 10), "black", function() { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.Plane;});
                this.AddButton(new Vector2(20, 10), new Vector2(10, 10), "black", function() { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.AxisX;});
                this.AddButton(new Vector2(30, 10), new Vector2(10, 10), "black", function() { thisObject.PlaneTdMathObjectState = PlaneTdMathObjectState.AxisY;});
        
                this.AddButton(new Vector2(100, 10), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftUp(); });
                this.AddButton(new Vector2(100, 30), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftDown(); });
                this.AddButton(new Vector2(90, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftLeft(); });
                this.AddButton(new Vector2(110, 20), new Vector2(10, 10), "black", function() { thisObject.ButtonShiftRight(); });*/
    }
    /*	ButtonShiftUp()
        {
            this.Shift(0, -0.1);
        }
    
        ButtonShiftDown()
        {
            this.Shift(0, 0.1);
        }
    
        ButtonShiftLeft()
        {
            this.Shift(-0.1, 0);
        }
        
        ButtonShiftRight()
        {
            this.Shift(0.1, 0);
        }
        
        Shift(shiftX: number, shiftY: number)
        {
            this.StartX += this.LenX * shiftX;
            this.EndX += this.LenX * shiftX;
            this.StartY += this.LenY * shiftY;
            this.EndY += this.LenY * shiftY;
            this.CenterX = (this.StartX + this.EndX)/2;
            this.CenterY = (this.StartY + this.EndY)/2;
        }*/
    VectorXObject.prototype.Paint3dVirt = function () {
        this.Context3d.DrawArrow(new Vector3(0, 0, 0), new Vector3(1, 0, 0), 5, 2, "blue", 1);
        this.Context3d.DrawArrow(new Vector3(0, 0, 0), new Vector3(0, 1, 0), 5, 2, "blue", 1);
        this.Context3d.DrawArrow(new Vector3(0, 0, 0), new Vector3(0, 0, 1), 5, 2, "blue", 1);
        /*		if(this.PlaneTdMathObjectState == PlaneTdMathObjectState.Plane)
                {
                    for(var x = this.StartX; x <= this.EndX; x += this.Step)
                        for(var y = this.StartY; y <= this.EndY; y += this.Step)
                        {
                            var value = this.Func(x, y);
                            this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step/2*this.Scale, "white");
                        }
                }
        
                if(this.PlaneTdMathObjectState == PlaneTdMathObjectState.AxisX)
                {
                    for(var x = this.StartX; x <= this.EndX; x += this.Step)
                    {
                        var y = 0;
                        var value = this.Func(x, y);
                        this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step/2*this.Scale, "white");
                    }
                }
        
                if(this.PlaneTdMathObjectState == PlaneTdMathObjectState.AxisY)
                {
                    for(var y = this.StartY; y <= this.EndY; y += this.Step)
                    {
                        var x = 0;
                        var value = this.Func(x, y);
                        this.Context3d.DrawCircle(this.Convert(new Vector3(x, value, y)), this.Step/2*this.Scale, "white");
                    }
                    
                }*/
    };
    return VectorXObject;
}(SceneXObject));
var container = new ContainerCanvas("canvasModel1");
container.AddXObject(new VectorXObject(new Vector2(0, 0), new Vector2(200, 200), new Vector2(100, 100)));
container.Repaint();
