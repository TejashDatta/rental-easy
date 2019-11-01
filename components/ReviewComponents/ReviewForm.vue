<template>
  <v-card>
    <v-card-title>Add Review</v-card-title>
    <v-card-text>
      <v-textarea
        class="mt-0"
        label="Review"
        required
        auto-grow
        clearable
        counter="500"
        rows="3"
        v-model="review.content"
        :rules="reviewRules"
      ></v-textarea>
      <v-card-actions class="pa-0">
        <v-rating
          v-model="review.rating"
          hover
          dense
          color="yellow darken-3"
          background-color="grey darken-1"
          empty-icon="$ratingFull"
        ></v-rating>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          :loading="loading"
          :disabled="!review.rating || !review.content"
          @click="post"
        >Post</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
import { db } from "~/plugins/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
export default {
  props: {
    itemID: {
      type: String,
      required: true
    }
  },
  data: () => ({
    loading: false,
    review: {
      content: null,
      rating: 0
    },
    reviewRules: [
      v => !!v || "This field cannot be empty",
      v => (v && v.length <= 500) || "Review must be less than 500 characters"
    ]
  }),
  computed: mapState("user", ["currentUser", "userProfile"]),
  methods: {
    post() {
      this.loading = true;
      this.review.date = firebase.firestore.FieldValue.serverTimestamp();
      this.review.author = {
        id: this.currentUser.uid,
        photo: this.userProfile.photo.thumb,
        name: this.userProfile.name
      };
      db.collection(`items/${this.itemID}/reviews`)
        .doc(this.currentUser.uid)
        .set(this.review)
        .then(() => this.$emit("review:added", this.review));
    }
  }
};
</script>