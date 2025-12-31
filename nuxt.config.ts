export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  srcDir: 'src/',
  modules: ['@nuxt/eslint'],
  typescript: {
    strict: true,
  },
})
