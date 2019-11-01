<template>
  <Loading v-if="!item" />
  <v-container v-else>
    <h1>{{item.name}}</h1>
    <v-row>
      <v-col cols="12" sm="5">
        <div class="white pa-1 elevation-3">
          <v-img :lazy-src="item.thumb" :aspect-ratio="4/3">
            <v-img :src="item.photo" contain :aspect-ratio="4/3"></v-img>
          </v-img>
          <div class="d-flex flex-column justify-center align-center my-2">
            <v-rating
              :value="item.rating.total / item.rating.votes"
              half-increments
              readonly
              dense
              color="yellow darken-3"
              background-color="yellow darken-3"
            ></v-rating>
            <!-- <span class="secondary--text">({{item.orders}} orders)</span> -->
          </div>
        </div>
      </v-col>
      <v-col>
        <h2>Details</h2>
        <p>{{item.details}}</p>
        <v-divider />
        <h2>Rent Now</h2>
        <div class="grey lighten-2 mt-2 pa-2">
          <div class="d-flex justify-space-between">
            <div
              class="grey lighten-4 pa-4 ma-2 text-center flex-grow-1"
              v-for="priceLabel in priceLabels"
              :key="priceLabel"
            >
              <span class="headline">₹{{item.prices[priceLabel]}}</span>
              <br />
              <span class="text-capitalize">{{priceLabel}}</span>
            </div>
          </div>
          <div class="mx-4 mt-6 mb-2">
            <DatePicker :dates.sync="dates" :blockedDates="item.blockedDates" />
            <v-btn
              block
              tile
              depressed
              color="primary"
              class="mt-4"
              :disabled="dates.length !== 2 || dates[0] === dates[1]"
              @click="rent"
            >
              <v-icon left>mdi-truck</v-icon>Rent
            </v-btn>
          </div>
        </div>
        <br />
        <v-divider />
        <h2 class="mb-2">Reviews</h2>
        <Reviews :itemID="item.id" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import { db } from "~/plugins/firebase";
import DatePicker from "~/components/DatePicker";
import Loading from "~/components/Loading";
import Reviews from "~/components/ReviewComponents/Reviews";
import dateMethods from "~/mixins/dateMethods";

export default {
  components: { Loading, DatePicker, Reviews },
  data: () => ({
    item: null,
    loading: false,
    priceLabels: ["daily", "weekly", "monthly"],
    dates: []
  }),
  mixins: [dateMethods],
  methods: {
    getItem() {
      const id = this.$route.params.id;
      db.collection("items")
        .doc(id)
        .get()
        .then(doc => {
          this.item = { id: doc.id, ...doc.data() };
        });
    },
    calculatePrice() {
      const start = new Date(this.dates[0]),
        end = new Date(this.dates[1]);
      var duration = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1,
        price = 0;
      price += Math.floor(duration / 30) * this.item.prices.monthly;
      duration = duration % 30;
      price += Math.floor(duration / 7) * this.item.prices.weekly;
      duration = duration % 7;
      price += duration * this.item.prices.daily;
      return price;
    },
    rent() {
      var item = this.item;
      this.$store.dispatch("cart/addOrder", {
        item: {
          id: item.id,
          name: item.name,
          thumb: item.thumb,
          owner: item.owner,
          safety: item.safety
        },
        dates: {
          start: this.dates[0],
          end: this.dates[1]
        },
        price: this.calculatePrice()
      });
      if (this.$store.state.user.currentUser)
        this.$router.push({ name: "check-out" });
      else
        this.$router.push({
          name: "auth",
          query: {
            rdr: "/check-out",
            msg: "Please sign in to continue your order"
          }
        });
    }
  },
  created() {
    this.getItem();
  }
};
</script>
<style scoped>
h1,
h2 {
  font-weight: normal !important;
}
</style>