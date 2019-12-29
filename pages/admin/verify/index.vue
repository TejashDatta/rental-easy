<template>
  <v-container>
    <v-row>
      <v-col cols="4" v-for="(item, i) in items" :key="item.id">
        <a href="#" @click.stop="dialog = true; selected = i">{{item.name}}</a>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="800">
      <v-card v-if="selected">
        <v-card-title>{{item.name}}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <BlurredThumb :thumb="item.thumb" :full="item.photo" />
            </v-col>
            <v-col class="black--text">
              <nuxt-link :to="`/user/${item.owner}`">Owner</nuxt-link>
              <br />
              <strong>category:</strong>
              {{item.category}}
              <br />
              <strong>prices:</strong>
              {{item.prices}}
              <br />
              <strong>safety:</strong>
              {{item.safety}}
              <br />
              <strong>details:</strong>
              <p style="white-space: pre-wrap;">{{item.details}}</p>
              <v-text-field
                clearable
                label="Rejection Reason"
                hint="Filling this will reject the item when you click verify"
                v-model="rejectionReason"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Close</v-btn>
          <v-btn color="blue" text @click="verify(selected)">verify</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import algoliasearch from "algoliasearch";
import { ALGOLIA_APP_ID } from "~/constants";
import BlurredThumb from "~/components/BlurredThumb";
import { db } from "~/plugins/firebase";
import AdminRouteGuard from "~/mixins/AdminRouteGuard";

export default {
  mixins: [AdminRouteGuard],
  data: () => ({
    items: [],
    dialog: false,
    selected: null,
    rejectionReason: null
  }),
  components: { BlurredThumb },
  methods: {
    verify(index) {
      this.dialog = false;
      this.selected = null;
      var id = this.items[index].id;
      var changes = {};
      this.rejectionReason = this.rejectionReason.trim();
      if (!this.rejectionReason && !this.rejectionReason.length)
        changes.show = true;
      else changes.rejectionReason = this.rejectionReason;
      db.collection("items")
        .doc(id)
        .update(changes);
      this.addToAlgolia(id, this.items[index]);
      this.items = this.items.filter(item => item.id != id);
      this.rejectionReason = null;
    },
    addToAlgolia(id, item) {
      var client = algoliasearch(
        ALGOLIA_APP_ID,
        "700460c655efb66b95aaf6e0649ab6e0"
      );
      var index = client.initIndex("re_items");
      return index.addObject({
        objectID: id,
        name: item.name,
        category: item.category,
        thumb: item.thumb
      });
    }
  },
  computed: {
    item() {
      return this.items[this.selected];
    }
  },
  created() {
    db.collection("items")
      .where("show", "==", false)
      .get()
      .then(snap => {
        this.items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
  }
};
</script>