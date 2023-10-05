
import { Floater } from "./floater.js";

let ctx, canvas, gradient;

const height = 1080;
const width = 1920;

const fps = 30;
const numFloaters = 150;

const floaters = [];

// animation loop
const update = () => {

    setTimeout(() => {requestAnimationFrame(update);}, 1000 / fps);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let floater of floaters) {
        floater.update(width, height);
        floater.draw(ctx);
    }
}

const init = () => {
    // A - `canvas` variable points at <canvas> tag
    canvas = document.querySelector("canvas");

    // B - the `ctx` variable points at a "2D drawing context"
    ctx = canvas.getContext("2d");

    // set up gradient
    gradient = ctx.createLinearGradient(0, 0, width / 2, height);
    gradient.addColorStop("0", "rgba(16, 19, 97, 1)");
    gradient.addColorStop("1", "rgba(86, 25, 209, 1)");

    for (let i = 0; i < numFloaters; i++) {
        floaters.push(new Floater(width, height));
    }

    update();
}

// #1 call the `init` const after the pages loads
init();