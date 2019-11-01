import { auth } from "~/plugins/firebase.js";

export default context => {
  const { store } = context;
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      if (user) {
        store.commit("user/setCurrentUser", user);
        store.dispatch("user/getProfile");
      }
      return resolve();
    });
  });
};
