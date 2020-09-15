<template>
  <v-app>
    <TheHeader></TheHeader>
    <v-main>
      <nuxt />
    </v-main>
    <TheFooter></TheFooter>
  </v-app>
</template>

<script>
import TheHeader from '@/components/global/TheHeader'
import TheFooter from '@/components/global/TheFooter'

export default {
  name: 'Default',
  components: {
    TheHeader,
    TheFooter,
  },
  head() {
    return {
      title: this.$store.state.defaults.title,
      titleTemplate: '%s',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          name: 'title',
          content: this.$store.state.defaults.title,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$store.state.defaults.description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          name: 'description',
          content: this.$store.state.defaults.description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          name: 'image',
          content: (
            this.$store.state.url + this.$store.state.defaults['meta-image']
          ).replace('//img', '/img'),
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: this.$store.state.defaults.title,
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$store.state.url,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$store.state.url,
        },
      ],
    }
  },
}
</script>
