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
      .get()
      .then(snap => {
        snap.docs.forEach(doc => {
          console.log(doc);
          if (doc.data().category != "Activity Sessions")
            db.collection("items")
              .doc(doc.id)
              .update({ isActivity: false });
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