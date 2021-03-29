import {
  DIRECTION, SNAKE_INITIAL_POSITION, SPEED_UP, SNAKE_INITIAL_SPEED, APPLE_START,
} from '../constants';
import createReducer from '../utils/createReducer';

const gameInitialState = {
  snake: {
    speed: SNAKE_INITIAL_SPEED,
    direction: DIRECTION.up,
    position: SNAKE_INITIAL_POSITION,
  },

  applePosition: APPLE_START,
  score: 0,
  gameIsPaused: false,
  gameIsRunning: false,
  gameIsOver: false,
  topScore: Number(localStorage.getItem('topScore')) ?? 0,
};

const gameReducer = createReducer({
  name: 'game',

  initialState: gameInitialState,

  reducers: {
    startGame: () => ({
      ...gameInitialState,
      snake: { ...gameInitialState.snake },
      gameIsRunning: true,
      topScore: Number(localStorage.getItem('topScore')) ?? 0,
    }),

    overGame(state) {
      state.gameIsRunning = false;
      state.gameIsOver = true;
    },

    changeSnakeDirection(state, payload) {
      const newSnakeDirection = payload;

      const {
        up, down, left, right,
      } = DIRECTION;

      if (
        (newSnakeDirection === up && state.snake.direction === down)
        || (newSnakeDirection === down && state.snake.direction === up)
        || (newSnakeDirection === left && state.snake.direction === right)
        || (newSnakeDirection === right && state.snake.direction === left)
      ) state.snake.position.reverse();

      state.snake.direction = newSnakeDirection;
    },

    snakeEatingApple(state, payload) {
      const newApplePosition = payload;
      const newScore = state.score + 1;
      const newTopScore = Math.max(newScore, state.topScore);
      localStorage.setItem('topScore', newTopScore);

      state.applePosition = newApplePosition;
      state.score = newScore;
      state.snake.speed -= SPEED_UP;
      state.topScore = newTopScore;
    },

    snakeGrowing(state, payload) {
      const newSnakePosition = payload;

      state.snake.position = newSnakePosition;
    },

    pausedGame(state) {
      state.gameIsPaused = true;
    },

    resumeGame(state) {
      state.gameIsPaused = false;
    },

  },
});

export default gameReducer;

export const {
  startGame,
  overGame,
  changeSnakeDirection,
  snakeEatingApple,
  snakeGrowing,
  pausedGame,
  resumeGame,
} = gameReducer.actions;
