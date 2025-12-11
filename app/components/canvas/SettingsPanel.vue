<template>
  <ui-accordion
    type="single"
    collapsible
    class="space-y-2"
  >
    <!-- Canvas Size -->
    <ui-accordion-item value="canvas-size">
      <ui-accordion-trigger class="text-xs font-semibold text-slate-500 uppercase tracking-wide py-2">
        <div class="flex items-center gap-2">
          <icon
            name="lucide:ruler"
            class="text-lg"
          />
          Canvas Size
          <span class="font-normal normal-case text-slate-400 ml-1">
            {{ store.stageConfig.width }}×{{ store.stageConfig.height }}
          </span>
        </div>
      </ui-accordion-trigger>
      <ui-accordion-content class="space-y-3 py-5">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <ui-label class="text-xs mb-1.5 block">
              Width
            </ui-label>
            <div class="flex items-center gap-1">
              <ui-input
                :model-value="store.stageConfig.width"
                type="number"
                :min="100"
                :max="2000"
                class="flex-1"
                @update:model-value="(val) => store.setStageWidth(Number(val) || 800)"
              />
              <span class="text-xs text-slate-400">px</span>
            </div>
          </div>
          <div>
            <ui-label class="text-xs mb-1.5 block">
              Height
            </ui-label>
            <div class="flex items-center gap-1">
              <ui-input
                :model-value="store.stageConfig.height"
                type="number"
                :min="100"
                :max="2000"
                class="flex-1"
                @update:model-value="(val) => store.setStageHeight(Number(val) || 800)"
              />
              <span class="text-xs text-slate-400">px</span>
            </div>
          </div>
        </div>
        <!-- Preset Sizes -->
        <div>
          <ui-label class="text-xs mb-1.5 block">
            Presets
          </ui-label>
          <div class="grid grid-cols-3 gap-1">
            <ui-tooltip-button
              v-for="preset in sizePresets"
              :key="preset.label"
              :tooltip-text="preset.tooltip"
            >
              <ui-button
                size="sm"
                variant="outline"
                class="text-xs w-full"
                @click="store.setStageSize(preset.width, preset.height)"
              >
                {{ preset.label }}
              </ui-button>
            </ui-tooltip-button>
          </div>
        </div>
      </ui-accordion-content>
    </ui-accordion-item>

    <!-- Canvas Background -->
    <ui-accordion-item value="canvas-background">
      <ui-accordion-trigger class="text-xs font-semibold text-slate-500 uppercase tracking-wide py-2">
        <div class="flex items-center gap-2">
          <icon
            name="lucide:palette"
            class="text-lg"
          />
          Canvas Background
          <div
            class="w-4 h-4 rounded border border-slate-200 ml-1"
            :style="{ background: store.backgroundPreview }"
          />
        </div>
      </ui-accordion-trigger>
      <ui-accordion-content class="space-y-3 py-5">
        <div class="flex gap-2 items-center">
          <div class="flex rounded-lg overflow-hidden border border-slate-100">
            <ui-button
              size="sm"
              :variant="store.backgroundType === 'solid' ? 'default' : 'ghost'"
              class="rounded-r-none"
              @click="store.setBackgroundType('solid')"
            >
              <icon
                name="lucide:droplet"
                class="w-4 h-4"
              />
              <span class="text-xs">Solid</span>
            </ui-button>
            <ui-button
              size="sm"
              :variant="store.backgroundType === 'gradient' ? 'default' : 'ghost'"
              class="rounded-l-none"
              @click="store.setBackgroundType('gradient')"
            >
              <icon
                name="lucide:sunset"
                class="w-4 h-4"
              />
              <span class="text-xs">Gradient</span>
            </ui-button>
          </div>
        </div>

        <!-- Solid Color -->
        <div
          v-if="store.backgroundType === 'solid'"
          class="flex gap-3 items-center"
        >
          <input
            :value="store.backgroundColor"
            type="color"
            class="w-11 h-9 rounded border border-slate-200 cursor-pointer"
            @input="store.setBackgroundColor(($event.target as HTMLInputElement).value)"
          >
          <ui-input
            :model-value="store.backgroundColor"
            placeholder="#ffffff"
            class="flex-1"
            @update:model-value="store.setBackgroundColor(String($event))"
          />
        </div>

        <!-- Gradient Stops -->
        <div
          v-else
          class="space-y-2"
        >
          <div
            v-for="(stop, index) in store.gradientStops"
            :key="index"
            class="flex gap-2 items-center"
          >
            <input
              :value="stop.color"
              type="color"
              class="w-9 h-8 rounded border border-slate-200 cursor-pointer"
              @input="store.updateGradientStop({ index, color: ($event.target as HTMLInputElement).value })"
            >
            <ui-slider
              :model-value="[stop.position]"
              :max="100"
              :step="1"
              class="flex-1"
              @update:model-value="(val) => { if (val) store.updateGradientStop({ index, position: val[0] ?? 0 }) }"
            />
            <div class="w-10 text-right text-xs text-slate-500">
              {{ stop.position }}%
            </div>
            <ui-button
              v-if="store.gradientStops.length > 2"
              size="icon-sm"
              variant="ghost"
              @click="store.removeGradientStop(index)"
            >
              <icon
                name="lucide:minus-circle"
                class="w-4 h-4 text-rose-500"
              />
            </ui-button>
          </div>
          <ui-button
            v-if="store.gradientStops.length < 5"
            size="sm"
            variant="outline"
            class="w-full"
            @click="store.addGradientStop()"
          >
            <icon
              name="lucide:plus"
              class="w-4 h-4"
            />
            Add Stop
          </ui-button>
        </div>
      </ui-accordion-content>
    </ui-accordion-item>
  </ui-accordion>
</template>

<script setup lang="ts">
import { CANVAS_SIZE_PRESETS } from '~/composables/canvas';
import { useCanvasEditorStore } from '~/stores/canvasEditor';

const store = useCanvasEditorStore();
const sizePresets = CANVAS_SIZE_PRESETS;
</script>
