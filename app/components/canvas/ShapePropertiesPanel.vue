<template>
  <div class="space-y-3">
    <!-- Fill & Stroke Colors (2-column for rect/circle) -->
    <div
      v-if="!store.isLineSelected"
      class="grid grid-cols-2 gap-3"
    >
      <!-- Stroke -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <ui-label class="text-xs">
            Stroke
          </ui-label>
          <ui-switch
            :model-value="shapeItem?.strokeEnabled ?? true"
            @update:model-value="store.updateSelectedItem({ strokeEnabled: $event })"
          />
        </div>
        <div
          v-if="shapeItem?.strokeEnabled"
          class="flex items-center gap-2"
        >
          <input
            :value="shapeStroke || '#000000'"
            type="color"
            class="w-9 h-8 rounded border border-slate-200 cursor-pointer"
            @input="store.updateSelectedItem({ stroke: ($event.target as HTMLInputElement).value })"
          >
          <ui-input
            :model-value="shapeStroke"
            placeholder="#000000"
            class="flex-1"
            @update:model-value="store.updateSelectedItem({ stroke: String($event) })"
          />
        </div>
        <p
          v-else
          class="text-xs text-slate-400 italic py-2.5"
        >
          No stroke (transparent)
        </p>
      </div>
      <!-- Fill -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <ui-label class="text-xs">
            Fill
          </ui-label>
          <ui-switch
            :model-value="shapeItem?.fillEnabled ?? true"
            @update:model-value="store.updateSelectedItem({ fillEnabled: $event })"
          />
        </div>
        <div
          v-if="shapeItem?.fillEnabled"
          class="flex items-center gap-2"
        >
          <input
            :value="shapeFill || '#000000'"
            type="color"
            class="w-9 h-8 rounded border border-slate-200 cursor-pointer"
            @input="store.updateSelectedItem({ fill: ($event.target as HTMLInputElement).value })"
          >
          <ui-input
            :model-value="shapeFill"
            placeholder="#000000"
            class="flex-1"
            @update:model-value="store.updateSelectedItem({ fill: String($event) })"
          />
        </div>
        <p
          v-else
          class="text-xs text-slate-400 italic py-2.5"
        >
          No fill (transparent)
        </p>
      </div>
    </div>

    <!-- Stroke Color (for lines only - full width) -->
    <div v-if="store.isLineSelected">
      <div class="flex items-center justify-between mb-1.5">
        <ui-label class="text-xs">
          Stroke
        </ui-label>
      </div>
      <div class="flex items-center gap-2">
        <input
          :value="shapeStroke || '#000000'"
          type="color"
          class="w-9 h-8 rounded border border-slate-200 cursor-pointer"
          @input="store.updateSelectedItem({ stroke: ($event.target as HTMLInputElement).value })"
        >
        <ui-input
          :model-value="shapeStroke"
          placeholder="#000000"
          class="flex-1"
          @update:model-value="store.updateSelectedItem({ stroke: String($event) })"
        />
      </div>
    </div>

    <!-- Opacity & Stroke Width -->
    <div
      v-if="showStrokeWidth || showOpacity"
      :class="showStrokeWidth ? 'grid grid-cols-2 gap-3' : ''"
    >
      <!-- Opacity (only if something is visible) -->
      <div v-if="showOpacity">
        <ui-label class="text-xs mb-1.5 block">
          Opacity
        </ui-label>
        <div class="flex items-center gap-2">
          <ui-slider
            :model-value="[shapeOpacity * 100]"
            :min="0"
            :max="100"
            :step="1"
            class="flex-1"
            @update:model-value="(val) => { if (val) store.updateSelectedItem({ opacity: (val[0] ?? 100) / 100 }) }"
          />
          <div class="w-8 text-right text-xs text-slate-500">
            {{ Math.round(shapeOpacity * 100) }}%
          </div>
        </div>
      </div>

      <!-- Stroke Width -->
      <div v-if="showStrokeWidth">
        <ui-label class="text-xs mb-1.5 block">
          Stroke Width
        </ui-label>
        <div class="flex items-center gap-2">
          <ui-slider
            :model-value="[shapeStrokeWidth]"
            :min="0"
            :max="20"
            :step="1"
            class="flex-1"
            @update:model-value="(val) => { if (val) store.updateSelectedItem({ strokeWidth: val[0] ?? 2 }) }"
          />
          <div class="w-8 text-right text-xs text-slate-500">
            {{ shapeStrokeWidth }}
          </div>
        </div>
      </div>
    </div>

    <!-- Corner Radius (only for rect) -->
    <div v-if="store.isRectSelected">
      <ui-label class="text-xs mb-1.5 block">
        Corner Radius
      </ui-label>
      <div class="flex items-center gap-2">
        <ui-slider
          :model-value="[cornerRadius]"
          :min="0"
          :max="100"
          :step="1"
          class="flex-1"
          @update:model-value="(val) => { if (val) store.updateSelectedItem({ cornerRadius: val[0] ?? 0 }) }"
        />
        <div class="w-8 text-right text-xs text-slate-500">
          {{ cornerRadius }}
        </div>
      </div>
      <div class="flex gap-1 mt-2">
        <ui-button
          size="sm"
          variant="outline"
          class="flex-1 text-xs"
          @click="store.updateSelectedItem({ cornerRadius: 0 })"
        >
          0
        </ui-button>
        <ui-button
          size="sm"
          variant="outline"
          class="flex-1 text-xs"
          @click="store.updateSelectedItem({ cornerRadius: 8 })"
        >
          8
        </ui-button>
        <ui-button
          size="sm"
          variant="outline"
          class="flex-1 text-xs"
          @click="store.updateSelectedItem({ cornerRadius: 16 })"
        >
          16
        </ui-button>
        <ui-button
          size="sm"
          variant="outline"
          class="flex-1 text-xs"
          @click="store.updateSelectedItem({ cornerRadius: 24 })"
        >
          24
        </ui-button>
      </div>
    </div>

    <!-- Dimensions for Rect -->
    <div v-if="store.isRectSelected">
      <ui-label class="text-xs mb-1.5 block">
        Dimensions
      </ui-label>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <ui-label class="text-xs mb-1.5 block text-slate-400">
            Width (px)
          </ui-label>
          <ui-input
            type="number"
            :model-value="rectWidth"
            :min="10"
            class="flex-1"
            @update:model-value="updateRectWidth"
          />
        </div>
        <div>
          <ui-label class="text-xs mb-1.5 block text-slate-400">
            Height (px)
          </ui-label>
          <ui-input
            type="number"
            :model-value="rectHeight"
            :min="10"
            class="flex-1"
            @update:model-value="updateRectHeight"
          />
        </div>
      </div>
    </div>

    <!-- Size for Circle -->
    <div v-if="store.isCircleSelected">
      <ui-label class="text-xs mb-1.5 block">
        Size
      </ui-label>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <ui-label class="text-xs mb-1.5 block text-slate-400">
            Radius (px)
          </ui-label>
          <ui-input
            type="number"
            :model-value="circleRadius"
            :min="5"
            class="flex-1"
            @update:model-value="updateCircleRadius"
          />
        </div>
        <div>
          <ui-label class="text-xs mb-1.5 block text-slate-400">
            Diameter (px)
          </ui-label>
          <ui-input
            type="number"
            :model-value="circleRadius * 2"
            :min="10"
            class="flex-1"
            @update:model-value="(val) => updateCircleRadius(Number(val) / 2)"
          />
        </div>
      </div>
    </div>

    <!-- Length for Line -->
    <div v-if="store.isLineSelected">
      <ui-label class="text-xs mb-1.5 block">
        Length (px)
      </ui-label>
      <ui-input
        type="number"
        :model-value="lineLength"
        :min="10"
        class="flex-1"
        @update:model-value="updateLineLength"
      />
    </div>

    <!-- Rotation (only for lines) -->
    <div v-if="store.isLineSelected">
      <ui-label class="text-xs mb-1.5 block">
        Rotation
      </ui-label>
      <div class="flex items-center gap-2">
        <ui-slider
          :model-value="[lineRotation]"
          :min="0"
          :max="360"
          :step="1"
          class="flex-1"
          @update:model-value="(val) => { if (val) store.updateRotationWithVisualFeedback(val[0] ?? 0) }"
        />
        <div class="w-10 text-right text-xs text-slate-500">
          {{ lineRotation }}°
        </div>
      </div>
      <div class="flex gap-1 mt-2">
        <ui-button
          size="sm"
          variant="outline"
          class="flex-1 text-xs"
          @click="store.updateRotationWithVisualFeedback(0)"
        >
          0°
        </ui-button>
        <ui-button
          size="sm"
          variant="outline"
          class="flex-1 text-xs"
          @click="store.updateRotationWithVisualFeedback(45)"
        >
          45°
        </ui-button>
        <ui-button
          size="sm"
          variant="outline"
          class="flex-1 text-xs"
          @click="store.updateRotationWithVisualFeedback(90)"
        >
          90°
        </ui-button>
        <ui-button
          size="sm"
          variant="outline"
          class="flex-1 text-xs"
          @click="store.updateRotationWithVisualFeedback(135)"
        >
          135°
        </ui-button>
      </div>
      <p class="text-xs text-slate-400 mt-1.5">
        Hold Shift while rotating to snap to 45°
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasEditorStore } from '~/stores/canvasEditor';
import { isLineItem, isRectItem, isCircleItem } from '~/types/canvas-editor';

