<template>
  <div class="page">
    <HeroImage :page="{ title }"></HeroImage>
    <v-container>
      <v-row align="stretch">
        <v-col
          v-for="(item, index) in newsItems"
          :key="index"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <NewsCard :news-item="item"></NewsCard>
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
  async asyncData({ $content, params }) {
    const newsItems = await $content('news').fetch()
    return {
      newsItems,
    }
  },
  data: () => ({
    title: 'News',
    slug: 'news',
  }),
  head() {
    return {
      title: this.title,
      titleTemplate: '%s | ' + this.$store.state.defaults.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$store.state.defaults.description,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$store.state.defaults.description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$store.state.url + this.slug,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content:
            this.$store.state.url + this.$store.state.defaults['meta-image'],
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.title,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$store.state.url + this.slug,
        },
      ],
    }
  },
}
</script>
