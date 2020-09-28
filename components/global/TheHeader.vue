<template>
  <div>
    <v-app-bar fixed app elevate-on-scroll>
      <nuxt-link to="/" :title="defaults.title">
        <v-avatar tile>
          <img
            :src="defaults.logo"
            style="object-fit: contain"
            :alt="defaults.title"
          />
        </v-avatar>
      </nuxt-link>
      <v-spacer />
      <div class="d-none d-md-block">
        <v-btn
          v-for="(page, i) in menus.header"
          :key="i"
          color="primary"
          text
          :to="'/' + page.slug"
          :title="page.title"
          class="mx-2"
          >{{ page.title }}</v-btn
        >
        <v-menu
          offset-y
          open-on-hover
          transition="slide-y-transition"
          class="mx-2"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" text v-bind="attrs" v-on="on">
              Community
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in socialMedia"
              :key="index"
              :href="item.url"
              :title="item.name"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn color="primary" text to="/news" title="News" class="mx-2">
          News
        </v-btn>
        <v-btn color="primary" text to="/events" title="Events" class="mx-2">
          Events
        </v-btn>

        <v-btn
          v-if="openEvents.length > 0"
          :to="openEvents[0].path"
          :title="openEvents[0].title"
          color="accent"
          class="mx-2"
        >
          <v-icon
            v-if="openEvents[0].icon"
            left
            v-text="openEvents[0].icon"
          ></v-icon>
          {{ openEvents[0].title }}
        </v-btn>
      </div>
      <v-menu offset-y transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" class="ml-4 d-none d-md-block" v-on="on">
            <v-btn v-if="!user.data || !user.data.avatar_url" icon c>
              <v-icon x-large>mdi-account-circle</v-icon>
            </v-btn>
            <v-avatar v-else>
              <img :src="user.data.avatar_url" />
            </v-avatar>
          </div>
        </template>
        <v-list>
          <v-list-item v-if="!user.loggedIn">
            <SignInButton></SignInButton>
          </v-list-item>

          <v-list-item v-else>
            <v-btn dark @click="logOut"> Sign Out </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-app-bar-nav-icon
        aria-label="Menu Toggle"
        class="d-md-none"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" fixed temporary right>
      <template v-slot:prepend>
        <v-list-item v-if="!user.loggedIn">
          <SignInButton class="mx-auto"></SignInButton>
        </v-list-item>
        <v-list-item v-else>
          <v-list-item-avatar>
            <img v-if="user.data.avatar_url" :src="user.data.avatar_url" />
            <v-icon v-else x-large>mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.data.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.data.email }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="logOut">
              <v-icon color="grey lighten-1">mdi-logout</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item
            v-for="(page, i) in menus.header"
            :key="i"
            :to="'/' + page.slug"
            :title="page.title"
          >
            <v-list-item-title>{{ page.title }}</v-list-item-title>
          </v-list-item>

          <v-list-item to="/news" title="News">
            <v-list-item-title>News</v-list-item-title>
          </v-list-item>

          <v-list-item to="/events" title="News">
            <v-list-item-title>Events</v-list-item-title>
          </v-list-item>

          <v-list-item
            v-if="openEvents.length > 0"
            :to="openEvents[0].path"
            :title="openEvents[0].title"
          >
            <v-btn color="accent" class="mx-auto">
              <v-icon
                v-if="openEvents[0].icon"
                left
                v-text="openEvents[0].icon"
              ></v-icon>
              {{ openEvents[0].title }}
            </v-btn>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <v-container class="text-center">
          <v-btn
            v-for="(item, index) in socialMedia"
            :key="index"
            :href="item.url"
            :title="item.name"
            target="_blank"
            rel="noopener noreferrer"
            icon
          >
            <v-icon v-text="item.icon"></v-icon>
          </v-btn>
        </v-container>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SignInButton from '@/components/SignInButton'

export default {
  name: 'Header',
  components: {
    SignInButton,
  },
  data: () => ({
    drawer: false,
    group: null,
  }),
  computed: {
    ...mapState(['user', 'menus', 'defaults', 'socialMedia', 'events']),
    openEvents() {
      return this.events.filter((event) => {
        return new Date(event['end-date']) > Date.now()
      })
    },
  },
  watch: {
    group() {
      this.drawer = false
    },
  },
  mounted() {
    this.$fireAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.stopUserLoading()
        return
      }
      this.getUserData(user)
    })
  },
  methods: {
    ...mapActions({
      logOut: 'user/logOut',
      getUserData: 'user/getUserData',
      stopUserLoading: 'user/stopUserLoading',
    }),
  },
}
</script>
