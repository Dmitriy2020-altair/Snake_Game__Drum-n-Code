import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import useInterval from './helper';
// import StartButton from './components/Start_Button';

import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
  SPEED_UP,
} from './constants';

const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useInterval(() => gameLoop(), speed);

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
    setScore(0);
  };

  const overGame = () => {
    setSpeed(null);
    setGameOver(true);
  };

  const winGame = () => {
    const winMessage = 'You won! Now you are real ANACONDA!';

    alert(winMessage);
    startGame();
  };

  const moveSnake = ({ keyCode }) => keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);

  const createApple = () => apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece, snk = snake) => {
    if (piece[0] * SCALE >= CANVAS_SIZE[0] || piece[0] < 0 || piece[1] * SCALE >= CANVAS_SIZE[1] || piece[1] < 0) return true;

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      let speedUp = speed - SPEED_UP;

      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      setSpeed(() => speedUp);
      setScore(() => score + 1);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) overGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
    if (score === 3) winGame();
  };

  useEffect(() => {
    const context = canvasRef.current.getContext('2d');
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = 'green';
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = 'red';
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  return (
    <div role="button" tabIndex="0" onKeyDown={(e) => moveSnake(e)}>
      <canvas
        style={{ border: '1px solid black' }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div>GAME OVER!</div>}
      <button onClick={startGame}>Start Game</button>
      <div>{ `Score: ${score}` }</div>
    </div>
  );
};

export default App;
