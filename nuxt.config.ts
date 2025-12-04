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
    redirect: false, // temporary dopoki nie ma logowania
    types: '@/types/database.types.ts',
  },
})
