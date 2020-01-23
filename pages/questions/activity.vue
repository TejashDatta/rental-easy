<template>
  <v-container>
    <h2>Tell us about yourself</h2>
    <p>Answer the questions below to help us find the people most suitable for you.</p>
    <v-row>
      <v-col cols="6" sm="4" lg="3" v-for="(q, i) in questions" :key="q[0]">
        <v-radio-group v-model="answers[i]" column class="pa-0 ma-0">
          <span class="mb-2 ml-1">
            <strong>{{i+1}}.</strong> I prefer
          </span>
          <v-radio v-for="option in q" :key="option" :label="option" :value="option"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <div class="d-flex justify-center">
      <v-btn
        color="primary"
        class="mb-4"
        @click="submit"
        :disabled="answers.includes(undefined)"
      >Continue</v-btn>
    </div>
  </v-container>
</template>
<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    questions: [
      ["Netflix", "YouTube"],
      ["Phone call", "Text"],
      ["iOS", "Android"],
      ["Money", "Free time"],
      ["Saving", "Spending"],
      ["Brutal honesty", "White lies"],
      ["TV", "Book"],
      ["Casuals", "Formals"]
    ],
    answers: new Array(8)
  }),
  methods: {
    submit() {
      this.$store.dispatch("user/saveActivityAnswers", this.answers);
      this.continueOrder();
    },
    continueOrder() {
      var answers = this.userProfile.activityAnswers;
      this.$store.commit("cart/saveAnswersToOrder", answers);
      this.$router.push("/check-out");
    }
  },
  computed: mapState("user", ["userProfile"]),
  created() {
    if (this.userProfile.activityAnswers) this.continueOrder();
  }
};
</script>