<template>
  <div class="page">
    <Hero :page="page" :date="page.date"></Hero>
    <v-container>
      <v-row>
        <v-col cols="12">
          <nuxt-content :document="page"></nuxt-content>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Hero from '@/components/Hero'

export default {
  components: {
    Hero,
  },
  async asyncData({ $content, params }) {
    const page = await $content('news', params.newsItem).fetch()
    return {
      page,
    }
  },
  head() {
    return {
      title: this.page.title,
      titleTemplate: '%s | ' + this.$store.state.defaults.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            this.page.description || this.$store.state.defaults.description,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content:
            this.page.description || this.$store.state.defaults.description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$store.state.url + 'news/' + this.page.slug,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content:
            this.$store.state.url +
            (this.page['meta-img'] || this.$store.state.defaults['meta-image']),
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.page.title,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$store.state.url + 'news/' + this.page.slug,
        },
      ],
    }
  },
}
</script>
