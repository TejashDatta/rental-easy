<template>
  <div v-if="query && !results.length" class="my-3 d-flex justify-center">
    <v-progress-circular v-if="loading" indeterminate size="30" width="3" color="primary" />
    <div v-else>
      <p class="text-center">No results found</p>
      <RequestItem />
    </div>
  </div>
  <div v-else>
    <nuxt-link v-for="result in results" :key="result.objectID" :to="`/items/${result.objectID}`">
      <v-row
        dense
        align="center"
        class="mx-0 py-1 result"
        @click="$emit('resultClicked', result.name)"
      >
        <v-col cols="2" class="px-3 pl-lg-5 pr-lg-8">
          <BlurredThumb :thumb="result.thumb" :full="result.thumb" />
        </v-col>
        <v-col>
          <h3>{{result.name}}</h3>
          <span class="grey--text">
            in
            <span class="font-italic">{{result.category}}</span>
          </span>
        </v-col>
      </v-row>
    </nuxt-link>
  </div>
</template>
<script>
import { ALGOLIA_APP_ID, ALGOLIA_API_KEY } from "~/constants";
import algoliasearch from "algoliasearch";
import { debounce } from "debounce";
import BlurredThumb from "~/components/BlurredThumb";

export default {
  props: {
    query: String
  },
  components: { BlurredThumb, RequestItem: () => import("./RequestItem") },
  data: () => ({
    results: [],
    loading: false
  }),
  watch: {
    query(nv, ov) {
      if (nv && nv.replace(/\s/g, "").length) {
        this.loading = true;
        this.debouncedResults();
      } else {
        this.debouncedResults.clear();
        this.results = [];
        this.loading = false;
      }
    }
  },
  methods: {
    getResults() {
      var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY, {
        protocol: "https:"
      });
      var index = client.initIndex("re_items");
      index.search({ query: this.query }).then(data => {
        this.results = data.hits;
        this.loading = false;
      });
    }
  },
  created() {
    this.debouncedResults = debounce(this.getResults, 750);
  }
};
</script>
<style scoped>
.result {
  transition: all 0.2s;
}
.result:hover {
  background: #eee;
}
</style>