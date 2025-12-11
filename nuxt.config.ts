import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'shadcn-nuxt',
  ],
  ssr: false,
  devtools: { enabled: true },
  app: {
    // Set base URL for GitHub Pages deployment
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Nuxt Kinda Figma - A Figma-like Canvas Editor',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A Figma-like canvas editor built with Nuxt 4, Vue 3, and Konva. Create and edit designs with text, images, shapes, and more.',
        },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://syed-haroon.github.io/nuxt-kinda-figma/' },
        { property: 'og:title', content: 'Nuxt Kinda Figma - A Figma-like Canvas Editor' },
        {
          property: 'og:description',
          content: 'A Figma-like canvas editor built with Nuxt 4, Vue 3, and Konva. Create and edit designs with text, images, shapes, and more.',
        },
        { property: 'og:image', content: 'https://syed-haroon.github.io/nuxt-kinda-figma/og-image.jpg' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://syed-haroon.github.io/nuxt-kinda-figma/' },
        { name: 'twitter:title', content: 'Nuxt Kinda Figma - A Figma-like Canvas Editor' },
        {
          name: 'twitter:description',
          content: 'A Figma-like canvas editor built with Nuxt 4, Vue 3, and Konva. Create and edit designs with text, images, shapes, and more.',
        },
        { name: 'twitter:image', content: 'https://syed-haroon.github.io/nuxt-kinda-figma/og-image.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      script: [],
    },

    pageTransition: {
      name: 'fade-pg',
      mode: 'out-in',
    },

    layoutTransition: {
      name: 'fade-pg',
      mode: 'out-in',
    },
  },
  css: ['~/assets/css/tailwind.css', '~/assets/css/custom.css'],
  compatibilityDate: '2025-07-15',

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  typescript: {
    shim: false,
    typeCheck: false,
  },

  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: true,
      },
    },
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: 'ui-',
    /**
     * Directory that the component lives in.
     * @default "./app/components/ui"
     */
    componentDir: './app/components/ui',
  },
});
