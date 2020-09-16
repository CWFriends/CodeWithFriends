<template>
  <v-overlay :value="overlay">
    <v-card
      light
      style="width: min(700px, 90vw); max-height: 90vh; overflow-y: scroll"
    >
      <div class="text-right">
        <v-btn color="red" icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <slot></slot>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  name: 'Overlay',
  props: {
    overlay: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
