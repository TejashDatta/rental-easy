<template>
  <nuxt-link :to="link">
    <v-card outlined class="zoom">
      <v-card-title class="subtitle-1 px-2 py-1" style="word-break: break-word">
        <nuxt-link :to="link">{{item.name}}</nuxt-link>
      </v-card-title>
      <v-img :lazy-src="item.thumb" :aspect-ratio="4/3">
        <v-img :src="item.thumb" contain :aspect-ratio="4/3"></v-img>
      </v-img>
      <v-card-text>
        Starting at
        <strong>₹{{item.prices.daily}}</strong>
      </v-card-text>
    </v-card>
  </nuxt-link>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    link() {
      return { name: "items-id", params: { id: this.item.id } };
    }
  }
};
</script>
<style scoped>
.zoom:hover {
  transform: scale(1.02);
  transition: all 0.1s;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
}
</style>