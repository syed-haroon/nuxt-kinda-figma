<template>
  <div class="absolute bottom-4 inset-x-0 flex justify-center z-50 pointer-events-none">
    <div class="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-xl px-2 py-1.5 shadow-lg border border-slate-200/80">
      <!-- View Mode Toggle -->
      <div class="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
        <ui-button
          size="sm"
          :variant="store.viewMode === 'fit' ? 'default' : 'ghost'"
          class="text-xs px-2.5 h-7 rounded-md"
          @click="store.setViewMode('fit')"
        >
          <icon
            name="lucide:minimize-2"
            class="w-3.5 h-3.5"
          />
        </ui-button>
        <ui-button
          size="sm"
          :variant="store.viewMode === 'actual' ? 'default' : 'ghost'"
          class="text-xs px-2.5 h-7 rounded-md"
          @click="store.setViewMode('actual')"
        >
          <icon
            name="lucide:maximize-2"
            class="w-3.5 h-3.5"
          />
        </ui-button>
      </div>

      <!-- Divider -->
      <div class="w-px h-6 bg-slate-200 mx-1" />

      <!-- Add Elements -->
      <div class="flex items-center gap-0.5">
        <ui-tooltip-button tooltip-text="Add Text">
          <ui-button
            size="sm"
            variant="ghost"
            class="text-xs px-2.5 h-7"
            @click="store.addItem('text')"
          >
            <icon
              name="lucide:type"
              class="w-4 h-4"
            />
          </ui-button>
        </ui-tooltip-button>
        <ui-tooltip-button tooltip-text="Add Image">
          <label class="cursor-pointer">
            <input
              ref="imageInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageUpload"
            >
            <div class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-all h-8 w-8 hover:bg-slate-100">
              <icon
                name="lucide:image"
                class="w-4 h-4"
              />
            </div>
          </label>
        </ui-tooltip-button>
      </div>

      <!-- Divider -->
      <div class="w-px h-6 bg-slate-200 mx-1" />

      <!-- Add Shapes -->
      <div class="flex items-center gap-0.5">
        <ui-tooltip-button tooltip-text="Add Line">
          <ui-button
            size="sm"
            variant="ghost"
            class="text-xs px-2.5 h-7"
            @click="store.addItem('line')"
          >
            <icon
              name="lucide:minus"
              class="w-4 h-4"
            />
          </ui-button>
        </ui-tooltip-button>
        <ui-tooltip-button tooltip-text="Add Rectangle">
          <ui-button
            size="sm"
            variant="ghost"
            class="text-xs px-2.5 h-7"
            @click="store.addItem('rect')"
          >
            <icon
              name="lucide:square"
              class="w-4 h-4"
            />
          </ui-button>
        </ui-tooltip-button>
        <ui-tooltip-button tooltip-text="Add Circle">
          <ui-button
            size="sm"
            variant="ghost"
            class="text-xs px-2.5 h-7"
            @click="store.addItem('circle')"
          >
            <icon
              name="lucide:circle"
              class="w-4 h-4"
            />
          </ui-button>
        </ui-tooltip-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasEditorStore } from '~/stores/canvasEditor';

const store = useCanvasEditorStore();
const imageInputRef = ref<HTMLInputElement | null>(null);

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    store.addImageFromFile(file);
    input.value = '';
  }
};
</script>
