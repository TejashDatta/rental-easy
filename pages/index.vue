<template>
  <v-container>
    <div>
      <v-responsive :aspect-ratio="16/9">
        <v-carousel
          height="auto"
          show-arrows-on-hover
          cycle
          interval="3000"
          hide-delimiters
          ref="slider"
        >
          <v-carousel-item
            eager
            v-for="(link, i) in slideLinks"
            :key="link"
            :src="require(`~/assets/landing/${i+1}.jpg`)"
            nuxt
            :to="link"
          ></v-carousel-item>
        </v-carousel>
      </v-responsive>
    </div>
    <br />
    <div>
      <div v-for="(items, cat) in cats" :key="cat" class="mb-1">
        <h3>
          New in
          <span class="accent--text">{{cat}}</span>
        </h3>
        <ActivityTutorial v-if="cat == 'Activity Sessions'" />
        <v-row>
          <v-col cols="6" sm="4" md="3" v-for="item in items" :key="item.id">
            <Item :item="item" />
          </v-col>
        </v-row>
        <div class="d-flex justify-end">
          <nuxt-link :to="`/items?cat=${cat}`">View more</nuxt-link>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import Item from "~/components/Item";
import ActivityTutorial from "~/components/ActivityTutorial";
import { db } from "~/plugins/firebase";
import { categories } from "~/constants";

export default {
  components: { Item, ActivityTutorial },
  data: () => ({
    slideLinks: [
      "/items",
      "/items?cat=Electronic Appliances",
      "/items?cat=Activity Sessions",
      "/items?cat=Books",
      "/items?cat=Games",
      "/items?cat=Trekking Equipment",
      "/renter/add-item"
    ],
    cats: {}
  }),
  created() {
    categories.forEach(cat => {
      db.collection("items")
        .where("category", "==", cat)
        .where("show", "==", true)
        .orderBy("addedOn", "desc")
        .limit(4)
        .get()
        .then(snap => {
          if (snap.empty) return;
          let cat = snap.docs[0].data().category;
          this.$set(
            this.cats,
            cat,
            snap.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            }))
          );
        });
    });
  }
};
</script>