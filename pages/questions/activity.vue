<template>
  <v-container v-if="loading">
    <Loading msg="Finding ideal matches for you..." />
  </v-container>
  <v-container v-else>
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
import AuthGuardMixin from "~/mixins/AuthGuardMixin";
import Loading from "~/components/Loading";

export default {
  mixins: [AuthGuardMixin],
  components: { Loading },
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
    answers: new Array(8),
    loading: false
  }),
  methods: {
    submit() {
      this.$store.dispatch("user/saveActivityAnswers", this.answers);
      this.loading = true;
      setTimeout(() => {
        this.$router.push(this.$route.query.rdr);
      }, 3000);
    }
  }
};
</script>