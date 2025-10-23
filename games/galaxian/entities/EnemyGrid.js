import { canvas } from "../index.js";
import Enemy from "./Enemy.js";

export default class EnemyGrid {
  MIN_COLUMNS = 5;
  MIN_ROWS = 2;
  COLUMNS = Math.floor(Math.random() * 10 + this.MIN_COLUMNS);
  ROWS = Math.floor(Math.random() * 5 + this.MIN_ROWS);
  MIN_GRID_X_VELOCITY = 1;

  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 1,
      y: 0,
    };

    this.width = this.COLUMNS * 30;

    this.enemies = [];

    for (let i = 0; i < this.COLUMNS; i++) {
      for (let j = 0; j < this.ROWS; j++) {
        this.enemies.push(new Enemy({ position: { x: i * 30, y: j * 30 } }));
      }
    }
  }

  //   draw() {}

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // reset the velocity when grid hits the edge
    // if not set, instead of moving one step along the
    // postion, as soon as the fist hit occurs this will move
    // out of the canvas, to see that comment this
    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}
