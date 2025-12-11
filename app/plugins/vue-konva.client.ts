import VueKonva from 'vue-konva';

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.use(VueKonva);
});
