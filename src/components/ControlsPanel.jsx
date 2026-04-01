const FONTS = [
  { label: 'Press Start 2P (pixel)', value: 'Press Start 2P' },
  { label: 'VT323 (retro terminal)', value: 'VT323' },
  { label: 'Silkscreen (pixel limpio)', value: 'Silkscreen' },
  { label: 'Dancing Script (caligrafía)', value: 'Dancing Script' },
  { label: 'Pacifico (redondeada)', value: 'Pacifico' },
  { label: 'Lobster (negrita cursiva)', value: 'Lobster' },
  { label: 'Arial (sistema)', value: 'Arial' },
  { label: 'Georgia (sistema serif)', value: 'Georgia' },
  { label: 'Courier New (monoespaciada)', value: 'Courier New' },
];

const PRESET_COLORS = [
  '#e94560', // rojo carmesí
  '#f5a623', // naranja
  '#f8e71c', // amarillo
  '#7ed321', // verde
  '#4a90e2', // azul
  '#bd10e0', // violeta
  '#ffffff', // blanco
  '#000000', // negro
];

/**
 * Panel de controles inferior.
 *
 * Props:
 *  - text, font, gridW, gridH, color: valores actuales
 *  - onTextChange, onFontChange, onGridWChange, onGridHChange, onColorChange: callbacks
 */
export default function ControlsPanel({
  text, font, gridW, gridH, color,
  onTextChange, onFontChange, onGridWChange, onGridHChange, onColorChange,
}) {
  return (
    <div className="controls-panel">
      <div className="panel-handle">
        <div className="panel-handle-bar" />
      </div>

      <div className="panel-scroll">

        {/* ─── Texto ─── */}
        <div className="field-group">
          <label className="field-label">Texto</label>
          <textarea
            className="input-text"
            value={text}
            onChange={e => onTextChange(e.target.value)}
            placeholder="Escribe aquí tu patrón…"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>

        {/* ─── Fuente ─── */}
        <div className="field-group">
          <label className="field-label">Fuente</label>
          <select
            className="input-select"
            value={font}
            onChange={e => onFontChange(e.target.value)}
            style={{ fontFamily: `"${font}", sans-serif` }}
          >
            {FONTS.map(f => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* ─── Resolución de la malla ─── */}
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Ancho (celdas)</label>
            <input
              type="number"
              className="input-number"
              value={gridW}
              min={10}
              max={200}
              onChange={e => {
                const v = Math.min(200, Math.max(10, Number(e.target.value) || 10));
                onGridWChange(v);
              }}
            />
          </div>
          <div className="field-group">
            <label className="field-label">Alto (celdas)</label>
            <input
              type="number"
              className="input-number"
              value={gridH}
              min={10}
              max={200}
              onChange={e => {
                const v = Math.min(200, Math.max(10, Number(e.target.value) || 10));
                onGridHChange(v);
              }}
            />
          </div>
        </div>

        {/* ─── Color del hilo ─── */}
        <div className="field-group">
          <label className="field-label">Color del hilo</label>
          <div className="color-row">
            {/* Selector de color nativo */}
            <input
              type="color"
              className="input-color"
              value={color}
              onChange={e => onColorChange(e.target.value)}
              title="Color personalizado"
            />
            {/* Paleta de colores predefinidos */}
            <div className="color-swatch-group">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  className={`color-swatch${color.toLowerCase() === c.toLowerCase() ? ' selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => onColorChange(c)}
                  aria-label={`Color ${c}`}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
