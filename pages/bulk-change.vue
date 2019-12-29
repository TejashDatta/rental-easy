<template>
  <div>Hello</div>
</template>
<script>
import { db } from "~/plugins/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
export default {
  created() {
    db.collection("items")
      .get()
      .then(snap => {
        snap.docs.forEach(doc => {
          console.log(doc);
          db.collection("items")
            .doc(doc.id)
            .update({
              // rejectReason: firebase.firestore.FieldValue.delete()
              // addedOn: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
      });
  }
};
</script>