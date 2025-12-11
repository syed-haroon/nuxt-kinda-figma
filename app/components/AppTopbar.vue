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
  </div>
</template>
