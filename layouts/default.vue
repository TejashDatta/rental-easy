<template>
  <v-app>
    <MobileNavbar v-if="$vuetify.breakpoint.smAndDown" />
    <DesktopNavbar v-else :socialLinks="socialLinks" />
    <v-content>
      <nuxt />
    </v-content>
    <v-footer color="background darken-1" padless>
      <v-row justify="space-around" no-gutters>
        <v-btn
          v-for="link in footerLinks"
          :key="link.label"
          color="secondary darken-1"
          text
          rounded
          class="text-capitalize"
          :to="link.to"
        >{{ link.label }}</v-btn>

        <v-col class="py-1 text-center secondary--text text-darken-1" cols="12">
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
  },
  data: () => ({
    socialLinks: [
      { icon: "mdi-facebook-box", href: "www.facebook.com" },
      { icon: "mdi-instagram", href: "www.instagram.com" }
    ],
    footerLinks: [
      { label: "Contact Us", to: "/contact-us" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/tos" }
    ]
  })
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Caveat&display=swap");
.logo {
  font-family: "Caveat", cursive;
  font-size: 2.5rem;
}
.logo-font {
  font-family: "Caveat", cursive;
}
a {
  text-decoration: none;
}
.social-link:hover {
  color: #1e88e5 !important;
}
</style>
