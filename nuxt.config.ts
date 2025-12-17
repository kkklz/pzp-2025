// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  vite: {
    optimizeDeps: {
      include: ['@supabase/supabase-js'], // potrzebne do tego modulu bo nuxt cos zepsul i bez tego nie dziala xD
    },
  },
  ssr: false,
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module',
    '@unocss/nuxt',
    '@nuxtjs/supabase',
  ],
  typescript: {
    typeCheck: true,
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/register'],
    },
    types: '@/types/database.types.ts',
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
        themes: {
          dark: {
            dark: true,
            colors: {
              'background': '#0a0a0e',
              'surface': '#1a1a24',
              'surface-bright': '#242430',
              'surface-light': '#2a2a38',
              'surface-variant': '#32323e',
              'on-surface-variant': '#a0a0b0',
              'primary': '#a855f7',
              'primary-darken-1': '#7c3aed',
              'secondary': '#3b82f6',
              'secondary-darken-1': '#2563eb',
              'accent': '#ec4899',
              'error': '#ef4444',
              'info': '#3b82f6',
              'success': '#22c55e',
              'warning': '#f59e0b',
            },
          },
        },
      },
    },
  },
})
