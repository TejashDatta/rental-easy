<template>
  <div class="mx-12" style="position: relative;">
    <v-text-field
      label="Search"
      rounded
      solo
      dense
      hide-details
      clearable
      prepend-inner-icon="mdi-magnify"
      v-model="query"
      @focus="showResults = true"
      @blur="hideResults"
    />
    <div class="search-panel mt-1 white elevation-6" v-show="showResults">
      <SearchResults :query="query" @resultClicked="data => query = data" />
    </div>
  </div>
</template>
<script>
import SearchResults from "./SearchResults";
export default {
  data: () => ({
    query: null,
    showResults: false
  }),
  components: { SearchResults },
  methods: {
    hideResults() {
      setTimeout(() => {
        this.showResults = false;
      }, 250);
    }
  }
};
</script>
<style scoped>
.search-panel {
  position: absolute;
  z-index: 1;
  width: 100%;
}
</style>
