<template>
  <v-row justify="center" class="px-2" v-if="order">
    <v-spacer></v-spacer>
    <v-col cols="12" md="6">
      <v-stepper v-model="step" alt-labels class="elevation-2">
        <v-stepper-header class="elevation-0">
          <v-stepper-step :complete="true" editable step="1">Cart</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 1" :editable="step > 1" step="2">Billing Address</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">Payment</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <h2>My Cart</h2>
            <OrderItem :order="order" />
          </v-stepper-content>

          <v-stepper-content step="2">
            <h2 class="mb-4">Contact Information</h2>
            <p class="red--text">{{ error }}</p>
            <h3>Contact Number</h3>
            <v-row>
              <v-col cols="12" sm="6">
                <UpdateNumber @numberSaved="error=''" />
              </v-col>
            </v-row>
            <h3>Address</h3>
            <p>Select a billing address</p>
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
            <v-radio-group v-model="payment" column mandatory required class="ml-2 black--text">
              <v-radio label="Pay on Delivery (Cash/PayTM/UPI/GPay)" value="Delivery"></v-radio>
              <v-radio label="UPI/PayTM Online" value="UPI Online"></v-radio>
            </v-radio-group>
            <div v-if="payment === 'UPI Online'" class="d-flex justify-center">
              <div style="max-width: 400px" class="text-center">
                <v-img contain max-height="200" :src="require('~/assets/payment_qr.jpeg')" />
                <span>Please pay the required amount through PayTM or any other BHIM UPI app by scanning the QR code.</span>
              </div>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
    <v-col cols="12" md="3">
      <v-card>
        <v-card-title class="subtitle">Order Summary</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">{{ order.item.name }}</v-col>
            <v-col cols="6" class="text-right">₹{{ order.price }}</v-col>
          </v-row>
          <v-row v-if="order.item.safety">
            <v-col cols="6">Safety fee</v-col>
            <v-col cols="6" class="text-right">₹{{ order.item.safety }}</v-col>
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
import { service_id, template_id, user_id } from "~/emailjsConfig";
import { db } from "~/plugins/firebase";
import { mapState } from "vuex";
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
    ...mapState("cart", ["order"])
  },
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
          this.error = "Please enter a valid contact number.";
          return;
        }
        if (!this.userProfile.addresses.length) {
          this.error = "Please add an address.";
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
      var order = { ...this.order };
      order.user = {
        id: this.currentUser.uid,
        email: this.currentUser.email,
        number: this.userProfile.number
      };
      order.payment = this.payment;
      order.address = this.userProfile.addresses[this.selectedAddress];
      db.collection("orders")
        .add(order)
        .then(() => {
          order.subject = "Order Item/Activity";
          delete order.item.thumb;
          var msg = JSON.stringify(order)
            .replace(/{/g, "\n{")
            .replace(/,/g, ",\n");
          emailjs.send(service_id, template_id, { message_html: msg }, user_id);

          this.$store.commit("cart/clearCart");
          this.$router.push(
            "/user/orders/?msg=Thank you for your support. We will reach out to you regarding your pending order shortly."
          );
        });
    }
  },
  created() {
    if (!this.order) this.$router.push("/");
  }
};
</script>
<style scoped>
h2 {
  font-weight: normal;
}
</style>
