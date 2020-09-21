<template>
  <div class="page">
    <HeroImage :page="{ ...page, description: 'Project Submissions' }">
      <v-btn color="accent" :to="'/events/' + page.slug" :title="page.title">
        <v-icon left>mdi-chevron-left</v-icon>
        Back to Event
      </v-btn>
    </HeroImage>
    <v-container>
      <v-row align="stretch">
        <v-col
          v-for="(project, index) in submissions"
          :key="index"
          cols="12"
          md="4"
          sm="6"
          xl="3"
        >
          <SubmissionCard
            :project="project"
            style="height: 100%"
          ></SubmissionCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import HeroImage from '@/components/HeroImage'
import SubmissionCard from '@/components/SubmissionCard'

export default {
  components: {
    HeroImage,
    SubmissionCard,
  },
  async asyncData({ $content, params }) {
    const page = await $content('events', params.event).fetch()
    return {
      page,
    }
  },
  computed: {
    submissions() {
      return this.$store.state.event.submissions
    },
  },
  mounted() {
    this.$store.dispatch('event/getEventData', this.page.slug)
  },
  head() {
    return {
      title: this.page.title + ' - Project Submissions',
      titleTemplate: '%s | ' + this.$store.state.defaults.title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          name: 'title',
          content: this.page.title + ' - Project Submissions',
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
            (this.page['meta-image'] ||
              this.$store.state.defaults['meta-image'])
          ).replace('//img', '/img'),
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content:
            this.$store.state.url + 'events/' + this.page.slug + '/submissions',
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href:
            this.$store.state.url + 'events/' + this.page.slug + '/submissions',
        },
      ],
    }
  },
}
</script>
