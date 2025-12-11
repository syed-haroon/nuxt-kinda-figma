import { useCanvasEditorStore } from '~/stores/canvasEditor';

/**
 * Composable for exporting canvas as image
 * Uses the canvas editor store for state
 */
export function useCanvasExport() {
  const store = useCanvasEditorStore();

  /**
   * Export canvas as PNG image
   */
  const exportCanvas = async (
    filename = 'canvas-export.png',
    pixelRatio = 2,
  ) => {
    const stage = store.stageRef?.getNode();
    if (!stage) return;

    // Store current selection
    const prevSelected = store.selectedId;

    // Deselect to hide transformer during export
    store.setSelectedId(null);
    store.updateTransformer();

    // Wait for next tick to ensure UI updates
    await nextTick();

    // Generate data URL and trigger download
    const dataUrl = stage.toDataURL({ pixelRatio });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();

    // Restore selection
    store.setSelectedId(prevSelected);
    store.updateTransformer();
  };

  /**
   * Get canvas as data URL without downloading
   */
  const getCanvasDataUrl = async (pixelRatio = 2): Promise<string | null> => {
    const stage = store.stageRef?.getNode();
    if (!stage) return null;

    // Store current selection
    const prevSelected = store.selectedId;

    // Deselect to hide transformer
    store.setSelectedId(null);
    store.updateTransformer();

    await nextTick();

    const dataUrl = stage.toDataURL({ pixelRatio });

    // Restore selection
    store.setSelectedId(prevSelected);
    store.updateTransformer();

    return dataUrl;
  };

  /**
   * Get canvas as Blob
   */
  const getCanvasBlob = async (pixelRatio = 2): Promise<Blob | null> => {
    const dataUrl = await getCanvasDataUrl(pixelRatio);
    if (!dataUrl) return null;

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    return response.blob();
  };

  return {
    exportCanvas,
    getCanvasDataUrl,
    getCanvasBlob,
  };
}
