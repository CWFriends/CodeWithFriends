<template>
  <v-row>
    <v-col sm="9" cols="12"> column 1 </v-col>
    <v-col sm="3" cols="12"> column 2 </v-col>
  </v-row>
</template>

<script>
export default {
  head: () => ({
    script: [
      { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' },
    ],
  }),
}
</script>
