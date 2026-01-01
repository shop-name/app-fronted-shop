export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  srcDir: 'src/',
  modules: ['@nuxt/eslint', 'vuetify-nuxt-module', '@pinia/nuxt'],
  css: ['@/assets/styles/global.scss'],
  typescript: {
    strict: true,
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
    },
  },
})
