<template>
  <div
    v-if="hasDrawer"
    class="flex gap-5 p-5 min-h-screen"
  >
    <!-- If hasDrawer then two-column layout -->
    <!-- Left column: top-bar + main content -->
    <div class="flex-1 flex flex-col space-y-5 min-w-0">
      <app-topbar :back-route="backRoute">
        <slot name="top-bar" />
      </app-topbar>
      <main class="relative flex-1">
        <slot />
      </main>
    </div>

    <!-- Right column: drawer (full height) -->
    <aside class="w-80 shrink-0 relative">
      <div class="absolute inset-0 bg-white rounded-lg shadow flex flex-col">
        <slot name="drawer" />
      </div>
    </aside>
  </div>

  <div
    v-else
    class="flex flex-col p-5 min-h-screen space-y-5"
  >
    <!-- Without drawer: single-column layout -->
    <app-topbar :back-route="backRoute">
      <slot name="top-bar" />
    </app-topbar>
    <main class="relative flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
interface Props {
  backRoute?: string;
}

defineProps<Props>();

const slots = useSlots();

const hasDrawer = computed(() => !!slots.drawer);
</script>
