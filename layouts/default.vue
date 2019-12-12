<template>
  <v-app>
    <MobileNavbar v-if="$vuetify.breakpoint.smAndDown" />
    <DesktopNavbar v-else :socialLinks="socialLinks" />
    <v-content>
      <nuxt />
    </v-content>
    <v-footer color="grey darken-4" padless class="font-weight-light body-2 d-flex align-center">
      <div style="max-width: 700px; margin: auto;" class="mt-4 px-4">
        <h3 class="white--text text-center my-3">About Us</h3>
        <p
          class="grey--text text-justify caption"
        >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea consequatur sint corrupti, assumenda tempora quis dolorem excepturi commodi illum natus! Aliquam, sapiente doloremque. Laudantium voluptatum dolore eos eum officia quasi corrupti sint voluptatibus deserunt. Officia suscipit nemo quibusdam obcaecati, impedit deleniti eveniet exercitationem ipsum quo saepe molestias aliquam nesciunt. Accusantium.</p>

        <v-row justify="space-around" no-gutters>
          <v-btn
            v-for="link in footerLinks"
            :key="link.label"
            color="white"
            text
            rounded
            class="text-capitalize font-weight-regular"
            :to="link.to"
          >{{ link.label }}</v-btn>
        </v-row>

        <v-row justify="space-around" no-gutters>
          <v-btn
            v-for="link in socialLinks"
            :key="link.label"
            color="white"
            text
            rounded
            class="text-capitalize font-weight-light"
            :href="link.to"
            target="_blank"
          >
            <v-icon left>{{link.icon}}</v-icon>
            {{ link.label }}
          </v-btn>
        </v-row>

        <p
          class="text-center grey--text caption mt-2"
        >Copyright {{ new Date().getFullYear() }}. RentalEasy. All rights reserved.</p>
      </div>
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
      {
        icon: "mdi-facebook-box",
        label: "Facebook",
        to: "https://www.facebook.com/rentaleasykolkata/"
      },
      {
        icon: "mdi-instagram",
        label: "Instagram",
        to: "https://www.instagram.com/rentaleasy.in/?igshid=iggxpu43d4vt"
      }
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
