<template>
  <v-container>
    <h2>Tell us about yourself</h2>
    <p class="my-8">
      Answer the questions below to help us find the people most suitable for
      you.
    </p>
    <v-row>
      <v-col cols="6" sm="4" lg="3" v-for="(question, i) in questions" :key="question.options[0]">
        <v-radio-group v-model="answers[i]" column class="pa-0 mx-0 my-4">
          <span class="mb-2 ml-1">
            <strong>{{ i + 1 }}.</strong>
            {{ question.q }}
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
import { mapState } from "vuex";
import AuthGuardMixin from "~/mixins/AuthGuardMixin";

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
      this.continueOrder();
    },
    continueOrder() {
      var answers = this.userProfile.talkAnswers;
      this.$store.commit("cart/saveAnswersToOrder", answers);
      this.$router.push("/check-out");
    }
  },
  computed: mapState("user", ["userProfile"]),
  created() {
    if (this.userProfile.talkAnswers) this.continueOrder();
  }
};
</script>
