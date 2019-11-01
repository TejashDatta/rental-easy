<template>
  <v-app>
    <MobileNavbar v-if="$vuetify.breakpoint.smAndDown" />
    <DesktopNavbar v-else />
    <v-content>
      <nuxt />
    </v-content>
    <v-footer color="background" padless>
      <v-row justify="center" no-gutters>
        <v-btn
          v-for="link in links"
          :key="link"
          color="primary"
          text
          rounded
          class="my-2"
        >{{ link }}</v-btn>
        <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>Rental Easy</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {
    DesktopNavbar: () => import("~/components/Navbars/DesktopNavbar"),
    MobileNavbar: () => import("~/components/Navbars/MobileNavbar")
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Caveat&display=swap");
.logo {
  font-family: "Caveat", cursive;
  font-size: 2.5rem;
}
a {
  text-decoration: none;
}
.social-link:hover {
  color: #1e88e5 !important;
}
</style>
