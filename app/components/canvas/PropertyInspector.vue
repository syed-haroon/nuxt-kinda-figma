<template>
  <ui-card class="border-0 shadow-none">
    <ui-card-header class="p-0">
      <div class="flex items-center justify-between">
        <ui-card-title class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {{ panelTitle }}
        </ui-card-title>
        <div class="flex items-center gap-1">
          <ui-tooltip-button tooltip-text="Duplicate (Ctrl+D)">
            <ui-button
              size="icon-sm"
              variant="outline"
              class="text-slate-500 hover:text-slate-600 hover:bg-slate-50"
              @click="store.cloneSelectedItem()"
            >
              <icon name="lucide:copy" />
            </ui-button>
          </ui-tooltip-button>
          <ui-tooltip-button tooltip-text="Delete (Del)">
            <ui-button
              size="icon-sm"
              variant="outline"
              class="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              @click="store.deleteSelectedItem()"
            >
              <icon name="lucide:trash-2" />
            </ui-button>
          </ui-tooltip-button>
        </div>
      </div>
    </ui-card-header>
    <ui-card-content class="p-0 space-y-4">
      <!-- Text Properties -->
      <canvas-text-properties-panel v-if="store.selectedItem?.type === 'text'" />

      <!-- Image Properties -->
      <canvas-image-properties-panel v-else-if="store.selectedItem?.type === 'image'" />

      <!-- Shape Properties -->
      <canvas-shape-properties-panel v-else-if="store.selectedItem && store.isShapeSelected" />
    </ui-card-content>
  </ui-card>
</template>

<script setup lang="ts">
import { useCanvasEditorStore } from '~/stores/canvasEditor';

const store = useCanvasEditorStore();

const panelTitle = computed(() => {
  switch (store.selectedItem?.type) {
    case 'text':
      return 'Text Properties';
    case 'image':
      return 'Image Properties';
    default:
      return 'Shape Properties';
  }
});
</script>
