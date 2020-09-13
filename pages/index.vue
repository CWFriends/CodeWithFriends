<template>
  <div class="page">
    <Hero :page="page"></Hero>
    <v-container>
      <v-row>
        <v-col sm="8" cols="12">
          <nuxt-content :document="page"></nuxt-content>
        </v-col>
        <v-col sm="4" cols="12">
          <h2>Recent News</h2>
          <v-card
            v-for="(item, index) in news"
            :key="index"
            :to="item.path"
            class="my-6"
          >
            <v-img
              class="align-end"
              height="150px"
              :src="item['meta-image']"
              v-if="item['meta-image']"
            ></v-img>
            <v-card-title v-text="item.title"></v-card-title>
            <v-card-subtitle v-text="getDate(item.date)"></v-card-subtitle>
            <v-card-text v-text="item.description"></v-card-text>
          </v-card>
          <div class="text-right">
            <nuxt-link to="/news">
              <v-btn text>
                View all News <v-icon right>mdi-chevron-right</v-icon>
              </v-btn>
            </nuxt-link>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Hero from '@/components/Hero'
import moment from 'moment'

export default {
  async asyncData({ $content, store }) {
    const page = await $content(
      'static-page',
      store.state.defaults['home-page']
    ).fetch()

    const news = await $content('news').sortBy('date', 'desc').limit(3).fetch()

    return {
      page,
      news,
    }
  },
  head: () => ({
    script: [
      { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' },
    ],
  }),
  components: {
    Hero,
  },
  methods: {
    getDate(date) {
      return moment(date).format('MMMM Do, YYYY')
    },
  },
}
</script>
