import { auth } from "~/plugins/firebase";

export default {
  beforeRouteEnter(to, from, next) {
    var admins = [
      "tejashdatta@gmail.com",
      "inteshabnehal@gmail.com",
      "shreshtha.sarkar5@gmail.com"
    ];
    if (auth.currentUser && admins.includes(auth.currentUser.email)) {
      next();
      // auth.currentUser.getIdTokenResult().then(idTokenResult => {
      //   if (!!idTokenResult.claims.admin) {
      //     next();
      //   } else {
      //     next("/admin/permission-denied");
      //   }
      // });
    } else next("/auth");
  }
};
