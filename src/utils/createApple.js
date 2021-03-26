import { CANVAS_SIZE, SCALE } from '../constants';

const createApple = () => ({
  x: Math.floor(Math.random() * (CANVAS_SIZE.width / SCALE)),
  y: Math.floor(Math.random() * (CANVAS_SIZE.height / SCALE)),
});

export default createApple;
