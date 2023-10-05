// draws an arc
export const drawEllipse = (ctx, x, y, radiusX, radiusY, fillStyle = "black", startAngle = 0, endAngle = Math.PI * 2) => {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, startAngle, endAngle);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}