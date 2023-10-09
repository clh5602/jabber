
const drawEllipse = (ctx, x, y, radiusX, radiusY, fillStyle = "black", startAngle = 0, endAngle = Math.PI * 2) => {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, startAngle, endAngle);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

const colors = [
    'rgba(83, 25, 230,',
    'rgba(114, 41, 196',
    'rgba(72, 10, 143,',
    'rgba(103, 12, 207,'
];

export class Floater {
    constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.yVel = Math.random() * height * 0.01 - height * 0.005;
        this.xVel = Math.random() * width * 0.002 - width * 0.001;
        this.sizeScaler = 0;
        this.radius = Math.random() * width * 0.1 + width * 0.05;
        this.alpha = Math.random() * 0.1 + 0.2;
        this.frameCounter = Math.floor(Math.random() * 360);
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    updateSizeScalar() {
        this.frameCounter += Math.random();
        this.frameCounter %= 360;

        this.sizeScaler = Math.sin(this.frameCounter / 180 * Math.PI) / 2 + 0.5;
    }

    updateXVel(width) {
        this.xVel += Math.random() * width * 0.005 - width * 0.01;
        if (this.xVel > width * 0.05) {
            this.xVel = width * 0.05;
        }
        if (this.xVel < width * -0.05) {
            this.xVel = width * -0.05;
        }
    }

    updateYVel(height) {
        if (this.y > height/2) {
            if (this.yVel > height * -0.08) this.yVel -= Math.random() * height * 0.0001;
        }
        else {
            if (this.yVel < height * 0.08) this.yVel += Math.random() * height * 0.0001;
        }
    }

    update(width, height) {
        // update positions
        this.x += this.xVel;
        this.y += this.yVel;

        // wrap around sides
        if (this.x < width * -0.2) {
            this.x = width * 1.2;
        }
        if (this.x > width * 1.2) {
            this.x = width * -0.2;
        }

        // update velocity
        this.updateYVel(height);
        this.updateSizeScalar();
    }

    draw(ctx) {
        drawEllipse(ctx, this.x, this.y, this.radius * (0.5 + this.sizeScaler), this.radius * (1.5 - this.sizeScaler), `${this.color} ${this.alpha})`);
    }
}