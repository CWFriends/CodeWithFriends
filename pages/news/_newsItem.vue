<template>
  <div class="page">
    <HeroImage :page="page" :date="page.date"></HeroImage>
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
import HeroImage from '@/components/HeroImage'

export default {
  components: {
    HeroImage,
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
          hid: 'og:title',
          property: 'og:title',
          name: 'title',
          content: this.page.title,
        },
        {
          hid: 'description',
          name: 'description',
          content:
            this.page.description || this.$store.state.defaults.description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          name: 'description',
          content:
            this.page.description || this.$store.state.defaults.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          name: 'image',
          content: (
            this.$store.state.url +
            (this.page['meta-img'] || this.$store.state.defaults['meta-image'])
          ).replace('//img', '/img'),
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$store.state.url + 'news/' + this.page.slug,
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
