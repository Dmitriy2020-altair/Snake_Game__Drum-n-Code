import {
  DIRECTION, SNAKE_INITIAL_POSITION, SPEED_UP, SNAKE_INITIAL_SPEED,
} from '../constants';

let currentSpeedSnake = null;

export const gameInitialState = {
  snake: {
    speed: null,
    direction: DIRECTION.up,
    position: SNAKE_INITIAL_POSITION,
  },

  applePosition: { x: 8, y: 3 },
  score: 0,
  gameIsPaused: false,
  gameIsRunning: false,
  gameIsOver: false,
  topScore: Number(localStorage.getItem('topScore')) ?? 0,
};

export default function gameReducer(state, { type, payload = null }) {
  console.log(type, payload);

  switch (type) {
    case 'START_GAME': {
      return {
        ...gameInitialState,
        gameIsRunning: true,
        snake: {
          ...gameInitialState.snake,
          speed: SNAKE_INITIAL_SPEED,
        },
        topScore: Number(localStorage.getItem('topScore')) ?? 0,
      };
    }

    case 'OVER_GAME': {
      return {
        ...state,
        gameIsRunning: false,
        gameIsOver: true,
        snake: {
          ...state.snake,
          speed: null,
        },
      };
    }

    case 'CHANGE_SNAKE_DIRECTION': {
      const newSnakeDirection = payload;

      return {
        ...state,
        snake: {
          ...state.snake,
          direction: newSnakeDirection,
        },
      };
    }

    case 'SNAKE_EATING_APPLE': {
      const newApplePosition = payload;
      const newScore = state.score + 1;
      const newTopScore = Math.max(newScore, state.topScore);
      localStorage.setItem('topScore', newTopScore);

      return {
        ...state,
        applePosition: newApplePosition,
        score: newScore,
        snake: {
          ...state.snake,
          speed: state.snake.speed - SPEED_UP,
        },
        topScore: newTopScore,
      };
    }

    case 'SNAKE_GROWING': {
      const newSnakePosition = payload;

      return {
        ...state,
        snake: {
          ...state.snake,
          position: newSnakePosition,
        },
      };
    }

    case 'PAUSE_GAME': {
      currentSpeedSnake = state.snake.speed;

      return {
        ...state,
        snake: {
          ...state.snake,
          speed: null,
        },
        gameIsPaused: true,
      };
    }

    case 'RESUME_GAME': {
      return {
        ...state,
        snake: {
          ...state.snake,
          speed: currentSpeedSnake,
        },

        gameIsPaused: false,
      };
    }

    default:
      return state;
  }
}
