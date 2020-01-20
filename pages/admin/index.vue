<template>
  <v-container>
    <div style="display: flex; justify-content: space-evenly">
      <nuxt-link to="/admin/verify">Verify new user added items</nuxt-link>
      <nuxt-link to="/admin/activity/add">Add activity</nuxt-link>
    </div>
  </v-container>
</template>
<script>
import { auth } from "~/plugins/firebase";
import AdminRouteGuard from "~/mixins/AdminRouteGuard";

export default {
  mixins: [AdminRouteGuard]
};
</script>