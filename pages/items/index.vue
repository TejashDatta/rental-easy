<template>
  <Loading v-if="loading && !items.length" />
  <v-container v-else>
    <v-row>
      <!-- <v-col cols="3" v-if="$vuetify.breakpoint.mdAndUp">
        <FilterPanel :curCategory="category" />
      </v-col>-->
      <v-col>
        <h2>{{category}}</h2>
        <div>
          <v-row>
            <v-col cols="6" md="4" lg="3" v-for="item in items" :key="item.id">
              <Item :item="item" />
            </v-col>
          </v-row>
          <div class="d-flex justify-center mt-2">
            <v-btn
              v-if="canShowMore"
              :loading="loading"
              @click="nextPage"
              text
              color="primary"
            >Show More</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Loading from "~/components/Loading";
import FilterPanel from "~/components/FilterPanel";
import Item from "~/components/Item";
import { db } from "~/plugins/firebase";
export default {
  components: { Loading, FilterPanel, Item },
  data: () => ({
    category: "All",
    items: [],
    loading: false,
    canShowMore: true,
    limit: 20,
    items: [],
    q: null
  }),
  methods: {
    loadCategory() {
      this.items = [];
      this.q = db
        .collection("items")
        .where("show", "==", true)
        .limit(this.limit);
      if (this.category !== "All")
        this.q = this.q.where("category", "==", this.category);
      this.nextPage();
    },
    nextPage() {
      this.loading = true;
      this.q.get().then(snap => {
        this.items = this.items.concat(
          snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        );
        this.loading = false;
        if (snap.docs.length < this.limit) this.canShowMore = false;
        else this.q = this.q.startAfter(snap.docs[snap.docs.length - 1]);
      });
    }
  },
  watch: {
    $route: {
      initial: true,
      handler(nv, ov) {
        if (nv.query.cat) this.category = nv.query.cat;
        else this.category = "All";
        this.loadCategory();
      }
    }
  },
  created() {
    if (this.$route.query.cat) this.category = this.$route.query.cat;
    this.loadCategory();
  }
};
</script>