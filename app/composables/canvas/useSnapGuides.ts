import type Konva from 'konva';
import type { SnapGuidesState } from '~/types/canvas-editor';
import { CANVAS_CONFIG } from './useCanvasConfig';
import { useCanvasEditorStore } from '~/stores/canvasEditor';

/**
 * Composable for managing snap guides during drag and transform operations
 */
export function useSnapGuides() {
  const store = useCanvasEditorStore();
  const { snap } = CANVAS_CONFIG;

  const guides = ref<SnapGuidesState>({
    horizontal: false,
    vertical: false,
    left: false,
    right: false,
    top: false,
    bottom: false,
  });

  const clearGuides = () => {
    guides.value = {
      horizontal: false,
      vertical: false,
      left: false,
      right: false,
      top: false,
      bottom: false,
    };
  };

  /**
   * Check if a value is within snap threshold of a target
   */
  const isNear = (value: number, target: number) => Math.abs(value - target) < snap.threshold;

  /**
   * Get canvas dimensions and margins
   */
  const getCanvasMetrics = () => {
    const width = store.stageConfig.width;
    const height = store.stageConfig.height;
    return {
      width,
      height,
      centerX: width / 2,
      centerY: height / 2,
      leftMargin: snap.edgeMargin,
      topMargin: snap.edgeMargin,
      rightMargin: width - snap.edgeMargin,
      bottomMargin: height - snap.edgeMargin,
      availableWidth: width - snap.edgeMargin * 2,
      availableHeight: height - snap.edgeMargin * 2,
    };
  };

  /**
   * Snap node position during drag. Skips snapping for large objects to prevent shaking.
   */
  const snapNode = (node: Konva.Node) => {
    const box = node.getClientRect();
    const canvas = getCanvasMetrics();
    const nodeOffset = { x: node.x() - box.x, y: node.y() - box.y };

    clearGuides();

    // Skip snapping if object spans most of canvas (prevents shaking)
    const skipHorizontal = box.width > canvas.availableWidth * 0.8;
    const skipVertical = box.height > canvas.availableHeight * 0.8;

    // Horizontal snapping
    if (!skipHorizontal) {
      const centerX = box.x + box.width / 2;
      const rightEdge = box.x + box.width;

      if (isNear(centerX, canvas.centerX)) {
        node.x(canvas.centerX - box.width / 2 + nodeOffset.x);
        guides.value.vertical = true;
      }
      else if (isNear(box.x, canvas.leftMargin)) {
        node.x(canvas.leftMargin + nodeOffset.x);
        guides.value.left = true;
      }
      else if (isNear(rightEdge, canvas.rightMargin)) {
        node.x(canvas.rightMargin - box.width + nodeOffset.x);
        guides.value.right = true;
      }
    }

    // Vertical snapping
    if (!skipVertical) {
      const centerY = box.y + box.height / 2;
      const bottomEdge = box.y + box.height;

      if (isNear(centerY, canvas.centerY)) {
        node.y(canvas.centerY - box.height / 2 + nodeOffset.y);
        guides.value.horizontal = true;
      }
      else if (isNear(box.y, canvas.topMargin)) {
        node.y(canvas.topMargin + nodeOffset.y);
        guides.value.top = true;
      }
      else if (isNear(bottomEdge, canvas.bottomMargin)) {
        node.y(canvas.bottomMargin - box.height + nodeOffset.y);
        guides.value.bottom = true;
      }
    }
  };

  /**
   * Show snap guides during transform (visual feedback only, no position changes)
   */
  const showTransformGuides = (node: Konva.Node): void => {
    const box = node.getClientRect();
    const canvas = getCanvasMetrics();

    clearGuides();

    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const rightEdge = box.x + box.width;
    const bottomEdge = box.y + box.height;

    // Edge guides
    if (isNear(box.x, canvas.leftMargin)) guides.value.left = true;
    if (isNear(box.y, canvas.topMargin)) guides.value.top = true;
    if (isNear(rightEdge, canvas.rightMargin)) guides.value.right = true;
    if (isNear(bottomEdge, canvas.bottomMargin)) guides.value.bottom = true;

    // Center guides
    if (isNear(centerX, canvas.centerX)) guides.value.vertical = true;
    if (isNear(centerY, canvas.centerY)) guides.value.horizontal = true;
  };

  /**
   * Constrain node dimensions to canvas bounds during transform
   */
  const constrainToCanvas = (
    node: Konva.Node,
    newWidth: number,
    newHeight: number,
  ): { width: number; height: number } => {
    const canvas = getCanvasMetrics();
    const box = node.getClientRect();
    const offset = { x: box.x - node.x(), y: box.y - node.y() };

    return {
      width: Math.min(newWidth, canvas.width - node.x() - offset.x),
      height: Math.min(newHeight, canvas.height - node.y() - offset.y),
    };
  };

  /**
   * Guide line configurations for Konva rendering
   */
  const getGuideLineConfigs = computed(() => {
    const canvas = getCanvasMetrics();
    const baseConfig = { strokeWidth: 1, dash: [4, 4], listening: false };

    return {
      horizontal: {
        ...baseConfig,
        points: [0, canvas.centerY, canvas.width, canvas.centerY],
        stroke: '#0099ff',
      },
      vertical: {
        ...baseConfig,
        points: [canvas.centerX, 0, canvas.centerX, canvas.height],
        stroke: '#0099ff',
      },
      left: {
        ...baseConfig,
        points: [canvas.leftMargin, 0, canvas.leftMargin, canvas.height],
        stroke: '#10b981',
      },
      right: {
        ...baseConfig,
        points: [canvas.rightMargin, 0, canvas.rightMargin, canvas.height],
        stroke: '#10b981',
      },
      top: {
        ...baseConfig,
        points: [0, canvas.topMargin, canvas.width, canvas.topMargin],
        stroke: '#10b981',
      },
      bottom: {
        ...baseConfig,
        points: [0, canvas.bottomMargin, canvas.width, canvas.bottomMargin],
        stroke: '#10b981',
      },
    };
  });

  return {
    guides,
    snapNode,
    clearGuides,
    showTransformGuides,
    constrainToCanvas,
    getGuideLineConfigs,
    edgeMargin: snap.edgeMargin,
    threshold: snap.threshold,
  };
}
