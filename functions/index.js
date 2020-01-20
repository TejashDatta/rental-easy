const functions = require("firebase-functions");
const admin = require("firebase-admin");
const FieldValue = admin.firestore.FieldValue;

admin.initializeApp();
const db = admin.firestore();

exports.incRating = functions.firestore
  .document("items/{itemID}/reviews/{reviewID}")
  .onCreate((snap, context) => {
    var review = snap.data();
    return db
      .collection("items")
      .doc(context.params.itemID)
      .update({
        "ratings.total": FieldValue.increment(review.rating),
        "ratings.votes": FieldValue.increment(1)
      });
  });

exports.decRating = functions.firestore
  .document("items/{itemID}/reviews/{reviewID}")
  .onDelete((snap, context) => {
    var review = snap.data();
    return db
      .collection("items")
      .doc(context.params.itemID)
      .update({
        "ratings.total": FieldValue.increment(-review.rating),
        "ratings.votes": FieldValue.increment(-1)
      });
  });

exports.addBlockedDate = functions.firestore
  .document("orders/{orderID}")
  .onCreate((snap, context) => {
    var order = snap.data();
    if (order.dates)
      return db
        .collection("items")
        .doc(order.item.id)
        .update({
          blockedDates: FieldValue.arrayUnion(order.dates)
        });
    else return null;
  });
