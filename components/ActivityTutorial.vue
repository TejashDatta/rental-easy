<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on }">
      <a href="#" v-on="on">How it works?</a>
    </template>

    <v-card>
      <v-card-title class="headline" primary-title>How Activity Sessions Work</v-card-title>

      <v-card-text class="black--text">
        Meet old friends or new people and bond over your favourite activity. Add spice to your weekends, by indulging in something new.
        <ol>
          <li>Choose an activity.</li>
          <li>Go with friends or match with someone on our platform.</li>
          <li>You’ll be charged on per session of the activity. Each session lasts till a maximum of 1 hour.</li>
        </ol>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    dialog: false
  })
};
</script>