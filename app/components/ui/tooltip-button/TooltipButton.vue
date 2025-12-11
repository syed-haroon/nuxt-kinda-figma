<template>
  <ui-tooltip>
    <ui-tooltip-trigger as-child>
      <slot />
    </ui-tooltip-trigger>
    <ui-tooltip-content>
      <p>{{ tooltipText }}</p>
    </ui-tooltip-content>
  </ui-tooltip>
</template>

<script setup lang="ts">
defineProps<{
  tooltipText: string;
}>();
</script>
