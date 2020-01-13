<template>
  <v-container v-if="done">
    <div class="d-flex flex-column align-center my-12 pa-2">
      <img src="~/assets/radr_logo.png" class="my-10" />
      <v-btn big @click="book" color="pink" dark class="my-10" v-if="!booked">Book</v-btn>
      <p
        class="my-10"
        v-if="!booked"
      >Click on book and we'll find your perfect match and get back to you through email.</p>
      <p class="my-12" v-if="booked">Thank you for your interest! We'll get back to you shortly.</p>
    </div>
  </v-container>
  <v-container v-else>
    <h2>Tell us about yourself</h2>
    <p class="my-8">Answer the questions below to help us find the people most suitable for you.</p>
    <v-row>
      <v-col cols="6" sm="4" lg="3" v-for="(question, i) in questions" :key="question.options[0]">
        <v-radio-group v-model="answers[i]" column class="pa-0 mx-0 my-4">
          <span class="mb-2 ml-1">
            <strong>{{i+1}}.</strong>
            {{question.q}}
          </span>
          <v-radio v-for="option in question.options" :key="option" :label="option" :value="option"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <div class="d-flex justify-center">
      <v-btn
        color="primary"
        class="my-12"
        @click="submit"
        :disabled="answers.includes(undefined)"
      >Continue</v-btn>
    </div>
  </v-container>
</template>
<script>
import AuthGuardMixin from "~/mixins/AuthGuardMixin";
import { mapState } from "vuex";
import emailjs from "emailjs-com";

export default {
  mixins: [AuthGuardMixin],
  data: () => ({
    questions: [
      { q: "Looking for:", options: ["Males", "Females", "Both"] },
      { q: "Does age difference matter to you?", options: ["Yes", "No"] },
      { q: "I prefer", options: ["Beach", "Mountains"] },
      { q: "I prefer", options: ["Dine in", "Delivery"] },
      { q: "I prefer", options: ["Sweaters", "Hoodies"] },
      { q: "I prefer", options: ["Chocolate", "Ice Cream"] },
      { q: "I prefer", options: ["Harry Potter", "Star Wars"] },
      { q: "I prefer", options: ["Passenger", "Driver"] }
    ],
    answers: new Array(8),
    booked: false
  }),
  methods: {
    submit() {
      this.$store.dispatch("user/saveTalkAnswers", this.answers);
    },
    book() {
      var user = {
        id: this.currentUser.uid,
        email: this.currentUser.email,
        number: this.userProfile.number,
        talkAnswers: this.userProfile.talkAnswers,
        activityAnswers: this.userProfile.activityAnswers
      };
      user.address = this.userProfile.addresses;

      var service_id = "default_service";
      var template_id = "order";
      var user_id = "user_zSzIB9zBoeBVYMDVizcSk";
      var msg = JSON.stringify(user)
        .replace(/{/g, "\n{")
        .replace(/,/g, ",\n");
      emailjs.send(service_id, template_id, { message_html: msg }, user_id);

      this.booked = true;
    }
  },
  computed: {
    ...mapState("user", ["currentUser", "userProfile"]),
    done() {
      try {
        return this.userProfile.talkAnswers != undefined;
      } catch (TypeError) {
        return false;
      }
    }
  }
};
</script>