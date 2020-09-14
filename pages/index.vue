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
          <v-row>
            <v-col cols="12" v-for="(item, index) in news" :key="index">
              <NewsCard :news-item="item"></NewsCard>
            </v-col>
          </v-row>
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
import NewsCard from '@/components/NewsCard'

export default {
  components: {
    Hero,
    NewsCard,
  },
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
}
</script>
