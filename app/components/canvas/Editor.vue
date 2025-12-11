<template>
  <app-content>
    <template #top-bar>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">
          Canvas Editor
        </h2>
        <ui-button
          size="sm"
          @click="handleExport"
        >
          <icon
            name="lucide:download"
            class="w-4 h-4 mr-1"
          />
          Export
        </ui-button>
      </div>
    </template>

    <template #drawer>
      <div class="flex flex-col p-4 overflow-y-auto flex-1">
        <div class="flex-1">
          <!-- Canvas Settings -->
          <canvas-settings-panel class="mb-5" />

          <!-- Arrange Controls -->
          <canvas-arrange-panel v-if="store.selectedId" />

          <!-- Property Inspector -->
          <canvas-property-inspector v-if="store.selectedId" />

          <!-- No Selection State -->
          <canvas-no-selection-info v-else />
        </div>

        <!-- Debug Panel -->
        <canvas-debug-panel />
      </div>
    </template>

    <div class="absolute inset-0">
      <!-- Canvas Container -->
      <div
        ref="stageContainerRef"
        class="absolute inset-0 rounded-xl shadow bg-slate-50 p-3 overflow-auto"
        tabindex="0"
        @keydown="handleKeydown"
      >
        <div class="grid place-items-center min-w-full min-h-full">
          <div
            ref="stageWrapperRef"
            :style="canvasView.stageWrapperStyle.value"
          >
            <v-stage
              ref="stageRef"
              :config="store.stageConfig"
              class="shadow-lg"
              :style="canvasView.stageScaleStyle.value"
              @mousedown="handleStageMouseDown"
              @touchstart="handleStageMouseDown"
            >
              <v-layer ref="layerRef">
                <!-- Background -->
                <v-rect :config="store.backgroundRectConfig" />

                <!-- All Items -->
                <template
                  v-for="item in store.sortedItems"
                  :key="item.id"
                >
                  <v-text
                    v-if="item.type === 'text'"
                    :config="getTextConfig(item)"
                    @dblclick="handleTextDblClick"
                    @dbltap="handleTextDblClick"
                    @dragmove="handleDragMove"
                    @dragend="handleDragEnd"
                    @transform="handleTextTransform"
                    @transformend="handleTransformEnd"
                  />
                  <v-image
                    v-else-if="item.type === 'image'"
                    :config="getItemConfig(item)"
                    @dragmove="handleDragMove"
                    @dragend="handleDragEnd"
                    @transform="handleShapeTransform"
                    @transformend="handleTransformEnd"
                  />
                  <v-line
                    v-else-if="item.type === 'line'"
                    :config="getLineConfig(item)"
                    @dragmove="handleDragMove"
                    @dragend="handleDragEnd"
                    @transform="handleLineTransform"
                    @transformend="handleTransformEnd"
                  />
                  <v-rect
                    v-else-if="item.type === 'rect'"
                    :config="getShapeConfig(item)"
                    @dragmove="handleDragMove"
                    @dragend="handleDragEnd"
                    @transform="handleShapeTransform"
                    @transformend="handleTransformEnd"
                  />
                  <v-circle
                    v-else-if="item.type === 'circle'"
                    :config="getShapeConfig(item)"
                    @dragmove="handleDragMove"
                    @dragend="handleDragEnd"
                    @transform="handleShapeTransform"
                    @transformend="handleTransformEnd"
                  />
                </template>

                <!-- Transformer -->
                <v-transformer
                  v-if="!textEditor.isEditing.value"
                  ref="transformerRef"
                  :config="transformerConfig"
                />

                <!-- Snap Guide Lines -->
                <v-line
                  v-if="snapGuides.guides.value.horizontal"
                  :config="snapGuides.getGuideLineConfigs.value.horizontal"
                />
                <v-line
                  v-if="snapGuides.guides.value.vertical"
                  :config="snapGuides.getGuideLineConfigs.value.vertical"
                />
                <v-line
                  v-if="snapGuides.guides.value.left"
                  :config="snapGuides.getGuideLineConfigs.value.left"
                />
                <v-line
                  v-if="snapGuides.guides.value.right"
                  :config="snapGuides.getGuideLineConfigs.value.right"
                />
                <v-line
                  v-if="snapGuides.guides.value.top"
                  :config="snapGuides.getGuideLineConfigs.value.top"
                />
                <v-line
                  v-if="snapGuides.guides.value.bottom"
                  :config="snapGuides.getGuideLineConfigs.value.bottom"
                />
              </v-layer>
            </v-stage>
          </div>
        </div>
      </div>

      <!-- Floating Toolbar -->
      <canvas-toolbar />
    </div>
  </app-content>
</template>

<script setup lang="ts">
import type Konva from 'konva';
import type {
  StageRef,
  LayerRef,
  TransformerRef,
  KonvaPointerEvent,
  KonvaDragEvent,
  KonvaTransformEvent,
  CanvasItem,
} from '~/types/canvas-editor';
import { isTextItem, isImageItem, isLineItem, isRectItem, isCircleItem } from '~/types/canvas-editor';
import {
  useCanvasBounds,
  useSnapGuides,
  useCanvasView,
  useRotationSnap,
  useCanvasKeyboard,
  useTextEditor,
  useCanvasExport,
  TRANSFORMER_BASE_CONFIG,
  TRANSFORMER_LINE_CONFIG,
  CANVAS_CONFIG,
} from '~/composables/canvas';
import { useCanvasEditorStore } from '~/stores/canvasEditor';

