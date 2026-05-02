// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@vueuse/nuxt',
  ],

  typescript: {
    tsConfig: {
      typeCheck: true,
      vueCompilerOptions: {
        strictTemplates: true,
        fallthroughAttributes: true,
      },
    },
  },
})
