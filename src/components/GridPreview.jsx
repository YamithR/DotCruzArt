import { useEffect, useRef, useCallback } from 'react';

const CELL_COLOR_EMPTY = 'rgba(255,255,255,0.04)';
const GRID_LINE_COLOR  = 'rgba(255,255,255,0.07)';

export default function GridPreview({ matrix, color, gridW, gridH, canvasRef }) {
  const localRef = useRef(null);
  const resolvedRef = canvasRef || localRef;

  const draw = useCallback(() => {
    const canvas = resolvedRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const containerW = parent ? parent.clientWidth  : 300;
    const containerH = parent ? parent.clientHeight : 300;

    if (containerW === 0 || containerH === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const cellByW = Math.floor(containerW / gridW);
    const cellByH = Math.floor(containerH / gridH);
    const cellSize = Math.max(2, Math.min(cellByW, cellByH));

    const drawW = cellSize * gridW;
    const drawH = cellSize * gridH;

    canvas.width  = drawW * dpr;
    canvas.height = drawH * dpr;
    canvas.style.width  = `${drawW}px`;
    canvas.style.height = `${drawH}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Fondo
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, drawW, drawH);

    const hasMatrix = matrix && matrix.length > 0;

    // Celdas
    for (let row = 0; row < gridH; row++) {
      for (let col = 0; col < gridW; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        const active = hasMatrix && matrix[row] && matrix[row][col];

        if (active) {
          ctx.fillStyle = color;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          if (cellSize >= 6) {
            const pad = Math.max(1, Math.floor(cellSize * 0.15));
            ctx.strokeStyle = 'rgba(0,0,0,0.45)';
            ctx.lineWidth = Math.max(1, cellSize * 0.12);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x + pad,            y + pad);
            ctx.lineTo(x + cellSize - pad, y + cellSize - pad);
            ctx.moveTo(x + cellSize - pad, y + pad);
            ctx.lineTo(x + pad,            y + cellSize - pad);
            ctx.stroke();
          }
        } else {
          ctx.fillStyle = CELL_COLOR_EMPTY;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        }
      }
    }

    // Líneas de cuadrícula
    if (cellSize >= 5) {
      ctx.strokeStyle = GRID_LINE_COLOR;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let col = 0; col <= gridW; col++) {
        ctx.moveTo(col * cellSize, 0);
        ctx.lineTo(col * cellSize, drawH);
      }
      for (let row = 0; row <= gridH; row++) {
        ctx.moveTo(0, row * cellSize);
        ctx.lineTo(drawW, row * cellSize);
      }
      ctx.stroke();
    }
  }, [matrix, color, gridW, gridH, resolvedRef]);

  // Redibujar cuando cambian los datos
  useEffect(() => {
    draw();
  }, [draw]);

  // Redibujar cuando el contenedor cambia de tamaño (ResizeObserver)
  useEffect(() => {
    const canvas = resolvedRef.current;
    if (!canvas || !canvas.parentElement) return;

    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, [draw, resolvedRef]);

  return <canvas ref={resolvedRef} className="grid-canvas" />;
}
