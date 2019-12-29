<template>
  <v-container>
    <h2>Login / Create Account</h2>
    <p class="text-center">
      <strong>{{$route.query.msg}}</strong>
    </p>
    <div class="mt-12" id="firebaseui-auth-container" />
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { auth } from "~/plugins/firebase";

export default {
  beforeRouteEnter(to, from, next) {
    if (auth.currentUser) next(false);
    else next();
  },
  mounted() {
    let uiConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
      ],
      privacyPolicyUrl: "/privacy-policy",
      tosUrl: "/tos",
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      callbacks: {
        signInSuccessWithAuthResult: authResult => {
          this.$store.commit("user/setCurrentUser", authResult.user);
          this.$store.dispatch("user/getProfile");
          let { rdr } = this.$route.query;
          if (!rdr)
            rdr = '/'
          this.$router.push(rdr);
          return false;
        }
      }
    };
    var ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>

<style>
.v-application ul {
  padding-left: 0 !important;
}
</style>

