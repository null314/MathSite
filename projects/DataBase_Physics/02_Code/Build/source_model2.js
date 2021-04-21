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
        this.Line(start, end);
        this.Line(point1, end);
        this.Line(point2, end);
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
    XObject.prototype.StartTimer = function (interval) {
        var thisValue = this;
        var myfunc = setInterval(function () {
            thisValue.OnUpdate(interval);
            thisValue.ContainerCanvas.Repaint();
            if (thisValue.CheckForRestart())
                thisValue.Init();
        }, interval * 1000);
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
// 01_Code/AxesXObject.ts
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
var AxesXObject = /** @class */ (function (_super) {
    __extends(AxesXObject, _super);
    function AxesXObject(headerHeight, leftX, rightX, bottomY, pos, size) {
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
    AxesXObject.prototype.InitCanvas = function (containerCanvas) {
    };
    AxesXObject.prototype.AddButton = function (pos, size, color, func) {
        this.ButtonList.push(new XButton(pos, size, color, func));
    };
    AxesXObject.prototype.PaintVirt = function () {
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
    AxesXObject.prototype.DrawAxis = function () {
        this.Context2d.ArrowX(new Vector2(this.LeftX, 0), new Vector2(this.RightX, 0), 10, 3, "gray", 1);
        this.Context2d.ArrowX(new Vector2(0, this.BottomY), new Vector2(0, this.TopY), 10, 3, "gray", 1);
    };
    AxesXObject.prototype.OnMouseDownVirt = function (event, pos) {
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
    AxesXObject.prototype.OnMouseMoveVirt = function (event, pos) {
    };
    AxesXObject.prototype.IsInside = function (pos, radius) {
        var result = pos.X + radius < this.RightX &&
            pos.X - radius > this.LeftX &&
            pos.Y + radius < this.TopY &&
            pos.Y - radius > this.BottomY;
        return result;
    };
    return AxesXObject;
}(XObject));
// 01_Code/Model2XObject.ts
var Model2XObject = /** @class */ (function (_super) {
    __extends(Model2XObject, _super);
    function Model2XObject(pos, size) {
        var _this = _super.call(this, 20, -10, 100, -10, pos, size) || this;
        _this.Init();
        _this.StartTimer(0.01);
        var thisVar = _this;
        _this.AddButton(new Vector2(5, 5), new Vector2(10, 10), "black", function () { thisVar.Init(); });
        return _this;
    }
    Model2XObject.prototype.Init = function () {
        this.Position = new Vector2(10, 10);
        this.DPosition = new Vector2(20, 40);
        this.DDPosition = new Vector2(0, -30);
    };
    Model2XObject.prototype.OnUpdate = function (dt) {
        //		правило производной		
        //		this.Position = this.Position + this.DPosition * dt;
        this.Position = this.Position.Plus(this.DPosition.Mult(dt));
        //		правило производной		
        //		this.DPosition = this.DPosition + this.DDPosition * dt;
        this.DPosition = this.DPosition.Plus(this.DDPosition.Mult(dt));
    };
    Model2XObject.prototype.CheckForRestart = function () {
        return this.Position.X > 100;
    };
    Model2XObject.prototype.FinalPaintVirt = function () {
        this.DrawAxis();
        if (this.IsInside(this.Position, 10)) {
            this.Context2d.CircleX(this.Position, 10, "#cbc7ae", 1, "#cbc7ae");
            this.Context2d.ArrowX(this.Position, this.Position.Plus(this.DPosition), 5, 2, "grey", 1);
        }
    };
    return Model2XObject;
}(AxesXObject));
var container = new ContainerCanvas("canvasModel2");
container.AddXObject(new Model2XObject(new Vector2(0, 0), new Vector2(200, 200)));
container.Repaint();
