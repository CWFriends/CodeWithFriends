<template>
  <v-parallax dark :src="image" height="400">
    <v-row align="center" justify="center">
      <v-col class="text-center" sm="9" md="6">
        <h1 class="display-3 font-weight-thin mb-4">{{ page.title }}</h1>
        <h2 v-if="page.description || date">
          {{ date ? getDate(date) : page.description
          }}{{ endDate ? ' - ' + getDate(endDate) : '' }}
        </h2>
      </v-col>
    </v-row>
  </v-parallax>
</template>
<script>
import moment from 'moment'

export default {
  name: 'Hero',
  props: {
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
      return this.page.image || this.$store.state.defaults.image
    },
  },
  methods: {
    getDate(date) {
      return moment(date).format('MMMM Do, YYYY')
    },
  },
}
</script>
