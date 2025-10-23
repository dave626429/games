import { context } from "../index.js";

export default class Bullet {
  BULLET_COLOR = "red";
  BULLET_RADIUS = 3;

  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = this.BULLET_RADIUS;
  }

  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.BULLET_COLOR;
    context.fill();
    context.closePath();
  }

  update() {
    this.draw();
    this.position.x -= this.velocity.x;
    this.position.y -= this.velocity.y;
  }
}
