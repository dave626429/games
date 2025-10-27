class Cursor {
  constructor(path, name) {
    this.name = name;
    this.path = path;
    this.position = {
      x: 0,
      y: 0,
    };
  }
  update({ x, y }) {
    this.position.x = x;
    this.position.x = y;
  }
}
