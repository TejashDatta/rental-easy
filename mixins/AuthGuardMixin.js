import { auth } from "~/plugins/firebase";

export default {
  beforeRouteEnter(to, from, next) {
    if (auth.currentUser) next();
    else next("/auth");
  },
};
