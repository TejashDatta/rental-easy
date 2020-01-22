<template>
  <div>Hello</div>
</template>
<script>
import AdminRouteGuard from "~/mixins/AdminRouteGuard";
import { db } from "~/plugins/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
export default {
  mixins: [AdminRouteGuard],
  created() {
    db.collection("items")
      .where("category", "==", "person")
      .get()
      .then(snap => {
        snap.docs.forEach(doc => {
          console.log(doc);
          db.collection("items")
            .doc(doc.id)
            .delete();
          // .update({
          //   rating: {
          //     total: 0,
          //     votes: 0
          //   },
          //   prices: firebase.firestore.FieldValue.delete()
          // });
        });
      });
  }
};
</script>