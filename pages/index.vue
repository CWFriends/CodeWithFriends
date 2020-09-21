<template>
  <div class="page">
    <HeroImage
      :page="page"
      :event-item="openEvents.length > 0 ? openEvents[0] : ''"
    ></HeroImage>
    <v-container>
      <v-row>
        <v-col md="7" cols="12">
          <nuxt-content :document="page"></nuxt-content>
        </v-col>
        <v-col md="5" cols="12">
          <h2 class="text-md-h4 text-h5">Recent News</h2>
          <v-row>
            <v-col v-for="(item, index) in news" :key="index">
              <NewsCard :news-item="item"></NewsCard>
            </v-col>
          </v-row>
          <div class="text-right">
            <nuxt-link to="/news" title="News">
              <v-btn text color="primary">
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
import HeroImage from '@/components/HeroImage'
import NewsCard from '@/components/NewsCard'

export default {
  components: {
    HeroImage,
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

  computed: {
    openEvents() {
      return this.$store.state.events.filter((event) => {
        return new Date(event['end-date']) > Date.now()
      })
    },
  },
  head: () => ({
    script: [
      { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' },
    ],
  }),
}
</script>
