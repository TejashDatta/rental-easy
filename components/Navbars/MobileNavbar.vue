<template>
  <div>
    <v-app-bar class="grad" app>
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white" />
      <v-toolbar-title class="pl-0">
        <nuxt-link to="/" class="logo white--text">Rental Easy</nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="searchPanel = true" color="white">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- nav drawer -->
    <v-navigation-drawer app v-model="drawer">
      <!-- <v-list> -->
      <v-list-item two-line v-if="!currentUser" to="/auth" nuxt>
        <v-list-item-icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Login</v-list-item-title>
          <v-list-item-subtitle>Sign in or create account</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item two-line v-else>
        <v-list-item-avatar>
          <img v-if="userProfile" :src="userProfile.photo.thumb" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{currentUser.displayName}}</v-list-item-title>
          <!-- <v-list-item-subtitle>View Profile</v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>
      <!-- </v-list> -->

      <v-list v-if="currentUser" class="py-0">
        <v-list-item v-for="link in userLinks" :key="link.label" :to="link.to" nuxt>
          <v-list-item-icon>
            <v-icon>{{link.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{link.label}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="signOut">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list subheader>
        <v-subheader>Categories</v-subheader>
        <v-list-item
          v-for="cat in categories"
          :key="cat"
          :to="{ name: 'items', query: { cat } }"
          exact
          nuxt
        >
          <v-list-item-content>
            <v-list-item-title>{{cat}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-1 text-center body-2">Available exclusively in Kolkata</div>
        <v-divider />
        <div class="pa-2">
          <span class="grey--text text-darken-2 text-center d-block text-center mb-2">Contact us</span>
          <a href="tel:+918420162430" class="primary--text">
            <v-icon small color="primary" class="mr-1">mdi-phone</v-icon>+91 8420162430
          </a>
          <br />
          <a href="mailto:contact@rentaleasy.in" class="primary--text">
            <v-icon small color="primary" class="mr-1">mdi-email</v-icon>contact@rentaleasy.in
          </a>
        </div>
      </template>
    </v-navigation-drawer>

    <MobileSearch v-model="searchPanel" />
  </div>
</template>
<script>
import { categories } from "~/constants";
import NavbarUserMixin from "~/mixins/NavbarUserMixin";
import MobileSearch from "~/components/Search/MobileSearch";

export default {
  data: () => ({
    drawer: false,
    categories: categories,
    searchPanel: false
  }),
  components: { MobileSearch },
  mixins: [NavbarUserMixin]
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