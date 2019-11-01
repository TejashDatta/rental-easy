import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyCqxzGdSXg3_Qx1K2N0xgCYzVkUltTzzww",
    authDomain: "rental-easy.firebaseapp.com",
    databaseURL: "https://rental-easy.firebaseio.com",
    projectId: "rental-easy",
    storageBucket: "rental-easy.appspot.com",
    messagingSenderId: "109499350468",
    appId: "1:109499350468:web:a0ac7bd34f37a9fbb47891",
    measurementId: "G-N0MB30GHGN",
  };

  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

export default firebase;
