import { useState, useEffect, useRef } from 'react';
import './App.css';
import { textToGrid } from './utils/textToGrid';
import GridPreview from './components/GridPreview';
import ControlsPanel from './components/ControlsPanel';
import ExportButton from './components/ExportButton';

const DEFAULT_STATE = {
  text:  'ABC',
  font:  'Press Start 2P',
  gridW: 60,
  gridH: 30,
  color: '#e94560',
};

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function App() {
  const [text,  setText]  = useState(DEFAULT_STATE.text);
  const [font,  setFont]  = useState(DEFAULT_STATE.font);
  const [gridW, setGridW] = useState(DEFAULT_STATE.gridW);
  const [gridH, setGridH] = useState(DEFAULT_STATE.gridH);
  const [color, setColor] = useState(DEFAULT_STATE.color);
  const [matrix, setMatrix] = useState([]);

  const canvasRef = useRef(null);

  // Debounce para no recalcular con cada keypress
  const debouncedText  = useDebounce(text,  300);
  const debouncedFont  = useDebounce(font,  200);
  const debouncedGridW = useDebounce(gridW, 300);
  const debouncedGridH = useDebounce(gridH, 300);

  // Re-calcular la malla — sin guardar de fuentes: calcula de inmediato
  // y vuelve a calcular cuando las Google Fonts terminan de cargar
  useEffect(() => {
    function compute() {
      const m = textToGrid({
        text: debouncedText,
        font: debouncedFont,
        gridW: debouncedGridW,
        gridH: debouncedGridH,
      });
      setMatrix(m);
    }

    compute();

    // También recalcula cuando las fuentes terminan de cargar
    // (por si la Google Font aún no estaba disponible la primera vez)
    const handleFontLoad = () => compute();
    document.fonts.addEventListener('loadingdone', handleFontLoad);
    return () => document.fonts.removeEventListener('loadingdone', handleFontLoad);
  }, [debouncedText, debouncedFont, debouncedGridW, debouncedGridH]);

  const hasText = text.trim().length > 0;

  return (
    <>
      {/* ─── Header ─── */}
      <header className="app-header">
        <div className="app-logo">
          <span className="accent">✕</span> DotCruz<span className="accent">Art</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="resolution-badge">{gridW}×{gridH}</span>
          <ExportButton canvasRef={canvasRef} filename={`dotcruzart-${gridW}x${gridH}`} />
        </div>
      </header>

      {/* ─── Canvas / Preview ─── */}
      <main className="canvas-wrapper">
        {hasText ? (
          <GridPreview
            matrix={matrix}
            color={color}
            gridW={gridW}
            gridH={gridH}
            canvasRef={canvasRef}
          />
        ) : (
          <div className="canvas-placeholder">
            <span className="icon">✕</span>
            <p>Escribe algo en el panel de abajo para ver tu patrón de punto cruz</p>
          </div>
        )}
      </main>

      {/* ─── Controls ─── */}
      <ControlsPanel
        text={text}
        font={font}
        gridW={gridW}
        gridH={gridH}
        color={color}
        onTextChange={setText}
        onFontChange={setFont}
        onGridWChange={setGridW}
        onGridHChange={setGridH}
        onColorChange={setColor}
      />
    </>
  );
}
