<template>
  <v-container>
    <h1>Add review</h1>
    <v-text-field label="Item ID" v-model="itemId"></v-text-field>
    <v-text-field label="Author Name" v-model="review.author.name"></v-text-field>
    <v-text-field label="Author Picture" v-model="review.author.photo"></v-text-field>
    <v-textarea class="mt-0" label="Review" auto-grow clearable rows="3" v-model="review.content"></v-textarea>
    <v-rating
      v-model="review.rating"
      hover
      dense
      color="yellow darken-3"
      background-color="grey darken-1"
      empty-icon="$ratingFull"
    ></v-rating>
    <v-btn @click="add">Add</v-btn>
    added: {{added}}
  </v-container>
</template>
<script>
import AdminRouteGuard from "~/mixins/AdminRouteGuard";
import { db } from "~/plugins/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  mixins: [AdminRouteGuard],
  data: () => ({
    review: {
      author: {
        id: "dummy",
        name: null,
        photo: null
      },
      content: null,
      date: null,
      rating: 0
    },
    itemId: null,
    added: false
  }),
  methods: {
    add() {
      this.review.date = firebase.firestore.FieldValue.serverTimestamp();
      this.review.author.id = db
        .collection(`items/${this.itemId}/reviews`)
        .doc("dummy" + this.review.author.name)
        .set(this.review)
        .then(() => (this.added = true));
    }
  }
};
</script>