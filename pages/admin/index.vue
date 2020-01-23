<template>
  <v-container>
    <div style="display: flex; justify-content: space-evenly">
      <nuxt-link to="/admin/verify">Verify new user added items</nuxt-link>
      <nuxt-link to="/admin/activity/add">Add activity</nuxt-link>
      <nuxt-link to="/admin/review">Add reviews</nuxt-link>
    </div>
  </v-container>
</template>
<script>
import AdminRouteGuard from "~/mixins/AdminRouteGuard";

export default {
  mixins: [AdminRouteGuard]
};
</script>