const CANVAS_SIZE = { width: 800, height: 600 };

const SNAKE_INITIAL_POSITION = [
  { x: 8, y: 6 },
  { x: 8, y: 7 },
  { x: 8, y: 8 },
];

const APPLE_START = { x: 8, y: 3 };

const SCALE = [40];

const SNAKE_INITIAL_SPEED = 400;

const SPEED_UP = 5;

const DIRECTION = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export {
  CANVAS_SIZE,
  SNAKE_INITIAL_POSITION,
  APPLE_START,
  SCALE,
  SNAKE_INITIAL_SPEED,
  DIRECTION,
  SPEED_UP,
};
