import { auth } from "~/plugins/firebase";

export default {
  beforeRouteEnter(to, from, next) {
    if (auth.currentUser) {
      next();
      // auth.currentUser.getIdTokenResult().then(idTokenResult => {
      //   if (!!idTokenResult.claims.admin) {
      //     next();
      //   } else {
      //     next("/admin/permission-denied");
      //   }
      // });
    } else next("/auth");
  },
};
