export default null;

export const startGame = () => ({ type: 'START_GAME' });

export const overGame = () => ({ type: 'OVER_GAME' });

export const changeSnakeDirection = (newDirection) => ({ type: 'CHANGE_SNAKE_DIRECTION', payload: newDirection });

export const snakeEatingApple = (newApplePosition) => ({ type: 'SNAKE_EATING_APPLE', payload: newApplePosition });

export const snakeGrowing = (newSnakePosition) => ({ type: 'SNAKE_GROWING', payload: newSnakePosition });

export const pauseGame = () => ({ type: 'PAUSE_GAME' });

export const resumeGame = () => ({ type: 'RESUME_GAME' });
