import { useEffect, useRef } from 'react';
import { CANVAS_SIZE, SCALE } from '../constants';

const GameScene = ({ applePosition, snake, gameIsOver }) => {
  const canvasRef = useRef(null);

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
    <div className="paper">
      <canvas
        ref={canvasRef}
        className="game-scene"
        width={`${CANVAS_SIZE.width}px`}
        height={`${CANVAS_SIZE.height}px`}
      />
    </div>
  );
};

export default GameScene;
