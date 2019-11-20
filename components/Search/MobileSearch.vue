<template>
  <v-dialog v-model="value" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <div class="d-flex align-end mb-2">
        <v-text-field
          v-if="value"
          autofocus
          ref="searchbox"
          class="flex-grow-1 mx-2"
          label="Search"
          hide-details
          clearable
          prepend-inner-icon="mdi-magnify"
          v-model="query"
        />
        <v-btn icon @click="close" color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <SearchResults :query="query" @resultClicked="close" />
    </v-card>
  </v-dialog>
</template>
<script>
import SearchResults from "./SearchResults";

export default {
  props: {
    value: Boolean
  },
  data: () => ({
    query: null
  }),
  components: { SearchResults },
  methods: {
    close() {
      this.$emit("input", false);
      this.query = null;
    }
  }
};
</script>