// ============ STORE ============
const store = useCanvasEditorStore();

// ============ REFS ============
const stageRef = ref<StageRef | null>(null);
const layerRef = ref<LayerRef | null>(null);
const transformerRef = ref<TransformerRef | null>(null);
const stageContainerRef = ref<HTMLElement | null>(null);
const stageWrapperRef = ref<HTMLElement | null>(null);

// ============ COMPOSABLES ============
const bounds = useCanvasBounds();
const snapGuides = useSnapGuides();
const canvasView = useCanvasView();
const rotationSnap = useRotationSnap();

const textEditor = useTextEditor({
  scaleFactor: canvasView.scaleFactor,
});

const keyboard = useCanvasKeyboard(textEditor.isEditing);
const canvasExport = useCanvasExport();

// ============ SYNC REFS TO STORE ============
watch(stageRef, (newRef) => {
  store.setStageRef(newRef);
}, { immediate: true });

watch(transformerRef, (newRef) => {
  store.setTransformerRef(newRef);
}, { immediate: true });

// ============ TRANSFORMER CONFIG ============
const dragBoundFunc = bounds.createDragBoundFunc();
const boundBoxFunc = bounds.createBoundBoxFunc();

const transformerConfig = computed(() => {
  if (store.isLineSelected) {
    return TRANSFORMER_LINE_CONFIG;
  }
  return { ...TRANSFORMER_BASE_CONFIG, boundBoxFunc };
});

// ============ ITEM CONFIG HELPERS ============
const getKonvaConfig = (item: CanvasItem) => {
  const { zIndex: _zIndex, type: _type, ...konvaProps } = item;
  return konvaProps;
};

const getTextConfig = (item: CanvasItem) => ({
  ...getKonvaConfig(item),
  visible: !textEditor.isEditing.value || textEditor.editingTextId.value !== item.id,
  dragBoundFunc,
});

const getItemConfig = (item: CanvasItem) => ({
  ...getKonvaConfig(item),
  dragBoundFunc,
});

const getShapeConfig = (item: CanvasItem) => {
  const config = getItemConfig(item);
  // Handle fillEnabled/strokeEnabled for rect and circle
  if (isRectItem(item) || isCircleItem(item)) {
    const { fillEnabled, strokeEnabled, ...rest } = config as typeof config & { fillEnabled?: boolean; strokeEnabled?: boolean };
    return {
      ...rest,
      fill: fillEnabled ? item.fill : undefined,
      stroke: strokeEnabled ? item.stroke : undefined,
    };
  }
  return config;
};

const getLineConfig = (item: CanvasItem) => ({
  ...getKonvaConfig(item),
  draggable: true,
});

// ============ HELPERS ============
/** Round to 2 decimal places to avoid floating-point precision issues */
const round = (value: number) => Math.round(value * 100) / 100;

// ============ EVENT HANDLERS ============
const handleStageMouseDown = (e: KonvaPointerEvent) => {
  if (e.target === e.target.getStage()) {
    store.clearSelection();
    return;
  }
  if (e.target.getParent()?.className === 'Transformer') return;
  const name = e.target.name();
  store.setSelectedId(name || null);
  store.updateTransformer();
};

const handleDragMove = (e: KonvaDragEvent) => {
  snapGuides.snapNode(e.target);
};

const handleDragEnd = (e: KonvaDragEvent) => {
  const name = e.target.name();
  if (!name) return;
  store.updateItem(name, {
    x: round(e.target.x()),
    y: round(e.target.y()),
  });
};

const handleTextDblClick = (e: KonvaPointerEvent) => {
  const textNode = e.target as Konva.Text;
  const name = textNode.name();
  const item = store.items.find(i => i.id === name);
  if (item && isTextItem(item)) {
    textEditor.startEditing(textNode, item);
  }
};

const handleTextTransform = (e: KonvaTransformEvent) => {
  const textNode = e.target as Konva.Text;
  const name = textNode.name();
  if (!name) return;

  const scaleX = textNode.scaleX();
  const scaleY = textNode.scaleY();

  // Calculate new dimensions
  let newWidth = Math.max(CANVAS_CONFIG.text.minWidth, textNode.width() * scaleX);

  // Constrain to canvas bounds
  const constrained = snapGuides.constrainToCanvas(textNode, newWidth, textNode.height());
  newWidth = constrained.width;

  textNode.width(newWidth);
  textNode.scaleX(1);
  textNode.scaleY(1);

  if (scaleY !== 1) {
    const newFontSize = Math.max(
      CANVAS_CONFIG.text.minFontSize,
      Math.min(CANVAS_CONFIG.text.maxFontSize, textNode.fontSize() * scaleY),
    );
    textNode.fontSize(newFontSize);
  }

  // Snap to guides during transform
  snapGuides.showTransformGuides(textNode);
};

