import { context, canvas } from "../index.js";
import EnemyBullet from "./EnemyBullet.js";

export default class Enemy {
  IMAGE_SRC = "./assets/images/invader.png";
  SCALE = 1;
  BULLET_VELOCITY = 1;

  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0, // wil not be used unless there is any veritical movement of the Enemy
    };
    // Enemy position on canvas
    this.position = position;

    //image
    const image = new Image();
    image.src = this.IMAGE_SRC;

    image.onload = () => {
      this.image = image;

      //   Enemy's width & height
      this.width = image.width * this.SCALE;
      this.height = image.height * this.SCALE;
    };
  }

  // draws the charater on the canvas
  draw() {
    context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ velocity }) {
    if (!this.image) return;
    this.draw();
    this.position.x += velocity.x;
    this.position.y += velocity.y;
  }

  shoot(enemyBullets) {
    if (!this.image) return;

    enemyBullets.push(
      new EnemyBullet({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: this.BULLET_VELOCITY,
        },
      })
    );
  }
}
