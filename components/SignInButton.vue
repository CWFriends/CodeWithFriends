<template>
  <v-btn dark :loading="user.loading" @click="signIn">
    <v-icon left>mdi-github</v-icon> Sign in with Github
  </v-btn>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SignInButton',
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapActions({
      logIn: 'user/logIn',
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
