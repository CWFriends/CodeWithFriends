<template>
  <v-app-bar fixed app elevate-on-scroll>
    <nuxt-link to="/">
      <v-avatar tile>
        <img :src="defaults.logo" style="object-fit: contain" />
      </v-avatar>
    </nuxt-link>
    <v-toolbar-title class="mx-2" v-text="defaults.title" />
    <v-spacer />
    <nuxt-link
      v-for="(page, i) in menus.header"
      :key="i"
      :to="'/' + page.slug"
      class="mx-2"
    >
      <v-btn color="primary" text>{{ page.title }}</v-btn>
    </nuxt-link>
    <v-menu offset-y open-on-hover transition="slide-y-transition" class="mx-2">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" text v-bind="attrs" v-on="on"> Community </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in socialMedia"
          :key="index"
          :href="item.url"
          target="_blank"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-menu>
    <nuxt-link to="/news" class="mx-2">
      <v-btn color="primary" text> News </v-btn>
    </nuxt-link>
    <nuxt-link to="/events" class="mx-2">
      <v-btn color="primary" text> Events </v-btn>
    </nuxt-link>
    <nuxt-link
      v-if="new Date(events[0]['end-date']) > Date.now()"
      :to="events[0].path"
    >
      <v-btn color="primary" class="mx-2">
        <v-icon left v-text="events[0].icon"></v-icon> {{ events[0].title }}
      </v-btn>
    </nuxt-link>
    <v-menu offset-y transition="slide-y-transition">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" class="ml-4" v-on="on">
          <v-btn v-if="!user.data" icon>
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
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Header',
  computed: {
    ...mapState(['user', 'menus', 'defaults', 'socialMedia', 'events']),
  },
  mounted() {
    this.$fireAuth.onAuthStateChanged((user) => {
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
