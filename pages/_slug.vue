<template>
  <div class="page">
    <Hero :page="page"></Hero>
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
import Hero from '@/components/Hero'

export default {
  components: {
    Hero,
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
          hid: 'description',
          name: 'description',
          content:
            this.page.description || this.$store.state.defaults.description,
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
          href: this.$store.state.url + this.slug,
        },
      ],
    }
  },
}
</script>
