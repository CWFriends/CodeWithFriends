<template>
  <v-parallax
    dark
    :src="'/' + image"
    height="400"
    style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3)"
  >
    <v-row align="center" justify="center">
      <v-col class="text-center" sm="10" md="8">
        <template v-if="eventItem.title">
          <div
            v-if="new Date(eventItem['signup-date']) > Date.now()"
            class="text-overline"
          >
            Signups open {{ getDate(eventItem['signup-date']) }}
          </div>
          <div v-else class="text-overline">Now open for signups!</div>
          <h1 class="text-md-h1 text-h2">{{ eventItem.title }}</h1>
          <div class="text-md-h5 mb-4 text-h6">
            {{ getDate(eventItem['start-date']) }} -
            {{ getDate(eventItem['end-date']) }}
          </div>
          <v-btn
            color="accent"
            :to="eventItem.path"
            :title="eventItem.title"
            large
          >
            Learn More <v-icon right>mdi-chevron-right</v-icon></v-btn
          >
        </template>
        <template v-else>
          <h1 class="text-md-h1 text-h2">{{ page.title }}</h1>
          <div v-if="page.description || date" class="text-md-h5 mb-4 text-h6">
            {{ date ? getDate(date) : page.description
            }}{{ endDate ? ' - ' + getDate(endDate) : '' }}
          </div>
        </template>

        <slot></slot>
      </v-col>
    </v-row>
  </v-parallax>
</template>
<script>
export default {
  name: 'Hero',
  props: {
    eventItem: {
      type: Object,
      default: () => ({}),
    },
    page: {
      type: Object,
      default: () => ({}),
    },
    date: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
  },
  computed: {
    image() {
      return (
        this.eventItem.image ||
        this.page.image ||
        this.$store.state.defaults.image
      )
    },
  },
  methods: {
    getDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
      }).format(new Date(date))
    },
  },
}
</script>
