import { useCanvasEditorStore } from '~/stores/canvasEditor';

/**
 * Composable for managing canvas view mode and scaling
 * Uses the canvas editor store for state
 */
export function useCanvasView() {
  const store = useCanvasEditorStore();

  // Container size state (local to this composable instance)
  const containerSize = ref({ width: 0, height: 0 });

  // ResizeObserver instance
  let resizeObserver: ResizeObserver | null = null;

  /**
   * Scale factor for fit mode
   * Accounts for padding and ensures canvas fits within container
   */
  const scaleFactor = computed(() => {
    if (store.viewMode === 'actual' || containerSize.value.width === 0) {
      return 1;
    }
    // Account for padding (p-3 = 12px on each side = 24px total)
    const padding = 24;
    const availableWidth = containerSize.value.width - padding;
    const availableHeight = containerSize.value.height - padding;
    const scaleX = availableWidth / store.stageConfig.width;
    const scaleY = availableHeight / store.stageConfig.height;
    // Never scale up, only down
    return Math.min(scaleX, scaleY, 1);
  });

  /**
   * Style for the stage wrapper element
   */
  const stageWrapperStyle = computed(() => {
    if (store.viewMode === 'actual') {
      return {
        width: `${store.stageConfig.width}px`,
        height: `${store.stageConfig.height}px`,
      };
    }
    return {
      width: `${store.stageConfig.width * scaleFactor.value}px`,
      height: `${store.stageConfig.height * scaleFactor.value}px`,
    };
  });

  /**
   * Style for scaling the stage canvas
   */
  const stageScaleStyle = computed(() => {
    if (store.viewMode === 'actual') {
      return {};
    }
    return {
      transform: `scale(${scaleFactor.value})`,
      transformOrigin: 'top left',
    };
  });

  /**
   * Initialize ResizeObserver on container element
   */
  const initResizeObserver = (containerRef: Ref<HTMLElement | null>) => {
    if (containerRef.value) {
      // Initial size
      containerSize.value = {
        width: containerRef.value.clientWidth,
        height: containerRef.value.clientHeight,
      };

      // Watch for resize
      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          containerSize.value = {
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          };
        }
      });
      resizeObserver.observe(containerRef.value);
    }
  };

  /**
   * Cleanup ResizeObserver
   */
  const destroyResizeObserver = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };

  return {
    containerSize,
    scaleFactor,
    stageWrapperStyle,
    stageScaleStyle,
    initResizeObserver,
    destroyResizeObserver,
  };
}
