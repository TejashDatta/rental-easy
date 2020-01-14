<template>
  <v-row justify="center" class="px-2">
    <v-spacer></v-spacer>
    <v-col cols="12" md="6">
      <v-stepper v-model="step" alt-labels class="elevation-2">
        <v-stepper-header class="elevation-0">
          <v-stepper-step :complete="true" editable step="1">Cart</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 1" :editable="step > 1" step="2">Delivery Address</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">Payment</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <h2>My Cart</h2>
            <OrderItem
              v-for="order in orders"
              :key="order.item.id + order.dates.start"
              :order="order"
            />
          </v-stepper-content>

          <v-stepper-content step="2">
            <h2 class="mb-4">Delivery and Contact Information</h2>
            <p class="red--text">{{ error }}</p>
            <h3>Contact Number</h3>
            <v-row>
              <v-col cols="12" sm="6">
                <UpdateNumber />
              </v-col>
            </v-row>
            <h3>Address</h3>
            <p>Select the address you wish to receive the item at</p>
            <v-row>
              <v-col
                cols="6"
                sm="4"
                v-for="(address, i) in userProfile.addresses"
                :key="address.address"
              >
                <v-card outlined @click="selectedAddress = i" style="height: 100%">
                  <v-progress-linear :value="selectedAddress == i ? 100 : 0" />
                  <div class="py-2 px-4">
                    <strong>{{ address.name }}</strong>
                    <p style="white-space: pre-line;">{{ address.address }}</p>
                    Kolkata: {{ address.pin }}
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6" sm="4">
                <AddAddressDialog />
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-content step="3">
            <h2 class="mb-4">Payment</h2>
            <v-radio-group v-model="payment" column mandatory required class="ml-2">
              <v-radio label="Cash on Delivery" value="Cash"></v-radio>
              <v-radio label="GPay/PayTM on Delivery" value="GPay/PayTM"></v-radio>
            </v-radio-group>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
    <v-col cols="12" md="3">
      <v-card>
        <v-card-title class="subtitle">Order Summary</v-card-title>
        <v-card-text>
          <v-row v-for="order in orders" :key="order.item.id">
            <v-col cols="6">{{ order.item.name }}</v-col>
            <v-col cols="6" class="text-right">₹{{ order.price }}</v-col>
            <!-- <v-col cols="6">Safety fee</v-col>
            <v-col cols="6" class="text-right">₹{{ order.item.safety }}</v-col>-->
          </v-row>
          <v-btn block tile depressed color="primary" @click="proceed" :loading="loading">
            <v-icon left>mdi-arrow-right-bold</v-icon>
            <span v-if="step < 3">Proceed</span>
            <span v-else>Confirm</span>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import emailjs from "emailjs-com";
import { service_id, template_id, user_id} from '~/emailjsConfig'
import { db } from "~/plugins/firebase";
import { mapState, mapMutations } from "vuex";
import OrderItem from "~/components/OrderItem";
import AddAddressDialog from "~/components/AddAddressDialog";
import UpdateNumber from "~/components/UpdateNumber";
import AuthGuardMixin from "~/mixins/AuthGuardMixin";
export default {
  mixins: [AuthGuardMixin],
  components: { OrderItem, AddAddressDialog, UpdateNumber },
  data: () => ({
    step: 1,
    selectedAddress: 0,
    error: "",
    loading: false,
    payment: null
  }),
  computed: {
    ...mapState("user", ["currentUser", "userProfile"]),
    ...mapState("cart", ["orders"])
  },
  methods: mapMutations("cart", ["removeOrder"]),
  watch: {
    userProfile(nv, ov) {
      if (nv.addresses.length !== ov.addresses.length) this.selectedAddress = 0;
    }
    // orders(nv, ov) {
    //   if (!nv.length) this.$router.go(-1);
    // }
  },
  methods: {
    proceed() {
      if (this.step == 2) {
        if (!this.userProfile.number) {
          this.error += "Please enter a valid contact number.";
          return;
        }
        if (!this.userProfile.addresses.length) {
          this.error += "Please add a delivery address.";
          return;
        }
      } else if (this.step == 3) {
        this.loading = true;
        this.createOrder();
        return;
      }
      this.step++;
    },
    createOrder() {
      var order = { ...this.orders[0] };
      order.user = {
        id: this.currentUser.uid,
        email: this.currentUser.email,
        number: this.userProfile.number,
        talkAnswers: this.userProfile.talkAnswers,
        activityAnswers: this.userProfile.activityAnswers
      };
      order.payment = this.payment;
      order.address = this.userProfile.addresses[this.selectedAddress];
      db.collection("orders")
        .add(order)
        .then(() => {
          delete order.item.thumb;
          var msg = JSON.stringify(order)
            .replace(/{/g, "\n{")
            .replace(/,/g, ",\n");
          emailjs.send(service_id, template_id, { message_html: msg }, user_id);

          this.$router.push("/user/orders/");
          this.$store.commit("cart/clearCart");
        });
    }
  }
};
</script>
<style scoped>
h2 {
  font-weight: normal;
}
</style>
