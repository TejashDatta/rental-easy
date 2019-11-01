<template>
  <v-card>
    <v-card-text>
      <v-rating
        v-model="review.rating"
        readonly
        dense
        small
        color="yellow darken-3"
        background-color="grey darken-1"
        empty-icon="$ratingFull"
      ></v-rating>
      <p class="black--text mt-2">{{review.content}}</p>
      <v-divider></v-divider>
      <v-card-actions class="pa-0 mt-1">
        <v-avatar size="30" class="mr-3">
          <img :src="review.author.photo" />
        </v-avatar>
        {{review.author.name}}
        <v-spacer />
        <v-btn
          icon
          text
          color="secondary"
          v-if="currentUser && review.author.id === currentUser.uid"
          :loading="loading"
          @click="remove"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>
<script>
import { db } from "~/plugins/firebase";
import { mapState } from "vuex";
export default {
  props: {
    itemID: String,
    review: {
      type: Object,
      required: true
    }
  },
  computed: mapState("user", ["currentUser"]),
  data: () => ({
    loading: false
  }),
  methods: {
    remove() {
      this.loading = true;
      db.collection(`items/${this.itemID}/reviews`)
        .doc(this.review.author.id)
        .delete()
        .then(() => this.$emit("review:removed"));
    }
  }
};
</script>