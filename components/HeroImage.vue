<template>
  <v-parallax dark :src="image" height="400">
    <v-row align="center" justify="center">
      <v-col class="text-center" sm="9" md="6">
        <template v-if="eventItem.title">
          <h4>Now open for signups!</h4>
          <h1 class="display-3 font-weight-thin">{{ eventItem.title }}</h1>
          <h2 class="my-4">
            {{ getDate(eventItem['start-date']) }} -
            {{ getDate(eventItem['end-date']) }}
          </h2>
          <v-btn color="primary" :to="eventItem.path" large>
            Learn More <v-icon right>mdi-chevron-right</v-icon></v-btn
          >
        </template>
        <template v-else>
          <h1 class="display-3 font-weight-thin">{{ page.title }}</h1>
          <h2 v-if="page.description || date" class="my-4">
            {{ date ? getDate(date) : page.description
            }}{{ endDate ? ' - ' + getDate(endDate) : '' }}
          </h2>
        </template>

        <slot></slot>
      </v-col>
    </v-row>
  </v-parallax>
</template>
<script>
import moment from 'moment'

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
      return moment(date).format('MMMM Do, YYYY')
    },
  },
}
</script>
