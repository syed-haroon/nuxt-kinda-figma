<template>
  <div class="space-y-4">
    <!-- Font & Color -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Font Family -->
      <div>
        <ui-label class="text-xs mb-1.5 block">
          Font
        </ui-label>
        <ui-select
          :model-value="textItem?.fontFamily"
          @update:model-value="store.updateSelectedItem({ fontFamily: String($event) })"
        >
          <ui-select-trigger class="w-full">
            <ui-select-value placeholder="Select font" />
          </ui-select-trigger>
          <ui-select-content>
            <ui-select-item
              v-for="font in fontFamilies"
              :key="font"
              :value="font"
            >
              {{ font }}
            </ui-select-item>
          </ui-select-content>
        </ui-select>
      </div>
      <!-- Text Color -->
      <div>
        <ui-label class="text-xs mb-1.5 block">
          Color
        </ui-label>
        <div class="flex items-center gap-2">
          <input
            :value="textItem?.fill"
            type="color"
            class="w-9 h-8 rounded border border-slate-200 cursor-pointer"
            @input="store.updateSelectedItem({ fill: ($event.target as HTMLInputElement).value })"
          >
          <ui-input
            :model-value="textItem?.fill"
            class="flex-1"
            @update:model-value="store.updateSelectedItem({ fill: String($event) })"
          />
        </div>
      </div>
    </div>

    <!-- Size & Opacity -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Font Size -->
      <div>
        <ui-label class="text-xs mb-1.5 block">
          Size
        </ui-label>
        <div class="flex items-center gap-2">
          <ui-slider
            :model-value="[textItem?.fontSize ?? 24]"
            :min="12"
            :max="120"
            :step="1"
            class="flex-1"
            @update:model-value="(val) => { if (val) store.updateSelectedItem({ fontSize: val[0] ?? 24 }) }"
          />
          <div class="w-8 text-right text-xs text-slate-500">
            {{ textItem?.fontSize }}
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
            :model-value="[(textItem?.opacity ?? 1) * 100]"
            :min="0"
            :max="100"
            :step="1"
            class="flex-1"
            @update:model-value="(val) => { if (val) store.updateSelectedItem({ opacity: (val[0] ?? 100) / 100 }) }"
          />
          <div class="w-8 text-right text-xs text-slate-500">
            {{ Math.round((textItem?.opacity ?? 1) * 100) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Style & Alignment -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Font Style Buttons -->
      <div>
        <ui-label class="text-xs mb-1.5 block">
          Style
        </ui-label>
        <div class="flex gap-1">
          <ui-button
            size="sm"
            :variant="textItem?.fontStyle === 'normal' ? 'secondary' : 'ghost'"
            @click="store.updateSelectedItem({ fontStyle: 'normal' })"
          >
            <icon
              name="lucide:type"
              class="w-4 h-4"
            />
          </ui-button>
          <ui-button
            size="sm"
            :variant="textItem?.fontStyle === 'bold' ? 'secondary' : 'ghost'"
            @click="store.updateSelectedItem({ fontStyle: 'bold' })"
          >
            <icon
              name="lucide:bold"
              class="w-4 h-4"
            />
          </ui-button>
          <ui-button
            size="sm"
            :variant="textItem?.fontStyle === 'italic' ? 'secondary' : 'ghost'"
            @click="store.updateSelectedItem({ fontStyle: 'italic' })"
          >
            <icon
              name="lucide:italic"
              class="w-4 h-4"
            />
          </ui-button>
        </div>
      </div>

      <!-- Text Alignment -->
      <div>
        <ui-label class="text-xs mb-1.5 block">
          Alignment
        </ui-label>
        <div class="flex gap-1">
          <ui-button
            size="sm"
            :variant="textItem?.align === 'left' ? 'secondary' : 'ghost'"
            @click="store.updateSelectedItem({ align: 'left' })"
          >
            <icon
              name="lucide:align-left"
              class="w-4 h-4"
            />
          </ui-button>
          <ui-button
            size="sm"
            :variant="textItem?.align === 'center' ? 'secondary' : 'ghost'"
            @click="store.updateSelectedItem({ align: 'center' })"
          >
            <icon
              name="lucide:align-center"
              class="w-4 h-4"
            />
          </ui-button>
          <ui-button
            size="sm"
            :variant="textItem?.align === 'right' ? 'secondary' : 'ghost'"
            @click="store.updateSelectedItem({ align: 'right' })"
          >
            <icon
              name="lucide:align-right"
              class="w-4 h-4"
            />
          </ui-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FONT_FAMILIES } from '~/composables/canvas';
import { useCanvasEditorStore } from '~/stores/canvasEditor';
import { isTextItem } from '~/types/canvas-editor';

const store = useCanvasEditorStore();
const fontFamilies = FONT_FAMILIES;

const textItem = computed(() => {
  if (store.selectedItem && isTextItem(store.selectedItem)) {
    return store.selectedItem;
  }
  return null;
});
</script>
