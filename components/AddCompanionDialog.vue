<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title class="headline">Request Companion?</v-card-title>
      <v-card-text>
        Rentaleasy has many verified individuals available to accompany you in your activity.
        Request a companion for an additional cost of ₹100?
        <v-radio-group v-model="requestCompanion">
          <v-radio label="Yes (+ ₹100)" :value="true"></v-radio>
          <v-radio label="No" :value="false"></v-radio>
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" text @click="next">Next</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    requestCompanion: false,
    dialog: true
  }),
  methods: {
    next() {
      if (this.requestCompanion) {
        this.$store.commit("cart/addPersonCharge");
        this.$router.push("/questions/activity");
      } else this.$router.push("/check-out");
    }
  }
};
</script>