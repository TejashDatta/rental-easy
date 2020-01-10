<template>
  <v-container v-if="loading">
    <Loading msg="Finding ideal matches for you..." />
  </v-container>
  <v-container v-else>
    <h2>Tell us about yourself</h2>
    <p>Answer the questions below to help us find the people most suitable for you.</p>
    <v-radio-group
      v-model="answers[i]"
      column
      v-for="(q, i) in questions"
      :key="q[0]"
      class="pa-0 ma-0"
    >
      <span class="mb-2 ml-1">
        <strong>{{i+1}}.</strong> I prefer
      </span>
      <v-radio v-for="option in q" :key="option" :label="option" :value="option"></v-radio>
    </v-radio-group>

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
import AuthGuardMixin from "~/mixins/AuthGuardMixin";
import Loading from "~/components/Loading";

export default {
  mixins: [AuthGuardMixin],
  components: { Loading },
  data: () => ({
    questions: [
      ["Nice car", "Nice home"],
      ["Sneakers", "Sandals "],
      ["Rap", "Pop"],
      ["Whatsapp", "Instagram"],
      ["Intelligent", "Funny"],
      ["Brutal honesty", "White lies"],
      ["Casuals", "Formals"],
      ["Big party", "Small get-together"],
      ["Dine in", "Delivery"],
      ["Cake", "Ice cream"]
    ],
    answers: new Array(10),
    loading: false
  }),
  methods: {
    submit() {
      this.$store.dispatch("user/saveTalkAnswers", this.answers);
      this.loading = true;
      setTimeout(() => {
        this.$router.push(this.$route.query.rdr);
      }, 3000);
    }
  }
};
</script>