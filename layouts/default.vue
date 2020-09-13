<template>
  <v-app>
    <TheHeader></TheHeader>
    <v-main>
      <nuxt />
    </v-main>
    <TheFooter></TheFooter>
  </v-app>
</template>

<script>
import TheHeader from '@/components/global/TheHeader'
import TheFooter from '@/components/global/TheFooter'

export default {
  name: 'DefaultLayout',
  head() {
    return {
      title: this.$store.state.defaults.title,
      titleTemplate: '%s',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: this.$store.state.defaults.description,
        },
      ],
    }
  },
  components: {
    TheHeader,
    TheFooter,
  },
}
</script>
