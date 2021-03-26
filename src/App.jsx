import React, {
  useRef, useEffect, useReducer, useCallback,
} from 'react';
import './App.css';
import useInterval from './utils/helper';
import {
  CANVAS_SIZE,
  SCALE,
  DIRECTION,
} from './constants';
import gameReducer, { gameInitialState } from './reducer/GameReducer';
import {
  changeSnakeDirection, overGame, snakeEatingApple, snakeGrowing, startGame, pauseGame, resumeGame,
} from './actions';
import createApple from './utils/createApple';
import checkCollision from './utils/checkCollision';

const App = () => {
  const canvasRef = useRef();

  const [state, dispatch] = useReducer(gameReducer, gameInitialState);

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

  useInterval(() => gameLoop(), snake.speed);

  const winGame = useCallback(() => {
    alert('You won! Now you are real ANACONDA!');
    dispatch(startGame());
  }, []);

  const moveSnake = useCallback(({ keyCode }) => {
    if (keyCode === 32) return gameIsPaused ? dispatch(resumeGame()) : dispatch(pauseGame());

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
    dispatch(pauseGame());
  }, []);

  const dispatchResumeGame = useCallback(() => {
    dispatch(resumeGame());
  }, []);

  useEffect(() => {
    if (gameIsRunning) canvasRef.current.focus();
  }, [gameIsRunning, gameIsPaused]);

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = 'green';
    snake.position.forEach(({ x, y }) => context.fillRect(x, y, 1, 1));
    context.fillStyle = 'red';
    context.fillRect(applePosition.x, applePosition.y, 1, 1);
  }, [snake.position, applePosition.x, applePosition.y, gameIsOver]);

  return (
    <div>
      {gameIsOver && <div>GAME OVER!</div>}
      <canvas
        tabIndex={0}
        onKeyDown={moveSnake}
        style={{
          border: '1px solid black',
          opacity: gameIsRunning ? 1 : 0,
        }}
        ref={canvasRef}
        width={`${CANVAS_SIZE.width}px`}
        height={`${CANVAS_SIZE.height}px`}
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
