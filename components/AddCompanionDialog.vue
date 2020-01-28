<template>
  <v-dialog v-model="dialog" persistent hide-overlay max-width="400">
    <v-card>
      <v-card-title class="headline">Request Match?</v-card-title>
      <v-card-text>
        Rentaleasy has many verified individuals available to accompany you in your activity.
        Request a match for an additional cost of ₹100?
        <v-radio-group v-model="requestCompanion">
          <v-radio label="Yes (+ ₹100)" :value="true"></v-radio>
          <v-radio label="No" :value="false"></v-radio>
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="$emit('update:dialog', false)">Cancel</v-btn>
        <v-btn color="primary" text @click="next">Next</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    requestCompanion: false
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