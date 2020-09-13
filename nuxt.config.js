import colors from 'vuetify/es5/util/colors'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', href: '/icon.ico' },
      { rel: 'mask-icon', href: '/icon.png', color: '#3A5066' },
      {
        hid: 'canonical',
        rel: 'canonical',
        href: 'https://code-with-friends.netlify.app',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/firebase',
    '@nuxt/content',
  ],

  firebase: {
    config: {
      apiKey: 'AIzaSyBe2FugVYTRdOTdcJir_Q0__GHD0su3kcY',
      authDomain: 'code-with-friends.firebaseapp.com',
      databaseURL: 'https://code-with-friends.firebaseio.com',
      projectId: 'code-with-friends',
      storageBucket: 'code-with-friends.appspot.com',
      messagingSenderId: '699377183793',
      appId: '1:699377183793:web:d3cfd25e266f2ecccc3910',
    },
    services: {
      auth: true,
      firestore: true,
    },
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
}
