import { context } from "../index.js";

export default class Particle {
  constructor({ position, velocity, radius, color, fade = true }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1; // start fully visible
    this.fade = fade;
  }

  draw() {
    context.save();
    context.globalAlpha = this.opacity; // must be BEFORE fill
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.fade) this.opacity -= 0.008;
  }
}
