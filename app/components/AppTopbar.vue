<template>
  <div class="flex items-center gap-3 bg-white p-2 rounded-lg shadow">
    <div>
      <icon
        name="lucide:brush"
        class="text-xl"
      />
    </div>
    <div class="flex-1">
      <slot />
    </div>
    <!-- Drawer toggle button (mobile only) -->
    <div
      v-if="showDrawerToggle"
      class="lg:hidden"
    >
      <ui-button
        aria-label="Toggle drawer"
        @click="$emit('toggle-drawer')"
      >
        <icon
          :name="drawerOpen ? 'lucide:panel-left-close' : 'lucide:panel-left-open'"
        />
      </ui-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  backRoute?: string;
  drawerOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  drawerOpen: false,
});

defineEmits<{
  'toggle-drawer': [];
}>();

// Show toggle button if drawerOpen prop is provided
const showDrawerToggle = computed(() => props.drawerOpen !== undefined);
</script>
