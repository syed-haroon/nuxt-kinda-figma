import type Konva from 'konva';
import type { TransformerBox } from '~/types/canvas-editor';
import { useCanvasEditorStore } from '~/stores/canvasEditor';

/**
 * Calculate corner position after rotation
 */
function getCorner(
  pivotX: number,
  pivotY: number,
  diffX: number,
  diffY: number,
  angle: number,
) {
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);
  const newAngle = angle + Math.atan2(diffY, diffX);
  return {
    x: pivotX + distance * Math.cos(newAngle),
    y: pivotY + distance * Math.sin(newAngle),
  };
}

/**
 * Get axis-aligned bounding box for a rotated rectangle
 */
function getClientRect(rotatedBox: TransformerBox) {
  const { x, y, width, height } = rotatedBox;
  const rad = (rotatedBox.rotation || 0) * (Math.PI / 180);

  const p1 = getCorner(x, y, 0, 0, rad);
  const p2 = getCorner(x, y, width, 0, rad);
  const p3 = getCorner(x, y, width, height, rad);
  const p4 = getCorner(x, y, 0, height, rad);

  const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
  const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
  const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
  const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Composable for managing canvas bounds and constraining elements
 * Uses the canvas editor store for state
 */
export function useCanvasBounds() {
  const store = useCanvasEditorStore();

  /**
   * Check if a bounding box is within canvas boundaries
   */
  const isWithinBounds = (box: { x: number; y: number; width: number; height: number }): boolean => {
    return (
      box.x >= 0
      && box.y >= 0
      && box.x + box.width <= store.stageConfig.width
      && box.y + box.height <= store.stageConfig.height
    );
  };

  /**
   * Creates a bound box function for the transformer
   * Limits resizing to keep elements within canvas boundaries
   * Snaps to exact edges when within tolerance
   */
  const createBoundBoxFunc = () => {
    const SNAP_THRESHOLD = 2; // Snap to edge when within 2px

    return (oldBox: TransformerBox, newBox: TransformerBox): TransformerBox => {
      const box = getClientRect(newBox);
      const canvasWidth = store.stageConfig.width;
      const canvasHeight = store.stageConfig.height;

      // Check if truly out of bounds (beyond snap threshold)
      const isOut
        = box.x < -SNAP_THRESHOLD
          || box.y < -SNAP_THRESHOLD
          || box.x + box.width > canvasWidth + SNAP_THRESHOLD
          || box.y + box.height > canvasHeight + SNAP_THRESHOLD;

      if (isOut) {
        return oldBox;
      }

      // Snap edges to canvas bounds when close
      const snappedBox = { ...newBox };

      // Snap left edge to 0
      if (box.x >= -SNAP_THRESHOLD && box.x <= SNAP_THRESHOLD && box.x !== 0) {
        snappedBox.x = newBox.x - box.x; // Adjust by the difference
      }

      // Snap top edge to 0
      if (box.y >= -SNAP_THRESHOLD && box.y <= SNAP_THRESHOLD && box.y !== 0) {
        snappedBox.y = newBox.y - box.y;
      }

      // Snap right edge to canvas width
      const rightEdge = box.x + box.width;
      if (rightEdge >= canvasWidth - SNAP_THRESHOLD && rightEdge <= canvasWidth + SNAP_THRESHOLD) {
        const diff = canvasWidth - rightEdge;
        snappedBox.width = newBox.width + diff;
      }

      // Snap bottom edge to canvas height
      const bottomEdge = box.y + box.height;
      if (bottomEdge >= canvasHeight - SNAP_THRESHOLD && bottomEdge <= canvasHeight + SNAP_THRESHOLD) {
        const diff = canvasHeight - bottomEdge;
        snappedBox.height = newBox.height + diff;
      }

      return snappedBox;
    };
  };

  /**
   * Creates a drag bound function for individual shapes
   * Limits dragging to keep elements within canvas boundaries
   */
  const createDragBoundFunc = () => {
    return (pos: { x: number; y: number }) => {
      const node = store.stageRef?.getNode().findOne(`.${store.selectedId}`) as Konva.Node | undefined;
      if (!node) return pos;

      const box = node.getClientRect();
      const nodeWidth = box.width;
      const nodeHeight = box.height;

      // Calculate offset from node position to bounding box
      const offsetX = box.x - node.x();
      const offsetY = box.y - node.y();

      let newX = pos.x;
      let newY = pos.y;

      // Constrain to canvas boundaries
      if (pos.x + offsetX < 0) {
        newX = -offsetX;
      }
      if (pos.y + offsetY < 0) {
        newY = -offsetY;
      }
      if (pos.x + offsetX + nodeWidth > store.stageConfig.width) {
        newX = store.stageConfig.width - nodeWidth - offsetX;
      }
      if (pos.y + offsetY + nodeHeight > store.stageConfig.height) {
        newY = store.stageConfig.height - nodeHeight - offsetY;
      }

      return { x: newX, y: newY };
    };
  };

  /**
   * Constrain a node's transform to stay within canvas bounds
   * Returns the constrained scale factors
   */
  const constrainTransform = (node: Konva.Node): { scaleX: number; scaleY: number; constrained: boolean } => {
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const box = node.getClientRect();

    let newScaleX = scaleX;
    let newScaleY = scaleY;
    let constrained = false;

    // Check if out of bounds
    if (box.x < 0) {
      // Left edge overflow - calculate max allowed width
      const maxWidth = box.width + box.x;
      newScaleX = (maxWidth / node.width()) * Math.sign(scaleX) || scaleX;
      constrained = true;
    }

    if (box.y < 0) {
      // Top edge overflow
      const maxHeight = box.height + box.y;
      newScaleY = (maxHeight / node.height()) * Math.sign(scaleY) || scaleY;
      constrained = true;
    }

    if (box.x + box.width > store.stageConfig.width) {
      // Right edge overflow
      const maxWidth = store.stageConfig.width - box.x;
      const currentWidth = node.width() * Math.abs(scaleX);
      if (currentWidth > maxWidth) {
        newScaleX = (maxWidth / node.width()) * Math.sign(scaleX) || scaleX;
        constrained = true;
      }
    }

    if (box.y + box.height > store.stageConfig.height) {
      // Bottom edge overflow
      const maxHeight = store.stageConfig.height - box.y;
      const currentHeight = node.height() * Math.abs(scaleY);
      if (currentHeight > maxHeight) {
        newScaleY = (maxHeight / node.height()) * Math.sign(scaleY) || scaleY;
        constrained = true;
      }
    }

    return { scaleX: newScaleX, scaleY: newScaleY, constrained };
  };

  /**
   * Check if a node is within canvas bounds
   */
  const isNodeWithinBounds = (node: Konva.Node): boolean => {
    const box = node.getClientRect();
    return isWithinBounds(box);
  };

  /**
   * Get the maximum allowed dimensions for a node at its current position
   */
  const getMaxDimensions = (node: Konva.Node): { maxWidth: number; maxHeight: number } => {
    const box = node.getClientRect();
    const offsetX = box.x - node.x();
    const offsetY = box.y - node.y();

    return {
      maxWidth: store.stageConfig.width - node.x() - offsetX,
      maxHeight: store.stageConfig.height - node.y() - offsetY,
    };
  };

  return {
    getCorner,
    getClientRect,
    isWithinBounds,
    isNodeWithinBounds,
    createBoundBoxFunc,
    createDragBoundFunc,
    constrainTransform,
    getMaxDimensions,
  };
}
