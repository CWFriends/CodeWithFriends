<template>
  <div class="page">
    <HeroImage :page="{ title }"></HeroImage>
    <v-container>
      <v-row align="stretch">
        <v-col
          v-for="(event, index) in events"
          :key="index"
          cols="12"
          lg="3"
          md="4"
          sm="6"
        >
          <v-card
            :href="event.url || ''"
            :to="event.url ? '' : event.path"
            :target="event.url ? '_blank' : '_self'"
            height="100%"
          >
            <v-img
              class="align-end"
              height="150px"
              :src="event['meta-image'] || $store.state.defaults['meta-image']"
            ></v-img>
            <v-card-title v-text="event.title"></v-card-title>
            <v-card-subtitle
              >{{ getDate(event['start-date']) }} to
              {{ getDate(event['end-date']) }}</v-card-subtitle
            >
            <v-card-text>
              {{ event.description }}
              <v-chip
                v-if="new Date(event['start-date']) > Date.now()"
                text-color="white"
                color="primary"
              >
                Signups Open!
              </v-chip>
              <v-chip
                v-if="
                  new Date(event['start-date']) < Date.now() &&
                  new Date(event['end-date']) > Date.now()
                "
                text-color="white"
                color="primary"
              >
                Submissions Open
              </v-chip>
              <v-chip
                v-if="new Date(event['end-date']) < Date.now()"
                text-color="white"
                color="red"
              >
                Submissions Closed
              </v-chip>
            </v-card-text>
          </v-card>
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
    const events = await $content('events').sortBy('start-date', 'desc').fetch()
    return {
      events,
    }
  },
  data: () => ({
    title: 'Events',
    slug: 'events',
  }),
  methods: {
    getDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
      }).format(new Date(date))
    },
  },
  head() {
    return {
      title: this.title,
      titleTemplate: '%s | ' + this.$store.state.defaults.title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$store.state.url + this.slug,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          name: 'title',
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
