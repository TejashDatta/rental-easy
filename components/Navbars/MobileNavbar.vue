<template>
  <div>
    <v-app-bar color="background" app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title class="pl-0">
        <nuxt-link to="/" class="logo primary--text">Rental Easy</nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="searchPanel = true">
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
    categories: ["All", ...categories],
    searchPanel: false
  }),
  components: { MobileSearch },
  mixins: [NavbarUserMixin]
};
</script>