<template>
  <a
    :href="user.html_url"
    target="_blank"
    :title="user.name || user.login || ''"
  >
    <v-avatar class="ma-1" :size="size">
      <v-icon v-if="!user.avatar_url" x-large>mdi-account-circle</v-icon>
      <img v-else :src="user.avatar_url" />
    </v-avatar>
  </a>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
    size: {
      type: Number,
      default: 48,
    },
  },
}
</script>
