import { context } from "../index.js";

export default class EnemyBullet {
  ENEMY_BULLET_WIDTH = 3;
  ENEMY_BULLET_HEIGHT = 10;
  ENEMY_BULLET_COLOR = "white";

  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = this.ENEMY_BULLET_WIDTH;
    this.height = this.ENEMY_BULLET_HEIGHT;
  }
  draw() {
    context.fillStyle = this.ENEMY_BULLET_COLOR;
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
