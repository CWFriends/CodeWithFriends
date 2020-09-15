<template>
  <v-app>
    <TheHeader></TheHeader>
    <v-main>
      <div class="page">
        <HeroImage
          :page="{
            title: error.statusCode === 404 ? pageNotFound : otherError,
          }"
        ></HeroImage>
        <v-container>
          <v-row>
            <v-col cols="12">
              Return to the <NuxtLink to="/"> Home page </NuxtLink>.
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
    <TheFooter></TheFooter>
  </v-app>
</template>

<script>
import TheHeader from '@/components/global/TheHeader'
import TheFooter from '@/components/global/TheFooter'

export default {
  layout: 'empty',
  components: {
    TheHeader,
    TheFooter,
  },
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    pageNotFound: '404 Not Found',
    otherError: 'An error occurred',
  }),
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>
