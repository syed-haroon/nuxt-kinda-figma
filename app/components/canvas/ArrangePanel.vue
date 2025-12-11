<template>
  <ui-card class="border-0 shadow-none">
    <ui-card-header class="p-0">
      <ui-card-title class="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Arrange
      </ui-card-title>
    </ui-card-header>
    <ui-card-content class="p-0 space-y-3">
      <!-- Layer Order -->
      <div>
        <ui-label class="text-xs mb-1.5 block">
          Layer
        </ui-label>
        <div class="flex gap-1">
          <ui-tooltip-button tooltip-text="Send to Back">
            <ui-button
              size="sm"
              variant="outline"
              @click="store.changeLayerOrder('back')"
            >
              <icon
                name="lucide:arrow-down-to-line"
                class="w-4 h-4"
              />
            </ui-button>
          </ui-tooltip-button>
          <ui-tooltip-button tooltip-text="Send Backward">
            <ui-button
              size="sm"
              variant="outline"
              @click="store.changeLayerOrder('backward')"
            >
              <icon
                name="lucide:arrow-down"
                class="w-4 h-4"
              />
            </ui-button>
          </ui-tooltip-button>
          <ui-tooltip-button tooltip-text="Bring Forward">
            <ui-button
              size="sm"
              variant="outline"
              @click="store.changeLayerOrder('forward')"
            >
              <icon
                name="lucide:arrow-up"
                class="w-4 h-4"
              />
            </ui-button>
          </ui-tooltip-button>
          <ui-tooltip-button tooltip-text="Bring to Front">
            <ui-button
              size="sm"
              variant="outline"
              @click="store.changeLayerOrder('front')"
            >
              <icon
                name="lucide:arrow-up-to-line"
                class="w-4 h-4"
              />
            </ui-button>
          </ui-tooltip-button>
        </div>
      </div>

      <!-- Alignment -->
      <div>
        <ui-label class="text-xs mb-1.5 block">
          Align to Canvas
        </ui-label>
        <div class="flex items-center gap-2">
          <!-- Horizontal Alignment -->
          <div class="flex gap-1">
            <ui-tooltip-button tooltip-text="Align Left">
              <ui-button
                size="sm"
                variant="outline"
                @click="store.alignItem('left')"
              >
                <icon
                  name="lucide:align-horizontal-justify-start"
                  class="w-4 h-4"
                />
              </ui-button>
            </ui-tooltip-button>
            <ui-tooltip-button tooltip-text="Align Center Horizontally">
              <ui-button
                size="sm"
                variant="outline"
                @click="store.alignItem('center-h')"
              >
                <icon
                  name="lucide:align-horizontal-justify-center"
                  class="w-4 h-4"
                />
              </ui-button>
            </ui-tooltip-button>
            <ui-tooltip-button tooltip-text="Align Right">
              <ui-button
                size="sm"
                variant="outline"
                @click="store.alignItem('right')"
              >
                <icon
                  name="lucide:align-horizontal-justify-end"
                  class="w-4 h-4"
                />
              </ui-button>
            </ui-tooltip-button>
          </div>

          <!-- Divider -->
          <div class="w-px h-6 bg-slate-200" />

          <!-- Vertical Alignment -->
          <div class="flex gap-1">
            <ui-tooltip-button tooltip-text="Align Top">
              <ui-button
                size="sm"
                variant="outline"
                @click="store.alignItem('top')"
              >
                <icon
                  name="lucide:align-vertical-justify-start"
                  class="w-4 h-4"
                />
              </ui-button>
            </ui-tooltip-button>
            <ui-tooltip-button tooltip-text="Align Center Vertically">
              <ui-button
                size="sm"
                variant="outline"
                @click="store.alignItem('center-v')"
              >
                <icon
                  name="lucide:align-vertical-justify-center"
                  class="w-4 h-4"
                />
              </ui-button>
            </ui-tooltip-button>
            <ui-tooltip-button tooltip-text="Align Bottom">
              <ui-button
                size="sm"
                variant="outline"
                @click="store.alignItem('bottom')"
              >
                <icon
                  name="lucide:align-vertical-justify-end"
                  class="w-4 h-4"
                />
              </ui-button>
            </ui-tooltip-button>
          </div>
        </div>
      </div>
    </ui-card-content>
  </ui-card>
</template>

<script setup lang="ts">
import { useCanvasEditorStore } from '~/stores/canvasEditor';

const store = useCanvasEditorStore();
</script>
