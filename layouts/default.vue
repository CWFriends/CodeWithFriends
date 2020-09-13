<template>
  <v-app>
    <TheHeader></TheHeader>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <TheFooter></TheFooter>
  </v-app>
</template>

<script>
import TheHeader from '@/components/global/TheHeader'
import TheFooter from '@/components/global/TheFooter'

export default {
  name: 'DefaultLayout',
  components: {
    TheHeader,
    TheFooter,
  },
}
</script>
