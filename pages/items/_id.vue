<template>
  <Loading v-if="!item" />
  <v-container v-else>
    <h1 v-if="!item.person">{{item.name}}</h1>
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
        <h2>Rent Now</h2>
        <div class="grey lighten-2 mt-2 pa-2">
          <div class="d-flex justify-space-between" v-if="!item.person">
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

            <div v-if="item.person"
              class="grey lighten-4 pa-4 ma-2 text-center"
            >
            <span class="headline">₹{{item.prices.session}}</span>
              <br />
              <span>per 30 minute slot</span>
            </div>



          <div class="mx-4 mt-6 mb-2" v-if="!item.person">
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

          <div class="mx-4 mt-6 mb-2"  v-if="item.person">
            <v-menu
              ref="menu"
              v-model="person.menu"
              :close-on-content-click="false"
              :close-on-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="person.date"
                label="Select booking date"
                prepend-icon="mdi-calendar-range"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="person.date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="red" @click="person.menu = false">Cancel</v-btn>
              <v-btn text color="green" @click="person.menu = false">OK</v-btn>
            </v-date-picker>
          </v-menu>

            <v-row>
              <v-col>
<v-text-field
                v-model="person.sessions"
                label="No. of slots (Each slot is 30 mins)"
              ></v-text-field>
              </v-col>
              <v-col>
<v-text-field
                v-model="person.startTime"
                label="Approximate time of booking"
                hint="eg. 3pm"
                persistent-hint=""
              ></v-text-field>
              </v-col>
            </v-row>
            
              
            <v-btn
              block
              tile
              depressed
              color="primary"
              class="mt-4"
              @click="rent"
            >
              Book
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
import BlurredThumb from "~/components/BlurredThumb";
import dateMethods from "~/mixins/dateMethods";

export default {
  components: { Loading, DatePicker, Reviews, BlurredThumb },
  data: () => ({
    item: null,
    loading: false,
    priceLabels: ["daily", "weekly", "monthly"],
    dates: [],
    person: {
      menu: false,
      sessions: null,
      date: null,
      startTime: null
    }
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
      var duration =
          (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1,
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
      var order  = {
        item: {
          id: item.id,
          thumb: item.thumb,
          owner: item.owner,
          safety: item.safety
        }
      }
      if (!this.item.person) {
        order.item.name = item.name
        order.dates = {
          start: this.dates[0],
          end: this.dates[1]
        };
        order.price = this.calculatePrice()
      }
      else {
        order.item.name = this.$route.query.cat
        order.dates = this.person.date
        order.sessions = this.person.sessions
        order.startTime = this.person.startTime
        order.price = this.person.sessions * this.item.prices.session
        order.person = item.name
      }

      this.$store.dispatch("cart/addOrder", order);
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
h2 {
  font-weight: normal !important;
}
</style>