const handleShapeTransform = (e: KonvaTransformEvent) => {
  // boundBoxFunc handles constraints - just show guides here
  snapGuides.showTransformGuides(e.target);
};

const handleLineTransform = (e: KonvaTransformEvent) => {
  const node = e.target as Konva.Line;
  const rotation = node.rotation();
  const snappedRotation = rotationSnap.snapRotation(rotation);
  if (rotation !== snappedRotation) {
    node.rotation(snappedRotation);
  }
  node.scaleY(1);

  // Snap to guides during transform
  snapGuides.showTransformGuides(node);
};

const handleTransformEnd = (e: KonvaTransformEvent) => {
  const node = e.target;
  const name = node.name();
  if (!name) return;

  const item = store.items.find(i => i.id === name);
  if (!item) return;

  snapGuides.clearGuides();

  if (isTextItem(item)) {
    const constrained = snapGuides.constrainToCanvas(node, node.width(), node.height());
    store.updateItem(name, {
      x: round(node.x()),
      y: round(node.y()),
      width: round(Math.max(CANVAS_CONFIG.text.minWidth, constrained.width)),
      fontSize: round((node as Konva.Text).fontSize()),
    });
    node.scaleX(1);
    node.scaleY(1);
  }
  else if (isImageItem(item)) {
    let newWidth = Math.max(CANVAS_CONFIG.image.minSize, node.width() * node.scaleX());
    let newHeight = Math.max(CANVAS_CONFIG.image.minSize, node.height() * node.scaleY());
    const constrained = snapGuides.constrainToCanvas(node, newWidth, newHeight);
    newWidth = Math.max(CANVAS_CONFIG.image.minSize, constrained.width);
    newHeight = Math.max(CANVAS_CONFIG.image.minSize, constrained.height);

    store.updateItem(name, {
      x: round(node.x()),
      y: round(node.y()),
      width: round(newWidth),
      height: round(newHeight),
    });
    node.scaleX(1);
    node.scaleY(1);
  }
  else if (isLineItem(item)) {
    const scaleX = node.scaleX();
    const scaledPoints = scaleX !== 1
      ? item.points.map((p, i) => round(i % 2 === 0 ? p * scaleX : p))
      : item.points.map(p => round(p));

    store.updateItem(name, {
      x: round(node.x()),
      y: round(node.y()),
      rotation: round(node.rotation()),
      points: scaledPoints,
    });
    node.scaleX(1);
    node.scaleY(1);
  }
  else if (isRectItem(item)) {
    let newWidth = Math.max(CANVAS_CONFIG.shape.minSize, node.width() * node.scaleX());
    let newHeight = Math.max(CANVAS_CONFIG.shape.minSize, node.height() * node.scaleY());
    const constrained = snapGuides.constrainToCanvas(node, newWidth, newHeight);
    newWidth = Math.max(CANVAS_CONFIG.shape.minSize, constrained.width);
    newHeight = Math.max(CANVAS_CONFIG.shape.minSize, constrained.height);

    store.updateItem(name, {
      x: round(node.x()),
      y: round(node.y()),
      width: round(newWidth),
      height: round(newHeight),
    });
    node.scaleX(1);
    node.scaleY(1);
  }
  else if (isCircleItem(item)) {
    const avgScale = (node.scaleX() + node.scaleY()) / 2;
    let newRadius = Math.max(CANVAS_CONFIG.shape.minSize, (node as Konva.Circle).radius() * avgScale);
    const maxDimension = Math.min(
      store.stageConfig.width - node.x(),
      store.stageConfig.height - node.y(),
      node.x(),
      node.y(),
    );
    newRadius = Math.min(newRadius, maxDimension);
    newRadius = Math.max(CANVAS_CONFIG.shape.minSize, newRadius);

    store.updateItem(name, {
      x: round(node.x()),
      y: round(node.y()),
      radius: round(newRadius),
    });
    node.scaleX(1);
    node.scaleY(1);
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  keyboard.handleKeydown(e);
};

const handleExport = () => canvasExport.exportCanvas();

/**
 * Handle mouseup outside canvas to properly end transforms
 */
const handleWindowMouseUp = () => {
  const stage = stageRef.value?.getNode();
  if (!stage) return;

  // Simulate mouseup on stage to end any active transform/drag
  stage.fire('mouseup');
  snapGuides.clearGuides();
};

// ============ LIFECYCLE ============
onMounted(() => {
  canvasView.initResizeObserver(stageContainerRef);
  rotationSnap.setupKeyListeners();
  window.addEventListener('mouseup', handleWindowMouseUp);
});

onUnmounted(() => {
  canvasView.destroyResizeObserver();
  rotationSnap.destroyKeyListeners();
  window.removeEventListener('mouseup', handleWindowMouseUp);
});

// Clear snap guides on items change
watch(
  () => store.items,
  () => snapGuides.clearGuides(),
  { deep: true },
);

// Update transformer when selection changes
watch(
  () => store.selectedId,
  () => {
    nextTick(() => store.updateTransformer());
  },
);
</script>
