<template>
  <div>
    <v-tooltip top v-if="user.name">
      <template v-slot:activator="{ on, attrs }">
        <v-avatar class="ma-1" v-bind="attrs" v-on="on">
          <v-icon v-if="!user.avatar_url" x-large>mdi-account-circle</v-icon>
          <img v-else :src="user.avatar_url" />
        </v-avatar>
      </template>
      <span>{{ user.name }}</span>
    </v-tooltip>
    <v-avatar v-else class="ma-1">
      <v-icon v-if="!user.avatar_url" x-large>mdi-account-circle</v-icon>
      <img v-else :src="user.avatar_url" />
    </v-avatar>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
