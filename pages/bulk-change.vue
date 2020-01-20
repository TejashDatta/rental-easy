<template>
  <div>Hello</div>
</template>
<script>
import AdminRouteGuard from "~/mixins/AdminRouteGuard";
import { db } from "~/plugins/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import { activities } from "~/constants";
export default {
  mixins: [AdminRouteGuard],
  created() {
    db.collection("items")
      .get()
      .then(snap => {
        snap.docs.forEach(doc => {
          console.log(doc);
          if (
            doc.data().category == "Activity Sessions" ||
            activities.includes(doc.data().category)
          ) {
            db.collection("items")
              .doc(doc.id)
              .delete();
          }
        });
      });
  }
};
</script>