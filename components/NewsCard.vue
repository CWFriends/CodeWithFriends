<template>
  <v-card :to="newsItem.path" :title="newsItem.title">
    <v-img
      v-if="newsItem['meta-image']"
      class="align-end"
      height="150px"
      :src="newsItem['meta-image']"
    ></v-img>
    <v-card-title v-text="newsItem.title"></v-card-title>
    <v-card-subtitle v-text="getDate(newsItem.date)"></v-card-subtitle>
    <v-card-text v-text="newsItem.description"></v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    newsItem: {
      type: Object,
      default: () => ({}),
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
