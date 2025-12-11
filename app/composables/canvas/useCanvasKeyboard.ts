import { useCanvasEditorStore } from '~/stores/canvasEditor';
import type { ArrowDirection } from '~/types/canvas-editor';

/**
 * Composable for handling keyboard interactions in the canvas
 * Uses the canvas editor store for state and actions
 */
export function useCanvasKeyboard(isEditing: Ref<boolean>) {
  const store = useCanvasEditorStore();

  /**
   * Handle keydown events for canvas interactions
   */
  const handleKeydown = (e: KeyboardEvent) => {
    // Skip if currently editing text
    if (isEditing.value) return;

    // Delete/Backspace - delete selected element
    if ((e.key === 'Delete' || e.key === 'Backspace') && store.selectedId) {
      e.preventDefault();
      store.deleteSelectedItem();
      return;
    }

    // Ctrl+D / Cmd+D - duplicate selected element
    if ((e.ctrlKey || e.metaKey) && e.key === 'd' && store.selectedId) {
      e.preventDefault();
      store.cloneSelectedItem();
      return;
    }

    // Arrow keys - nudge selected element
    const arrowKeys: ArrowDirection[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (arrowKeys.includes(e.key as ArrowDirection) && store.selectedId) {
      e.preventDefault();
      const nudgeAmount = e.shiftKey ? 10 : 1;
      store.nudgeItem(e.key as ArrowDirection, nudgeAmount);
    }
  };

  /**
   * Calculate delta for nudge direction
   */
  const getNudgeDelta = (direction: ArrowDirection, amount: number) => {
    switch (direction) {
      case 'ArrowUp':
        return { deltaX: 0, deltaY: -amount };
      case 'ArrowDown':
        return { deltaX: 0, deltaY: amount };
      case 'ArrowLeft':
        return { deltaX: -amount, deltaY: 0 };
      case 'ArrowRight':
        return { deltaX: amount, deltaY: 0 };
    }
  };

  return {
    handleKeydown,
    getNudgeDelta,
  };
}
