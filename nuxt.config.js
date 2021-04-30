export default {
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
      { rel: 'icon', href: '/ico.png' },
      { rel: 'mask-icon', href: '/ico.png', color: '#082437' },
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
      production: {
        apiKey: 'AIzaSyAyqHj6pZOwGO2CzovkbuJBx0UzwFWxUUo',
        authDomain: 'code-with-friends.firebaseapp.com',
        databaseURL: 'https://code-with-friends.firebaseio.com',
        projectId: 'code-with-friends',
        storageBucket: 'code-with-friends.appspot.com',
        messagingSenderId: '699377183793',
        appId: '1:699377183793:web:ee04f5874143db79cc3910',
        measurementId: 'G-GVEGPBTFDS',
      },
      development: {
        apiKey: 'AIzaSyBtafxKJemjcOOIg8o5hJ1YkZ-dNyYTMEw',
        authDomain: 'code-with-friends-dev.firebaseapp.com',
        databaseURL: 'https://code-with-friends-dev.firebaseio.com',
        projectId: 'code-with-friends-dev',
        storageBucket: 'code-with-friends-dev.appspot.com',
        messagingSenderId: '534136463987',
        appId: '1:534136463987:web:0afd439c8dabac4c528006',
      },
    },
    services: {
      auth: true,
      firestore: true,
      storage: true,
      functions: true,
      performance: process.env.NODE_ENV === 'production',
      analytics: process.env.NODE_ENV === 'production',
    },
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#355068',
          accent: '#E67849',
        },
      },
    },
  },

  pwa: {
    meta: {
      theme_color: '#082437',
    },
    manifest: {
      name: 'Code with Friends',
      short_name: 'CWF',
      background_color: '#082437',
      theme_color: '#082437',
    },
    icon: {
      fileName: 'ico.png',
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
    },
  },
}
