<template>
  <div class="space-y-3">
    <!-- Replace Image -->
    <label class="w-full block cursor-pointer">
      <input
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleReplaceImage"
      >
      <div class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-8 px-3 w-full bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80">
        <icon
          name="lucide:image"
          class="w-4 h-4"
        />
        Replace Image
      </div>
    </label>

    <!-- Dimensions -->
    <div>
      <ui-label class="text-xs mb-1.5 block">
        Dimensions
      </ui-label>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <ui-label class="text-xs mb-1.5 block text-slate-400">
            Width
          </ui-label>
          <div class="flex items-center gap-1">
            <ui-input
              type="number"
              :model-value="imageWidth"
              :min="10"
              class="flex-1"
              @update:model-value="updateWidth"
            />
            <span class="text-xs text-slate-400">px</span>
          </div>
        </div>
        <div>
          <ui-label class="text-xs mb-1.5 block text-slate-400">
            Height
          </ui-label>
          <div class="flex items-center gap-1">
            <ui-input
              type="number"
              :model-value="imageHeight"
              :min="10"
              class="flex-1"
              @update:model-value="updateHeight"
            />
            <span class="text-xs text-slate-400">px</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Opacity -->
    <div>
      <ui-label class="text-xs mb-1.5 block">
        Opacity
      </ui-label>
      <div class="flex items-center gap-2">
        <ui-slider
          :model-value="[imageOpacity * 100]"
          :min="0"
          :max="100"
          :step="1"
          class="flex-1"
          @update:model-value="(val) => { if (val) store.updateSelectedItem({ opacity: (val[0] ?? 100) / 100 }) }"
        />
        <div class="w-10 text-right text-xs text-slate-500">
          {{ Math.round(imageOpacity * 100) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasEditorStore } from '~/stores/canvasEditor';
import { isImageItem } from '~/types/canvas-editor';

const store = useCanvasEditorStore();

const imageWidth = computed(() => {
  if (store.selectedItem && isImageItem(store.selectedItem)) {
    return Math.round(store.selectedItem.width);
  }
  return 0;
});

const imageHeight = computed(() => {
  if (store.selectedItem && isImageItem(store.selectedItem)) {
    return Math.round(store.selectedItem.height);
  }
  return 0;
});

const imageOpacity = computed(() => {
  if (store.selectedItem && isImageItem(store.selectedItem)) {
    return store.selectedItem.opacity;
  }
  return 1;
});

const updateWidth = (value: string | number) => {
  const width = Number(value);
  if (width > 0) {
    store.updateSelectedItem({ width });
  }
};

const updateHeight = (value: string | number) => {
  const height = Number(value);
  if (height > 0) {
    store.updateSelectedItem({ height });
  }
};

const handleReplaceImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    store.replaceSelectedImage(file);
    input.value = '';
  }
};
</script>
