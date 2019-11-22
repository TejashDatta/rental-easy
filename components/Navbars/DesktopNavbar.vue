<template>
  <div class="background elevation-2">
    <v-container class="pt-1 pb-0">
      <div class="d-flex justify-space-between align-center">
        <span class="caption">
          <a href="tel:+918420162430">+91 8420162430</a> /
          <a href="mailto:contact@rentaleasy.in">contact@rentaleasy.in</a>
        </span>
        <div>
          <v-btn
            class="social-link ml-1"
            v-for="link in socialLinks"
            :key="link.href"
            target="_blank"
            :href="link.href"
            text
            icon
            small
          >
            <v-icon>{{link.icon}}</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="d-flex justify-space-between align-center">
        <nuxt-link to="/" class="logo primary--text">RentalEasy</nuxt-link>

        <DesktopSearch class="flex-grow-1 flex-shrink-1" />

        <v-toolbar-items v-if="!currentUser" class="align-self-stretch">
          <v-btn
            text
            color="secondary"
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
              <v-btn color="secondary" text class="pl-3 pr-1 text-capitalize" v-on="on">
                <v-avatar class="mr-2" size="25">
                  <img alt="Avatar" v-if="userProfile" :src="userProfile.photo.thumb" />
                </v-avatar>
                {{ currentUser.displayName | firstName }}
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item to="/user/orders" nuxt>
                <v-icon class="mr-2">mdi-view-list</v-icon>
                <v-list-item-title>My orders</v-list-item-title>
              </v-list-item>
              <v-list-item @click="signOut">
                <v-icon class="mr-2">mdi-logout-variant</v-icon>
                <v-list-item-title>Sign out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
      </div>
    </v-container>
  </div>
</template>
<script>
import NavbarUserMixin from "~/mixins/NavbarUserMixin";
import DesktopSearch from "~/components/Search/DesktopSearch";

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
  }
};
</script>