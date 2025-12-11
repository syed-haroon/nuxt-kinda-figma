import { defineStore } from 'pinia';
import type Konva from 'konva';
import type {
  CanvasItem,
  CanvasItemType,
  StageRef,
  TransformerRef,
  BackgroundType,
  GradientStop,
  ViewMode,
  LayerOrderDirection,
  AlignmentDirection,
  ArrowDirection,
} from '~/types/canvas-editor';
import { isImageItem } from '~/types/canvas-editor';
import { CANVAS_CONFIG, DEFAULT_COLORS } from '~/composables/canvas';

export const useCanvasEditorStore = defineStore('canvasEditor', () => {
  // ============ STAGE CONFIG ============
  const stageConfig = reactive({
    width: 800,
    height: 800,
  });

  // ============ BACKGROUND STATE ============
  const backgroundType = ref<BackgroundType>('solid');
  const backgroundColor = ref<string>(DEFAULT_COLORS.background);
  const gradientStops = ref<GradientStop[]>([...DEFAULT_COLORS.gradient]);

  // ============ VIEW STATE ============
  const viewMode = ref<ViewMode>('fit');

  // ============ ITEMS STATE ============
  const items = ref<CanvasItem[]>([
    {
      type: 'text',
      id: 'text-0',
      x: 200,
      y: 200,
      text: 'Hello, World!',
      fontSize: CANVAS_CONFIG.text.defaultFontSize,
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: DEFAULT_COLORS.text,
      align: 'left',
      draggable: true,
      width: CANVAS_CONFIG.text.defaultWidth + 100,
      wrap: 'word',
      name: 'text-0',
      zIndex: 1,
      opacity: 1,
    },
  ]);

  // ============ SELECTION STATE ============
  const selectedId = ref<string | null>(null);

  // ============ INTERNAL COUNTERS ============
  const idCounters = reactive({
    text: 1,
    image: 1,
    line: 1,
    rect: 1,
    circle: 1,
  });
  const zIndexCounter = ref(1);

  // ============ KONVA REFS (shallow to avoid deep reactivity) ============
  const stageRef = shallowRef<StageRef | null>(null);
  const transformerRef = shallowRef<TransformerRef | null>(null);

  // ============ COMPUTED: BACKGROUND ============
  const backgroundPreview = computed(() => {
    if (backgroundType.value === 'solid') {
      return backgroundColor.value;
    }
    const sortedStops = [...gradientStops.value].sort((a, b) => a.position - b.position);
    return `linear-gradient(135deg, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')})`;
  });

  const backgroundRectConfig = computed(() => {
    const base = { x: 0, y: 0, width: stageConfig.width, height: stageConfig.height, listening: false };
    if (backgroundType.value === 'solid') {
      return { ...base, fill: backgroundColor.value };
    }
    const sortedStops = [...gradientStops.value].sort((a, b) => a.position - b.position);
    const colorStops: (number | string)[] = [];
    sortedStops.forEach((stop) => {
      colorStops.push(stop.position / 100);
      colorStops.push(stop.color);
    });
    return {
      ...base,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: stageConfig.width, y: stageConfig.height },
      fillLinearGradientColorStops: colorStops,
    };
  });

  // ============ COMPUTED: ITEMS ============
  const sortedItems = computed(() =>
    [...items.value].sort((a, b) => a.zIndex - b.zIndex),
  );

  const selectedItem = computed(() =>
    items.value.find(item => item.id === selectedId.value),
  );

  const isTextSelected = computed(() =>
    selectedItem.value?.type === 'text',
  );

  const isImageSelected = computed(() =>
    selectedItem.value?.type === 'image',
  );

  const isLineSelected = computed(() =>
    selectedItem.value?.type === 'line',
  );

  const isRectSelected = computed(() =>
    selectedItem.value?.type === 'rect',
  );

  const isCircleSelected = computed(() =>
    selectedItem.value?.type === 'circle',
  );

  const isShapeSelected = computed(() =>
    isLineSelected.value || isRectSelected.value || isCircleSelected.value,
  );

  const selectedItemType = computed(() => selectedItem.value?.type);

  // ============ ACTIONS: BACKGROUND ============
  const addGradientStop = () => {
    if (gradientStops.value.length < 5) {
      gradientStops.value.push({ color: '#ffffff', position: 50 });
    }
  };

  const removeGradientStop = (index: number) => {
    if (gradientStops.value.length > 2) {
      gradientStops.value.splice(index, 1);
    }
  };

  const updateGradientStop = (data: { index: number; color?: string; position?: number }) => {
    const stop = gradientStops.value[data.index];
    if (stop) {
      if (data.color !== undefined) stop.color = data.color;
      if (data.position !== undefined) stop.position = data.position;
    }
  };

  const setBackgroundType = (type: BackgroundType) => {
    backgroundType.value = type;
  };

  const setBackgroundColor = (color: string) => {
    backgroundColor.value = color;
  };

  // ============ ACTIONS: STAGE CONFIG ============
  const setStageWidth = (width: number) => {
    stageConfig.width = width;
  };

  const setStageHeight = (height: number) => {
    stageConfig.height = height;
  };

  const setStageSize = (width: number, height: number) => {
    stageConfig.width = width;
    stageConfig.height = height;
  };

  // ============ ACTIONS: VIEW ============
  const setViewMode = (mode: ViewMode) => {
    viewMode.value = mode;
  };

  // ============ ACTIONS: REFS ============
  const setStageRef = (ref: StageRef | null) => {
    stageRef.value = ref;
  };

  const setTransformerRef = (ref: TransformerRef | null) => {
    transformerRef.value = ref;
  };

  // ============ ACTIONS: SELECTION ============
  const setSelectedId = (id: string | null) => {
    selectedId.value = id;
  };

  const clearSelection = () => {
    selectedId.value = null;
    updateTransformer();
  };

  // ============ ACTIONS: TRANSFORMER ============
  const updateTransformer = () => {
    const transformerNode = transformerRef.value?.getNode();
    const stageNode = stageRef.value?.getNode();

    if (!transformerNode || !stageNode) return;

    if (selectedId.value) {
      const selectedNode = stageNode.findOne(`.${selectedId.value}`);
      if (selectedNode) {
        transformerNode.nodes([selectedNode]);
      }
      else {
        transformerNode.nodes([]);
      }
    }
    else {
      transformerNode.nodes([]);
    }
  };

  // ============ ACTIONS: ITEM CREATION ============
  const createItem = <T extends CanvasItemType>(
    type: T,
    overrides: Partial<Extract<CanvasItem, { type: T }>> = {},
  ): CanvasItem => {
    const id = `${type}-${idCounters[type]++}`;
    zIndexCounter.value++;

    const baseConfig = {
      id,
      name: id,
      draggable: true,
      zIndex: zIndexCounter.value,
      opacity: 1,
    };

    const centerX = stageConfig.width / 2;
    const centerY = stageConfig.height / 2;

    switch (type) {
      case 'text':
        return {
          type: 'text',
          ...baseConfig,
          x: centerX - 100,
          y: centerY,
          text: 'New Text',
          fontSize: CANVAS_CONFIG.text.defaultFontSize,
          fontFamily: 'Arial',
          fontStyle: 'normal',
          fill: DEFAULT_COLORS.text,
          align: 'left',
          width: CANVAS_CONFIG.text.defaultWidth,
          wrap: 'word',
          ...overrides,
        } as CanvasItem;

      case 'image':
        return {
          type: 'image',
          ...baseConfig,
          x: centerX,
          y: centerY,
          image: null,
          width: 0,
          height: 0,
          ...overrides,
        } as CanvasItem;

      case 'line':
        return {
          type: 'line',
          ...baseConfig,
          x: centerX,
          y: centerY,
          points: [-100, 0, 100, 0],
          stroke: DEFAULT_COLORS.line,
          strokeWidth: 3,
          hitStrokeWidth: CANVAS_CONFIG.shape.lineHitStrokeWidth,
          lineCap: 'round',
          lineJoin: 'round',
          rotation: 0,
          ...overrides,
        } as CanvasItem;

      case 'rect':
        return {
          type: 'rect',
          ...baseConfig,
          x: centerX - 75,
          y: centerY - 50,
          width: 150,
          height: 100,
          fill: DEFAULT_COLORS.rect.fill,
          stroke: DEFAULT_COLORS.rect.stroke,
          strokeWidth: CANVAS_CONFIG.shape.defaultStrokeWidth,
          cornerRadius: 0,
          fillEnabled: false,
          strokeEnabled: true,
          ...overrides,
        } as CanvasItem;

      case 'circle':
        return {
          type: 'circle',
          ...baseConfig,
          x: centerX,
          y: centerY,
          radius: 60,
          fill: DEFAULT_COLORS.circle.fill,
          stroke: DEFAULT_COLORS.circle.stroke,
          strokeWidth: CANVAS_CONFIG.shape.defaultStrokeWidth,
          fillEnabled: false,
          strokeEnabled: true,
          ...overrides,
        } as CanvasItem;

      default:
        throw new Error(`Unknown item type: ${type}`);
    }
  };

  const addItem = <T extends CanvasItemType>(
    type: T,
    overrides: Partial<Extract<CanvasItem, { type: T }>> = {},
  ) => {
    const item = createItem(type, overrides);
    items.value.push(item);

    nextTick(() => {
      selectedId.value = item.id;
      updateTransformer();
    });

    return item;
  };

  const addImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(
          CANVAS_CONFIG.image.maxInitialSize / img.width,
          CANVAS_CONFIG.image.maxInitialSize / img.height,
          1,
        );
        addItem('image', {
          x: stageConfig.width / 2 - (img.width * scale) / 2,
          y: stageConfig.height / 2 - (img.height * scale) / 2,
          image: img,
          width: img.width * scale,
          height: img.height * scale,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // ============ ACTIONS: ITEM UPDATES ============
  const updateItem = (id: string, updates: Partial<CanvasItem>) => {
    const item = items.value.find(i => i.id === id);
    if (item) {
      Object.assign(item, updates);
    }
  };

  const updateSelectedItem = (updates: Partial<CanvasItem>) => {
    if (selectedId.value) {
      updateItem(selectedId.value, updates);
    }
  };

  const replaceSelectedImage = (file: File) => {
    if (!selectedId.value || !isImageSelected.value) return;

    const item = selectedItem.value;
    if (!item || !isImageItem(item)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(
          CANVAS_CONFIG.image.maxInitialSize / img.width,
          CANVAS_CONFIG.image.maxInitialSize / img.height,
          1,
        );
        updateItem(item.id, {
          image: img,
          width: img.width * scale,
          height: img.height * scale,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // ============ ACTIONS: CLONING ============
  const cloneSelectedItem = () => {
    if (!selectedId.value || !selectedItem.value) return;

    const item = selectedItem.value;
    const offset = 20;

    const { id: _id, name: _name, zIndex: _zIndex, type, ...itemProps } = item;

    const clonedItem = createItem(type, {
      ...itemProps,
      x: item.x + offset,
      y: item.y + offset,
    } as Partial<Extract<CanvasItem, { type: typeof type }>>);

    items.value.push(clonedItem);

    nextTick(() => {
      selectedId.value = clonedItem.id;
      updateTransformer();
    });

    return clonedItem;
  };

  // ============ ACTIONS: DELETION ============
  const deleteItem = (id: string) => {
    const index = items.value.findIndex(i => i.id === id);
    if (index > -1) {
      items.value.splice(index, 1);
      if (selectedId.value === id) {
        selectedId.value = null;
        updateTransformer();
      }
    }
  };

  const deleteSelectedItem = () => {
    if (selectedId.value) {
      deleteItem(selectedId.value);
    }
  };

  // ============ ACTIONS: LAYER ORDER ============
  const changeLayerOrder = (direction: LayerOrderDirection) => {
    if (!selectedId.value) return;

    const item = selectedItem.value;
    if (!item) return;

    const sorted = sortedItems.value;
    const currentPosition = sorted.findIndex(i => i.id === selectedId.value);

    switch (direction) {
      case 'front': {
        const maxZIndex = Math.max(...sorted.map(i => i.zIndex));
        item.zIndex = maxZIndex + 1;
        break;
      }
      case 'forward': {
        const itemAbove = sorted[currentPosition + 1];
        if (itemAbove) {
          const tempZ = item.zIndex;
          item.zIndex = itemAbove.zIndex;
          itemAbove.zIndex = tempZ;
        }
        break;
      }
      case 'backward': {
        const itemBelow = sorted[currentPosition - 1];
        if (itemBelow) {
          const tempZ = item.zIndex;
          item.zIndex = itemBelow.zIndex;
          itemBelow.zIndex = tempZ;
        }
        break;
      }
      case 'back': {
        const minZIndex = Math.min(...sorted.map(i => i.zIndex));
        item.zIndex = minZIndex - 1;
        break;
      }
    }
  };

  // ============ ACTIONS: ALIGNMENT ============
  const alignItem = (alignment: AlignmentDirection) => {
    if (!selectedId.value) return;

    const stageNode = stageRef.value?.getNode();
    if (!stageNode) return;

    const node = stageNode.findOne(`.${selectedId.value}`) as Konva.Node | undefined;
    if (!node) return;

    const box = node.getClientRect();
    const offsetX = node.x() - box.x;
    const offsetY = node.y() - box.y;

    let newX = node.x();
    let newY = node.y();

    switch (alignment) {
      case 'left':
        newX = offsetX;
        break;
      case 'right':
        newX = stageConfig.width - box.width + offsetX;
        break;
      case 'top':
        newY = offsetY;
        break;
      case 'bottom':
        newY = stageConfig.height - box.height + offsetY;
        break;
      case 'center-h':
        newX = (stageConfig.width - box.width) / 2 + offsetX;
        break;
      case 'center-v':
        newY = (stageConfig.height - box.height) / 2 + offsetY;
        break;
    }

    node.x(newX);
    node.y(newY);
    updateItem(selectedId.value, { x: newX, y: newY });
  };

  // ============ ACTIONS: NUDGE ============
  const nudgeItem = (direction: ArrowDirection, amount: number) => {
    if (!selectedId.value) return;

    const stageNode = stageRef.value?.getNode();
    if (!stageNode) return;

    const node = stageNode.findOne(`.${selectedId.value}`) as Konva.Node | undefined;
    if (!node) return;

    let deltaX = 0;
    let deltaY = 0;

    switch (direction) {
      case 'ArrowUp':
        deltaY = -amount;
        break;
      case 'ArrowDown':
        deltaY = amount;
        break;
      case 'ArrowLeft':
        deltaX = -amount;
        break;
      case 'ArrowRight':
        deltaX = amount;
        break;
    }

    const newX = node.x() + deltaX;
    const newY = node.y() + deltaY;

    node.x(newX);
    node.y(newY);
    updateItem(selectedId.value, { x: newX, y: newY });
  };

  // ============ ACTIONS: ROTATION (for lines) ============
  const updateRotationWithVisualFeedback = (rotation: number) => {
    updateSelectedItem({ rotation });

    // Update Konva node directly for immediate visual feedback
    if (stageRef.value && selectedItem.value) {
      const stageNode = stageRef.value.getNode();
      const node = stageNode.findOne(`.${selectedItem.value.id}`) as Konva.Node | undefined;
      if (node) {
        node.rotation(rotation);
      }
    }
  };

  return {
    // State
    stageConfig,
    backgroundType,
    backgroundColor,
    gradientStops,
    viewMode,
    items,
    selectedId,
    stageRef,
    transformerRef,

    // Computed: Background
    backgroundPreview,
    backgroundRectConfig,

    // Computed: Items
    sortedItems,
    selectedItem,
    isTextSelected,
    isImageSelected,
    isLineSelected,
    isRectSelected,
    isCircleSelected,
    isShapeSelected,
    selectedItemType,

    // Actions: Background
    addGradientStop,
    removeGradientStop,
    updateGradientStop,
    setBackgroundType,
    setBackgroundColor,

    // Actions: Stage Config
    setStageWidth,
    setStageHeight,
    setStageSize,

    // Actions: View
    setViewMode,

    // Actions: Refs
    setStageRef,
    setTransformerRef,

    // Actions: Selection
    setSelectedId,
    clearSelection,
    updateTransformer,

    // Actions: Item Management
    createItem,
    addItem,
    addImageFromFile,
    updateItem,
    updateSelectedItem,
    replaceSelectedImage,
    cloneSelectedItem,
    deleteItem,
    deleteSelectedItem,

    // Actions: Layer & Alignment
    changeLayerOrder,
    alignItem,
    nudgeItem,

    // Actions: Rotation
    updateRotationWithVisualFeedback,
  };
});
