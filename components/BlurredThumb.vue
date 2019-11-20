<template>
  <v-img :lazy-src="thumb" :aspect-ratio="4/3">
    <v-img :src="full" contain :aspect-ratio="4/3"></v-img>
  </v-img>
</template>
<script>
export default {
  props: {
    thumb: {
      type: String,
      required: true
    },
    full: {
      type: String,
      required: true
    }
  }
};
</script>