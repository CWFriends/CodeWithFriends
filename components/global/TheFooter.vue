<template>
  <v-footer app absolute>
    <span>&copy; {{ new Date().getFullYear() }}, {{ title }}</span>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  data: () => ({
    title: 'Code With Friends',
  }),
}
</script>
