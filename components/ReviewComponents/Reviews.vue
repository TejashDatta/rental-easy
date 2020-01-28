<template>
  <div>
    <ReviewForm
      v-if="!userReview && userHasOrder"
      :itemID="itemID"
      @review:added="review => userReview = review"
      class="mb-4"
    />
    <ReviewItem
      v-if="userReview"
      :itemID="itemID"
      :review="userReview"
      @review:removed="userReview = null"
      class="mb-4"
    />
    <div v-if="reviews.length || userReview">
      <ReviewItem v-for="review in reviews" :review="review" :key="review.author.id" class="mb-4" />
    </div>
    <p v-else-if="!loading">No reviews yet</p>
    <v-btn tile block :loading="loading" v-if="canShowMore" color="primary">Show More</v-btn>
  </div>
</template>
<script>
import { db } from "~/plugins/firebase";
import { mapState } from "vuex";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
export default {
  components: { ReviewForm, ReviewItem },
  props: {
    itemID: {
      type: String,
      required: true
    }
  },
  computed: mapState("user", ["currentUser"]),
  data: () => ({
    userHasOrder: false,
    userReview: null,
    reviews: [],
    loading: true,
    q: null,
    limit: 3,
    canShowMore: true
  }),
  methods: {
    loadNext() {
      this.loading = true;
      this.q.get().then(snap => {
        if (snap.docs.length < this.limit) this.canShowMore = false;
        else this.q = this.q.startAfter(snap.docs[snap.docs.length - 1]);
        this.reviews = this.reviews.concat(snap.docs.map(doc => doc.data()));
        if (this.currentUser)
          this.reviews = this.reviews.filter(
            rev => rev.author.id !== this.currentUser.uid
          );
        this.loading = false;
      });
    },
    init() {
      if (!this.currentUser) return;
      db.collection(`items/${this.itemID}/reviews`)
        .where("author.id", "==", this.currentUser.uid)
        .get()
        .then(snap => {
          if (!snap.empty) {
            this.userReview = snap.docs[0].data();
            this.userHasOrder = true;
            return;
          }
          db.collection("orders")
            .where("item.id", "==", this.itemID)
            .where("user.id", "==", this.currentUser.uid)
            .get()
            .then(snap => {
              if (!snap.empty) this.userHasOrder = true;
            });
        });
    }
  },
  created() {
    this.init();
    this.q = db
      .collection(`items/${this.itemID}/reviews`)
      .limit(this.limit)
      .orderBy("date", "desc");
    this.loadNext();
  }
};
</script>