<template>
  <div class="text-xs text-slate-500">
    <ui-accordion
      type="single"
      collapsible
    >
      <ui-accordion-item value="debug">
        <ui-accordion-trigger>
          <div class="flex items-center gap-2">
            <icon
              name="lucide:settings"
              class="w-4 h-4"
            />
            Debug Info
          </div>
        </ui-accordion-trigger>
        <ui-accordion-content>
          <div class="space-y-2">
            <div class="p-2 bg-slate-50 rounded">
              <div class="font-medium mb-1">
                Selected: {{ store.selectedId || 'None' }}
              </div>
              <div
                v-if="store.selectedId"
                class="text-slate-600"
              >
                zIndex: {{ store.items.find(i => i.id === store.selectedId)?.zIndex }}
              </div>
            </div>
            <div class="p-2 bg-slate-50 rounded">
              <div class="font-medium mb-1">
                Layer Order (top → bottom):
              </div>
              <div
                v-for="item in [...store.sortedItems].reverse()"
                :key="item.id"
                class="flex justify-between py-0.5"
                :class="item.id === store.selectedId ? 'text-blue-600 font-medium' : ''"
              >
                <span>{{ item.id }}</span>
                <span class="text-slate-400">z: {{ item.zIndex }}</span>
              </div>
            </div>
            <pre class="p-2 bg-slate-50 rounded text-xs overflow-auto max-h-48">{{ JSON.stringify(store.items, null, 2) }}</pre>
          </div>
        </ui-accordion-content>
      </ui-accordion-item>
    </ui-accordion>
  </div>
</template>

<script setup lang="ts">
import { useCanvasEditorStore } from '~/stores/canvasEditor';

const store = useCanvasEditorStore();
</script>
