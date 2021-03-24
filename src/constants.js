const CANVAS_SIZE = [800, 600];
const SNAKE_START = [
  [8, 6],
  [8, 7],
  [8, 8],
];
const APPLE_START = [8, 3];
const SCALE = [40];
const SPEED = 400;
const SPEED_UP = 5;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0], // right
};

export {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
  SPEED_UP,
};
