import { mapState } from "vuex";
import { auth } from "~/plugins/firebase.js";

export default {
  methods: {
    signOut() {
      auth.signOut();
      this.$store.commit("user/setCurrentUser", null);
      this.$store.commit("user/setUserProfile", null);
    },
  },
  computed: mapState("user", ["currentUser", "userProfile"]),
  data: () => ({
    userLinks: [
      // { icon: 'mdi-account', to: '/user/profile', label: 'My Profile'},
      { icon: "mdi-view-list", to: "/user/orders", label: "My Orders" },
    ],
  }),
};
