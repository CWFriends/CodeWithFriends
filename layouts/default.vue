<template>
  <v-app>
    <v-app-bar fixed app elevate-on-scroll>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn color="primary" text> FAQ </v-btn>
      <v-btn color="primary" text> Idea Kits </v-btn>
      <v-btn color="primary" text> Community </v-btn>
      <v-btn color="primary" text> Past Events </v-btn>
      <v-btn color="primary">
        <v-icon left>mdi-halloween</v-icon> CWF: Halloween
      </v-btn>
      <v-menu offset-y transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn icon v-if="!user.data">
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
            <v-avatar v-else>
              <img :src="user.data.avatar_url" />
            </v-avatar>
          </div>
        </template>
        <v-list>
          <v-list-item v-if="!user.data">
            <v-btn dark @click="signIn">
              <v-icon left>mdi-github</v-icon> Sign in with Github
            </v-btn>
          </v-list-item>

          <v-list-item v-else>
            <v-btn dark @click="logOut"> Sign Out </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app absolute>
      <span>&copy; {{ new Date().getFullYear() }}, {{ title }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import 'firebase/auth'
import firebase, { auth } from 'firebase/app'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'DefaultLayout',
  data: () => ({
    title: 'Code With Friends',
  }),
  computed: {
    ...mapState({
      user: 'user',
    }),
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) return
      this.getUserData(user)
    })
  },
  methods: {
    ...mapActions({
      getUserData: 'getUserData',
      logIn: 'logIn',
      logOut: 'logOut',
    }),
    signIn() {
      const provider = new auth.GithubAuthProvider()

      firebase
        .auth()
        .setPersistence(auth.Auth.Persistence.LOCAL)
        .then(() => {
          return firebase
            .auth()
            .signInWithPopup(provider)
            .then(({ credential }) => {
              this.logIn(credential.accessToken)
            })
        })
    },
  },
}
</script>
