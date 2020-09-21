<template>
  <v-footer>
    <v-container fluid>
      <v-row align="center">
        <v-col class="text-sm-right" cols="12" sm="6" order-sm="2">
          <nuxt-link
            v-for="(page, i) in menus.footer"
            :key="i"
            :to="'/' + page.slug"
            :title="page.title"
          >
            <v-btn color="primary" text small>{{ page.title }}</v-btn>
          </nuxt-link>
        </v-col>
        <v-col cols="12" sm="6" order-sm="1">
          <span class="grey--text text-body-2"
            >&copy; {{ new Date().getFullYear() }}, {{ defaults.title }}</span
          >
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Footer',
  computed: {
    ...mapState(['menus', 'defaults']),
  },
}
</script>
