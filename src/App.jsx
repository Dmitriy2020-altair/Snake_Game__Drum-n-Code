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

  const dispatchStartGame = useCallback(() => {
    dispatch(startGame());
  }, []);

  useInterval(() => gameLoop(), (gameIsPaused || !gameIsRunning) ? null : snake.speed);

  const winGame = useCallback(() => {
    alert('You won! Now you are real ANACONDA!');
    dispatch(startGame());
  }, []);

  const moveSnake = useCallback(({ keyCode }) => {
    console.log('Hello sanek');
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

    if ((newDirection === up || newDirection === down) && (snake.direction === up || snake.direction === down)) return;

    if ((newDirection === right || newDirection === left) && (snake.direction === right || snake.direction === left)) return;

    dispatch(changeSnakeDirection(newDirection));
  }, [snake.direction, gameIsPaused]);

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

  const dispatchPauseGame = useCallback(() => {
    dispatch(pausedGame());
  }, []);

  const dispatchResumeGame = useCallback(() => {
    dispatch(resumeGame());
  }, []);

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
      />
      {gameIsRunning ? (
        <>
          <div>
            Score:
            {' '}
            {score}
          </div>
          <button
            onClick={gameIsPaused ? dispatchResumeGame : dispatchPauseGame}
          >
            {gameIsPaused ? 'Resume' : 'Pause'}
          </button>
        </>
      ) : (
        <button onClick={dispatchStartGame}>Start Game</button>
      )}
      <div>
        Top score:
        {' '}
        { topScore }
      </div>
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '5px',
      }}
      >
        Keyboard&apos;s arrows - snake manipulation
        <br />
        Space button is PAUSE and RESUME
        <br />
        To win Game have to get 50 apples
      </div>
    </div>
  );
};

export default App;
