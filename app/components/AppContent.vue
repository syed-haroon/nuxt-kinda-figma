<template>
  <div
    v-if="hasDrawer"
    class="flex gap-5 p-5 min-h-screen relative"
  >
    <!-- If hasDrawer then two-column layout -->
    <!-- Left column: top-bar + main content -->
    <div class="flex-1 flex flex-col space-y-5 min-w-0">
      <app-topbar
        :drawer-open="isDrawerOpen"
        @toggle-drawer="toggleDrawer"
      >
        <slot name="top-bar" />
      </app-topbar>

      <main class="relative flex-1">
        <slot />
      </main>
    </div>

    <!-- Overlay for mobile when drawer is open -->
    <div
      v-if="isDrawerOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
      @click="closeDrawer"
    />

    <!-- Right column: drawer (full height) -->
    <aside
      class="w-80 shrink-0 transition-transform duration-300 ease-in-out z-50"
      :class="drawerClasses"
    >
      <div class="absolute inset-0 bg-white rounded-lg shadow flex flex-col">
        <!-- Close button for mobile -->
        <div class="flex justify-end lg:hidden p-2">
          <ui-button
            variant="ghost"
            size="icon"
            aria-label="Close drawer"
            @click="closeDrawer"
          >
            <icon
              name="lucide:x"
              class="text-lg text-gray-600"
            />
          </ui-button>
        </div>
        <slot name="drawer" />
      </div>
    </aside>
  </div>

  <div
    v-else
    class="flex flex-col p-5 min-h-screen space-y-5"
  >
    <!-- Without drawer: single-column layout -->
    <app-topbar>
      <slot name="top-bar" />
    </app-topbar>

    <main class="relative flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const slots = useSlots();
const hasDrawer = computed(() => !!slots.drawer);

// Drawer state - closed on mobile by default, open on desktop
const isDrawerOpen = ref(false);
const isMobile = ref(false);

// Check if mobile and set initial drawer state
const checkScreenSize = () => {
  const mobile = window.innerWidth < 1024;
  isMobile.value = mobile;

  // On desktop, always keep drawer open
  if (!mobile) {
    isDrawerOpen.value = true;
  }
  // On mobile, keep current state (don't auto-close when resizing)
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

// Computed classes for drawer positioning
const drawerClasses = computed(() => {
  const classes: string[] = [];

  if (isMobile.value) {
    // Mobile: fixed positioning, slides in/out
    classes.push('fixed', 'right-0', 'top-0', 'h-full');
    classes.push(isDrawerOpen.value ? 'translate-x-0' : 'translate-x-full');
  }
  else {
    // Desktop: always visible, relative positioning
    classes.push('relative', 'translate-x-0');
  }

  return classes.join(' ');
});
</script>
