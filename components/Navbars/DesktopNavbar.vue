<template>
  <div class="elevation-2 grad">
    <v-container class="pt-1 pb-0">
      <div class="d-flex justify-space-between align-center">
        <span class="caption white--text">
          <a href="tel:+918240903323" class="white--text">
            <v-icon small color="white" class="mr-1">mdi-phone</v-icon>+91 8240903323
          </a> /
          <a href="mailto:contact@rentaleasy.in" class="white--text">
            <v-icon small color="white" class="mr-1">mdi-email</v-icon>contact@rentaleasy.in
          </a>
        </span>
        <span class="white--text caption">
          <span class="mr-3">Available exclusively in Kolkata</span>
          <nuxt-link to="/renter/add-item" class="white--text">
            <v-icon small color="white" class="mr-1">mdi-view-grid-plus</v-icon>List My Item
          </nuxt-link>
        </span>
      </div>
      <div class="d-flex justify-space-between align-center">
        <nuxt-link to="/" class="logo white--text">RentalEasy</nuxt-link>

        <DesktopSearch class="flex-grow-1 flex-shrink-1" />

        <v-toolbar-items v-if="!currentUser" class="align-self-stretch">
          <v-btn
            text
            color="white"
            class="pl-3 pr-1"
            :to="`/auth/?rdr=${$nuxt.$route.fullPath}`"
            nuxt
          >
            <v-icon left>mdi-account-circle</v-icon>Sign In
          </v-btn>
        </v-toolbar-items>

        <v-toolbar-items v-else class="align-self-stretch align-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn color="white" text class="pl-3 pr-1 text-capitalize" v-on="on">
                <v-avatar class="mr-2" size="25">
                  <img alt="Avatar" v-if="userProfile" :src="userProfile.photo.thumb" />
                </v-avatar>
                {{ currentUser.displayName | firstName }}
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item v-for="link in userLinks" :key="link.label" :to="link.to" nuxt>
                <v-icon class="mr-2">{{link.icon}}</v-icon>
                <v-list-item-title>{{link.label}}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="signOut">
                <v-icon class="mr-2">mdi-logout-variant</v-icon>
                <v-list-item-title>Sign out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </div>
      <v-tabs background-color="transparent" fixed-tabs color="white" hide-slider>
        <v-tab
          v-for="cat in categories"
          :key="cat"
          class="text-capitalize white--text"
          exact
          nuxt
          :to="`/items?cat=${cat}`"
        >{{cat}}</v-tab>
      </v-tabs>
    </v-container>
  </div>
</template>
<script>
import NavbarUserMixin from "~/mixins/NavbarUserMixin";
import DesktopSearch from "~/components/Search/DesktopSearch";
import { categories } from "~/constants";

export default {
  props: {
    socialLinks: {
      type: Array,
      required: true
    }
  },
  components: { DesktopSearch },
  mixins: [NavbarUserMixin],
  filters: {
    firstName: v => v.split(" ")[0]
  },
  data: () => ({
    categories: categories
  })
};
</script>
<style scoped>
.grad {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    to bottom right,
    rgba(13, 71, 161, 1) 0%,
    rgba(3, 169, 244, 1) 100%
  );
}
</style>