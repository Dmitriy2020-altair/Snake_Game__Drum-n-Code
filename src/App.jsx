import React, { useEffect, useReducer, useCallback } from 'react';
import './App.scss';
import useInterval from './utils/useInterval';
import { DIRECTION } from './constants';
import gameReducer, {
  changeSnakeDirection, overGame, snakeEatingApple, snakeGrowing, startGame, pausedGame, resumeGame,
} from './reducer/GameReducer';
import createApple from './utils/createApple';
import checkCollision from './utils/checkCollision';
import GameScene from './components/GameScene';

const App = () => {
  const [state, dispatch] = useReducer(gameReducer, gameReducer.initialState);

  const {
    snake,
    score,
    applePosition,
    gameIsOver,
    gameIsPaused,
    gameIsRunning,
    topScore,
  } = state;

  const dispatchStartGame = () => {
    dispatch(startGame());
  };

  const dispatchPauseGame = () => {
    dispatch(pausedGame());
  };

  useInterval(() => gameLoop(), (gameIsPaused || !gameIsRunning) ? null : snake.speed);

  const winGame = () => {
    alert('You won! Now you are real ANACONDA!');
    dispatch(startGame());
  };

  const moveSnake = useCallback(({ keyCode }) => {
    if (keyCode === 32) return gameIsPaused ? dispatch(resumeGame()) : dispatch(pausedGame());

    if (gameIsPaused) return;

    if (!(keyCode >= 37 && keyCode <= 40)) return;

    const {
      up, down, left, right,
    } = DIRECTION;
    let newDirection;

    if (keyCode === 38) newDirection = up;
    else if (keyCode === 40) newDirection = down;
    else if (keyCode === 37) newDirection = left;
    else newDirection = right;

    dispatch(changeSnakeDirection(newDirection));
  }, [gameIsPaused]);

  const checkAppleCollision = (newSnakePosition) => {
    if (newSnakePosition[0].x === applePosition.x && newSnakePosition[0].y === applePosition.y) {
      let newApplePosition = createApple();

      while (checkCollision(newApplePosition, newSnakePosition)) {
        newApplePosition = createApple();
      }

      dispatch(snakeEatingApple(newApplePosition));

      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const copySnakePosition = [...snake.position];
    const newSnakeHead = {
      x: copySnakePosition[0].x + snake.direction.x,
      y: copySnakePosition[0].y + snake.direction.y,
    };

    copySnakePosition.unshift(newSnakeHead);

    if (checkCollision(newSnakeHead, snake.position)) dispatch(overGame());

    if (!checkAppleCollision(copySnakePosition)) copySnakePosition.pop();

    dispatch(snakeGrowing(copySnakePosition));

    if (score === 50) winGame();
  };

  const dispatchResumeGame = () => {
    dispatch(resumeGame());
  };

  useEffect(() => {
    if (gameIsRunning) document.addEventListener('keydown', moveSnake);

    return () => document.removeEventListener('keydown', moveSnake);
  }, [gameIsRunning, moveSnake]);

  return (
    <div>
      {gameIsOver && <div>GAME OVER!</div>}
      <GameScene
        applePosition={applePosition}
        snake={snake}
        gameIsOver={gameIsOver}
      >
        <div className="score-board">
          <div className="typography h3">
            Score:
            {score}
          </div>
          <div className="typography h3">
            Top score:
            {topScore}
          </div>
          <p className="typography h6">
            Keyboard&apos;s arrows - snake manipulation
            <br />
            Enter button is PAUSE and RESUME
            <br />
            To win Game have to get 50 apples
          </p>
          {gameIsRunning ? (
            <button
              className="btn"
              onClick={gameIsPaused ? dispatchResumeGame : dispatchPauseGame}
            >
              { gameIsPaused ? 'Resume' : 'Pause'}
            </button>
          ) : (
            <button
              className="btn"
              onClick={dispatchStartGame}
            >
              Start Game
            </button>
          )}
        </div>
      </GameScene>
    </div>
  );
};

export default App;
