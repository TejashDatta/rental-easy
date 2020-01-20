<template>
  <nuxt-link :to="link">
    <v-card outlined class="zoom d-flex flex-column">
      <div class="position: relative;">
        <div class="shadow-heading subtitle-1 text-center px-2 pt-1 pb-8">
          <nuxt-link :to="link" class="white--text">
            <strong v-if="item.name == 'Table Talk'">NEW!</strong>
            {{ item.name }}
          </nuxt-link>
        </div>
        <BlurredThumb :thumb="item.thumb" :full="item.photo" />
      </div>
      <v-card-text class="black--text">
        Starting at
        <strong v-if="!item.isActivity">₹{{ item.prices.daily }}</strong>
        <strong v-else>₹{{ item.price }}</strong>
      </v-card-text>
    </v-card>
  </nuxt-link>
</template>
<script>
import BlurredThumb from "~/components/BlurredThumb";
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  components: { BlurredThumb },
  computed: {
    link() {
      return {
        name: "items-id",
        params: { id: this.item.id }
      };
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
.zoom {
  height: 100%;
}
.shadow-heading {
  position: absolute;
  z-index: 2;
  width: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(3, 169, 244, 0) 100%
  );
}
</style>
