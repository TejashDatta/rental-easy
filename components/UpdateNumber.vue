<template>
  <v-form v-model="valid">
    <v-row align="center" dense>
      <v-col cols="6">
        <v-text-field label="Mobile Number" v-model="number" :rules="rules">
          <template v-slot:prepend>
            <span class="mt-1">+91</span>
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-btn color="green" text @click="updateNumber(number); snackbar=true">Save</v-btn>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" color="green lighten-4" top :timeout="2000">
      <span class="green--text text--darken-3">Number saved</span>
      <v-icon color="green darken-3">mdi-check</v-icon>
    </v-snackbar>
  </v-form>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data: () => ({
    snackbar: false,
    number: null,
    valid: false,
    rules: [
      v => !!v || "Number is required",
      v => !isNaN(v) || "Number must be a valid mobile number",
      v => String(v).length === 10 || "Mobile number must be 10 digits long"
    ]
  }),
  methods: mapActions("user", ["updateNumber"]),
  computed: mapState("user", ["userProfile"]),
  created() {
    this.number = this.userProfile.number;
  }
};
</script>