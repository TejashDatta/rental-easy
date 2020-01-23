<template>
  <Loading v-if="!item" />
  <v-container v-else>
    <h1>{{item.name}}</h1>
    <v-row>
      <v-col cols="12" sm="5">
        <div class="white pa-1 elevation-3">
          <BlurredThumb :thumb="item.thumb" :full="item.photo" />
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
        <p class="body-2">{{item.details}}</p>
        <v-divider />
        <h2 v-if="!item.isActivity">Rent Now</h2>
        <h2 v-else>Book Now</h2>
        <div class="grey lighten-2 mt-2 pa-2">
          <div class="d-flex justify-space-between" v-if="!item.isActivity">
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

          <div v-else>
            <div class="grey lighten-4 pa-4 ma-2 text-center flex-grow-1">
              <span class="headline">₹{{item.price}}</span>
              <br />
              <span class="text-capitalize">per session</span>
            </div>
          </div>

          <div class="mx-4 mt-6 mb-2" v-if="!item.isActivity">
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

          <div class="mx-4 mt-6 mb-2" v-else>
            <SingleDatePicker :date.sync="dates[0]" />
            <v-btn
              block
              tile
              depressed
              color="primary"
              class="mt-4"
              @click="book"
              :disabled="!dates[0]"
            >Book</v-btn>
          </div>
        </div>
        <br />
        <v-divider />
        <h2 class="mb-2">Reviews</h2>
        <Reviews :itemID="item.id" />
      </v-col>
    </v-row>
    <AddCompanionDialog :dialog.sync="showDialog" />
  </v-container>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import { db } from "~/plugins/firebase";
import Loading from "~/components/Loading";
import Reviews from "~/components/ReviewComponents/Reviews";
import BlurredThumb from "~/components/BlurredThumb";
import dateMethods from "~/mixins/dateMethods";
import { mapState } from "vuex";

export default {
  components: {
    Loading,
    Reviews,
    BlurredThumb,
    DatePicker: () => import("~/components/DatePicker"),
    SingleDatePicker: () => import("~/components/SingleDatePicker"),
    AddCompanionDialog: () => import("~/components/AddCompanionDialog")
  },
  data: () => ({
    item: null,
    loading: false,
    priceLabels: ["daily", "weekly", "monthly"],
    dates: [null],
    showDialog: false
  }),
  mixins: [dateMethods],
  computed: mapState("user", ["currentUser"]),
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
    setOrder() {
      if (!this.currentUser) {
        this.$router.push({
          name: "auth",
          query: {
            rdr: `/items/${this.item.id}`,
            msg: "Please sign in to order"
          }
        });
      }

      var item = this.item;
      var order = {
        item: {
          id: item.id,
          name: item.name,
          thumb: item.thumb,
          isActivity: item.isActivity
        }
      };
      if (!this.item.isActivity) {
        order.dates = {
          start: this.dates[0],
          end: this.dates[1]
        };
        order.price = this.calculatePrice();
        order.item.owner = item.owner;
        order.item.safety = item.safety;
      } else {
        order.date = this.dates[0];
        order.price = this.item.price;
      }
      this.$store.dispatch("cart/addOrder", order);
    },
    rent() {
      this.setOrder();
      this.$router.push({ name: "check-out" });
    },
    book() {
      this.setOrder();
      if (["Table Talk", "Shopping"].includes(this.item.name)) {
        this.$router.push("/questions/talk");
      } else {
        this.showDialog = true;
      }
    }
  },
  created() {
    this.getItem();
  }
};
</script>
<style scoped>
h2 {
  font-weight: normal !important;
}
</style>