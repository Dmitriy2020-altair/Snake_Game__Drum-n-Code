import { CANVAS_SIZE, SCALE } from '../constants';

const checkCollision = (piece, snakePosition) => {
  if (piece.x * SCALE >= CANVAS_SIZE.width || piece.x < 0 || piece.y * SCALE >= CANVAS_SIZE.height || piece.y < 0) return true;

  for (const { x, y } of snakePosition) {
    if (piece.x === x && piece.y === y) return true;
  }
  return false;
};

export default checkCollision;
