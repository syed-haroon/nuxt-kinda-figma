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
      title: 'Kinda Canva',
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
