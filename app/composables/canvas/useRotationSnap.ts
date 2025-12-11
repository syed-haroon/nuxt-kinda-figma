import { CANVAS_CONFIG } from './useCanvasConfig';

/**
 * Composable for managing rotation snapping behavior
 */
export function useRotationSnap() {
  const { rotation } = CANVAS_CONFIG;

  // Track if shift key is held
  const isShiftHeld = ref(false);

  // Event handler references for cleanup
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  let keyupHandler: ((e: KeyboardEvent) => void) | null = null;

  /**
   * Setup keyboard listeners for shift key tracking
   */
  const setupKeyListeners = () => {
    if (typeof window === 'undefined') return;

    keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Shift') isShiftHeld.value = true;
    };

    keyupHandler = (e: KeyboardEvent) => {
      if (e.key === 'Shift') isShiftHeld.value = false;
    };

    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
  };

  /**
   * Cleanup keyboard listeners
   */
  const destroyKeyListeners = () => {
    if (typeof window === 'undefined') return;

    if (keydownHandler) {
      window.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
    if (keyupHandler) {
      window.removeEventListener('keyup', keyupHandler);
      keyupHandler = null;
    }
  };

  /**
   * Snap rotation angle to nearest configured angle
   * Only applies when shift is held
   */
  const snapRotation = (angle: number): number => {
    if (!isShiftHeld.value) return angle;

    // Find the closest snap angle
    const snappedRotation = rotation.snapAngles.reduce((prev, curr) => {
      return Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev;
    });

    // Only snap if within threshold
    if (Math.abs(angle - snappedRotation) < rotation.snapThreshold) {
      // Normalize 360 to 0
      return snappedRotation === 360 ? 0 : snappedRotation;
    }

    return angle;
  };

  /**
   * Check if current rotation should snap
   */
  const shouldSnap = computed(() => isShiftHeld.value);

  return {
    isShiftHeld: readonly(isShiftHeld),
    shouldSnap,
    snapRotation,
    setupKeyListeners,
    destroyKeyListeners,
    snapAngles: rotation.snapAngles,
    snapThreshold: rotation.snapThreshold,
  };
}
