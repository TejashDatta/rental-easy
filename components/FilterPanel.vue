<template>
  <div class="panel">
    <h3 class="px-4 py-2">Categories</h3>
    <div
      class="item px-4 py-2"
      v-for="cat in categories"
      :key="cat"
      @click="route(cat)"
      :class="{'grey lighten-2': curCategory === cat}"
    >{{cat}}</div>
  </div>
</template>
<script>
import { categories } from "~/constants";
export default {
  props: {
    curCategory: {
      type: String
    }
  },
  data: () => ({
    categories: ["All", ...categories]
  }),
  methods: {
    route(cat) {
      this.$router.push({ name: "items", query: { cat } });
    }
  }
};
</script>
<style scoped>
.panel {
  border: 1px solid lightgray;
  position: sticky;
  top: 100px;
}
.panel .item {
  border-top: 1px solid lightgray;
  transition: all 0.3s;
  cursor: pointer;
}
.panel .item:hover {
  background: #e3f2fd;
}
</style>