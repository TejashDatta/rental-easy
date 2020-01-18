<template>
  <v-dialog v-model="dialog" max-width="400px">
    <template v-slot:activator="{ on }">
      <a href="#" v-on="on">Become a participant</a>
    </template>

    <v-card v-if="!submitted">
      <v-card-title>Become a participant</v-card-title>
      <v-card-text>
        Share your details and we'll get back to you.
        <v-form ref="form">
          <v-text-field label="Name" required v-model="name" :rules="nameRules"></v-text-field>
          <v-text-field label="Email" required v-model="email"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="$refs.form.reset(); close();">Cancel</v-btn>
        <v-btn color="primary" text @click="submit">Submit</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title>Become a participant</v-card-title>
      <v-card-text class="black--text">Thank you for your interest, we will get in touch with you.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close">Finish</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { db } from "~/plugins/firebase";
import emailjs from "emailjs-com";
import { service_id, template_id, user_id } from "~/emailjsConfig";

export default {
  data: () => ({
    dialog: false,
    submitted: false,
    nameRules: [
      v => !!v || "Required",
      v => (v && v.length <= 30) || "Must be less than 30 characters"
    ],
    name: null,
    email: null
  }),
  methods: {
    submit() {
      var data = { subject: 'Become participant', name: this.name, email: this.email };
      db.collection("participants")
        .doc(this.name)
        .set(data)
        .then(() => {
          this.$refs.form.reset();
          this.submitted = true;
        });

      var msg = JSON.stringify(data)
        .replace(/{/g, "\n{")
        .replace(/,/g, ",\n");
      emailjs.send(service_id, template_id, { message_html: msg }, user_id);
    },
    close() {
      this.dialog = false;
      this.submitted = false;
    }
  }
};
</script>