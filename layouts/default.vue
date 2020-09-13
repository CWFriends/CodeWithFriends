<template>
  <v-app>
    <TheHeader></TheHeader>
    <v-main>
      <v-parallax dark :src="require(`~/assets/cms/frame-5.png`)">
        <v-row align="center" justify="center">
          <v-col class="text-center" sm="9" md="6">
            <h1 class="display-3 font-weight-thin mb-4">Code with Friends</h1>
            <h2>
              Learn new things! Make cool stuff! Have fun! Do all that, with an
              online community of friends.
            </h2>
          </v-col>
        </v-row>
      </v-parallax>
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
