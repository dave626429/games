import { context, canvas } from "../index.js";

export default class Player {
  IMAGE_SRC = "./assets/images/spaceship.png";
  SCALE = 0.1;

  constructor() {
    this.velocity = {
      x: 0,
      y: 0, // wil not be used unless there is any veritical movement of the player
    };

    this.rotation = 0;
    this.opacity = 1;

    //image
    const image = new Image();
    image.src = this.IMAGE_SRC;

    image.onload = () => {
      this.image = image;

      //   Player's width & height
      this.width = image.width * this.SCALE;
      this.height = image.height * this.SCALE;

      // Player position on canvas
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  // draws the charater on the canvas
  draw() {
    context.save();
    context.globalAlpha = this.opacity;
    context.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    context.rotate(this.rotation);
    context.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );

    context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    context.restore();
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}
