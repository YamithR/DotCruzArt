/**
 * textToGrid — convierte texto a una malla booleana de punto cruz.
 * Usa un <canvas> DOM oculto para máxima compatibilidad (sin OffscreenCanvas).
 *
 * @param {object} options
 * @param {string}  options.text       — Texto a renderizar
 * @param {string}  options.font       — Nombre de familia de fuente (ej. "Press Start 2P")
 * @param {number}  options.gridW      — Ancho de la malla en celdas
 * @param {number}  options.gridH      — Alto de la malla en celdas
 * @param {number}  [options.threshold=128] — Alpha mínimo para considerar celda activa (0-255)
 * @returns {boolean[][]}
 */
export function textToGrid({ text, font, gridW, gridH, threshold = 128 }) {
  const empty = () => Array.from({ length: gridH }, () => new Array(gridW).fill(false));

  if (!text || !text.trim()) return empty();

  // Canvas DOM regular — máxima compatibilidad de navegador
  const canvas = document.createElement('canvas');
  canvas.width  = gridW;
  canvas.height = gridH;

  const ctx = canvas.getContext('2d');
  if (!ctx) return empty();

  ctx.clearRect(0, 0, gridW, gridH);

  const safeText = text.trim();

  // ─── Bisección para encontrar el font-size óptimo ───────────────────
  const maxW = gridW * 0.95;
  const maxH = gridH * 0.85;
  let lo = 1;
  let hi = Math.max(gridH * 2, 200);
  let bestSize = 4;

  for (let iter = 0; iter < 20; iter++) {
    const mid = Math.floor((lo + hi) / 2);
    ctx.font = `${mid}px "${font}", sans-serif`;
    const textW = ctx.measureText(safeText).width;
    if (textW <= maxW && mid <= maxH) {
      bestSize = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  // ─── Dibujar texto centrado ──────────────────────────────────────────
  ctx.font = `${bestSize}px "${font}", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = safeText.split('\n');
  if (lines.length === 1) {
    ctx.fillText(safeText, gridW / 2, gridH / 2);
  } else {
    const lineH = bestSize * 1.2;
    const totalH = lineH * lines.length;
    const startY = (gridH - totalH) / 2 + bestSize * 0.5;
    lines.forEach((line, i) => {
      ctx.fillText(line, gridW / 2, startY + i * lineH);
    });
  }

  // ─── Leer píxeles → matriz booleana ─────────────────────────────────
  const { data } = ctx.getImageData(0, 0, gridW, gridH);
  const matrix = [];

  for (let row = 0; row < gridH; row++) {
    const rowArr = new Array(gridW);
    for (let col = 0; col < gridW; col++) {
      const alpha = data[(row * gridW + col) * 4 + 3];
      rowArr[col] = alpha > threshold;
    }
    matrix.push(rowArr);
  }

  return matrix;
}
