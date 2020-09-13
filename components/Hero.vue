<template>
  <v-parallax dark :src="image">
    <v-row align="center" justify="center">
      <v-col class="text-center" sm="9" md="6">
        <h1 class="display-3 font-weight-thin mb-4">{{ page.title }}</h1>
        <h2 v-if="page.description">
          {{ page.description }}
        </h2>
      </v-col>
    </v-row>
  </v-parallax>
</template>
<script>
export default {
  name: 'Hero',
  props: {
    page: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    image() {
      return this.page.image || this.$store.state.defaults.image
    },
  },
}
</script>
