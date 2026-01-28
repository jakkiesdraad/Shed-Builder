import { useEffect, useRef } from 'react';
import { initScene } from './canvas/Scene';
import SidePanel from './ui/SidePanel';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const cleanup = initScene(canvasRef.current);
    return () => cleanup();
  }, []);

  return (
    <div className="app">
      <SidePanel />
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default App;
