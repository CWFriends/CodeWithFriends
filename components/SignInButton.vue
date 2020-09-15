<template>
  <v-btn dark @click="signIn">
    <v-icon left>mdi-github</v-icon> Sign in with Github
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SignInButton',
  methods: {
    ...mapActions({
      logIn: 'logIn',
    }),
    signIn() {
      const provider = new this.$fireAuthObj.GithubAuthProvider()

      this.$fireAuth.signInWithPopup(provider).then(({ user, credential }) => {
        this.logIn({
          user,
          token: credential.accessToken,
        })
      })
    },
  },
}
</script>
