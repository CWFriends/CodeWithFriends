<template>
  <div class="page">
    <HeroImage :page="page"></HeroImage>
    <v-container>
      <v-row>
        <v-col cols="12">
          <nuxt-content :document="page"></nuxt-content>
          <v-expansion-panels v-if="page['collapsible-content']">
            <v-expansion-panel
              v-for="(item, i) in page['collapsible-content']"
              :key="i"
            >
              <v-expansion-panel-header>
                <h3>{{ item.header }}</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                {{ item.content }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
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
    const page = await $content('static-page', params.slug).fetch()
    return {
      page,
      slug: params.slug,
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
          content: this.$store.state.url + this.slug,
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
