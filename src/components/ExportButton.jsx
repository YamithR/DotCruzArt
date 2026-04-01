/**
 * ExportButton — descarga el canvas de GridPreview como PNG.
 *
 * Props:
 *  - canvasRef: ref del canvas a exportar
 *  - filename: nombre sugerido para la descarga (sin extensión)
 */
export default function ExportButton({ canvasRef, filename = 'patron-punto-cruz' }) {
  function handleExport() {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${filename}.png`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Puede fallar si el canvas está tainted (cross-origin fonts) — informar al usuario
      alert('No se pudo exportar: asegúrate de que las fuentes estés cargadas antes de exportar.');
    }
  }

  return (
    <button className="btn-export" onClick={handleExport} title="Descargar patrón como PNG">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Exportar PNG
    </button>
  );
}