const store = useCanvasEditorStore();

// Get the shape item with proper typing for rect/circle
const shapeItem = computed(() => {
  if (!store.selectedItem) return null;
  if (isRectItem(store.selectedItem) || isCircleItem(store.selectedItem)) {
    return store.selectedItem;
  }
  return null;
});

// Rect dimensions
const rectWidth = computed(() => {
  if (store.selectedItem && isRectItem(store.selectedItem)) {
    return Math.round(store.selectedItem.width);
  }
  return 0;
});

const rectHeight = computed(() => {
  if (store.selectedItem && isRectItem(store.selectedItem)) {
    return Math.round(store.selectedItem.height);
  }
  return 0;
});

const updateRectWidth = (value: string | number) => {
  const width = Number(value);
  if (width > 0) store.updateSelectedItem({ width });
};

const updateRectHeight = (value: string | number) => {
  const height = Number(value);
  if (height > 0) store.updateSelectedItem({ height });
};

// Circle radius
const circleRadius = computed(() => {
  if (store.selectedItem && isCircleItem(store.selectedItem)) {
    return Math.round(store.selectedItem.radius);
  }
  return 0;
});

const updateCircleRadius = (value: string | number) => {
  const radius = Number(value);
  if (radius > 0) store.updateSelectedItem({ radius });
};

