<template>
  <Loading v-if="loading" />
  <v-container v-else>
    <h1>My Orders</h1>
    <OrderItem v-for="order in orders" :key="order.item.id + order.dates.start" :order="order" />
  </v-container>
</template>
<script>
import AuthGuardMixin from "~/mixins/AuthGuardMixin";
import Loading from "~/components/Loading";
import OrderItem from "~/components/OrderItem";
import { db } from "~/plugins/firebase";
import { mapState } from "vuex";
export default {
  data: () => ({
    orders: [],
    loading: true
  }),
  mixins: [AuthGuardMixin],
  components: { OrderItem, Loading },
  computed: mapState("user", ["currentUser"]),
  created() {
    db.collection("orders")
      .where("user.id", "==", this.currentUser.uid)
      .get()
      .then(snap => {
        this.loading = false;
        this.orders = snap.docs.map(doc => doc.data());
      });
  }
};
</script>