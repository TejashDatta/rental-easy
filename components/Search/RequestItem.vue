<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template v-slot:activator="{ on }">
      <v-btn
        small
        text
        class="text-none"
        v-on="on"
        color="primary"
      >Can't find what you're looking for? Request an item</v-btn>
    </template>

    <v-card v-if="!submitted">
      <v-card-title>Request an item</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field label="Item name" required v-model="name" :rules="nameRules"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="$refs.form.reset(); close();">Cancel</v-btn>
        <v-btn color="primary" text @click="submit">Submit</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title>Request an item</v-card-title>
      <v-card-text
        class="black--text"
      >Thank you for your interest, we will notify you when the item becomes available.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close">Finish</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { db } from "~/plugins/firebase";

export default {
  data: () => ({
    dialog: false,
    submitted: false,
    nameRules: [
      v => !!v || "Required",
      v => (v && v.length <= 30) || "Must be less than 30 characters"
    ],
    name: null
  }),
  methods: {
    submit() {
      let payload = { name: this.name };
      if (this.$store.state.user.currentUser) {
        payload.requester = {
          name: this.$store.state.user.currentUser.displayName,
          email: this.$store.state.user.currentUser.email
        };
      }
      db.collection("suggestions")
        .add(payload)
        .then(() => {
          this.$refs.form.reset();
          this.submitted = true;
        });
    },
    close() {
      this.dialog = false;
      this.submitted = false;
    }
  }
};
</script>