// Line length (calculated from points array)
const lineLength = computed(() => {
  if (store.selectedItem && isLineItem(store.selectedItem)) {
    const points = store.selectedItem.points;
    // Line is typically [0, 0, length, 0] for horizontal
    if (points.length >= 4) {
      const dx = (points[2] ?? 0) - (points[0] ?? 0);
      const dy = (points[3] ?? 0) - (points[1] ?? 0);
      return Math.round(Math.sqrt(dx * dx + dy * dy));
    }
  }
  return 0;
});

const updateLineLength = (value: string | number) => {
  const length = Number(value);
  if (length > 0 && store.selectedItem && isLineItem(store.selectedItem)) {
    // Update line points keeping the same direction
    // Standard line: [0, 0, length, 0]
    store.updateSelectedItem({ points: [0, 0, length, 0] });
  }
};

const shapeFill = computed(() => {
  if (!store.selectedItem) return '';
  if (isRectItem(store.selectedItem)) return store.selectedItem.fill ?? '';
  if (isCircleItem(store.selectedItem)) return store.selectedItem.fill ?? '';
  return '';
});

const shapeStroke = computed(() => {
  if (!store.selectedItem) return '';
  if (isLineItem(store.selectedItem) || isRectItem(store.selectedItem) || isCircleItem(store.selectedItem)) {
    return store.selectedItem.stroke ?? '';
  }
  return '';
});

const shapeStrokeWidth = computed(() => {
  if (!store.selectedItem) return 2;
  if (isLineItem(store.selectedItem) || isRectItem(store.selectedItem) || isCircleItem(store.selectedItem)) {
    return store.selectedItem.strokeWidth;
  }
  return 2;
});

const shapeOpacity = computed(() => {
  return store.selectedItem?.opacity ?? 1;
});

// Show stroke width if line or shape has stroke enabled
const showStrokeWidth = computed(() => {
  return store.isLineSelected || shapeItem.value?.strokeEnabled;
});

// Show opacity only if something is visible (fill or stroke enabled)
const showOpacity = computed(() => {
  if (store.isLineSelected) return true; // Lines always have stroke
  return shapeItem.value?.fillEnabled || shapeItem.value?.strokeEnabled;
});

const cornerRadius = computed(() => {
  if (store.selectedItem && isRectItem(store.selectedItem)) {
    return store.selectedItem.cornerRadius;
  }
  return 0;
});

const lineRotation = computed(() => {
  if (store.selectedItem && isLineItem(store.selectedItem)) {
    return store.selectedItem.rotation;
  }
  return 0;
});
</script>
