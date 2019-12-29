<template>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
        <a href="#" v-on="on">How it works?</a>
      </template>

      <v-card>
        <v-card-title
          class="headline"
          primary-title
        >
          How Activity Sessions Work
        </v-card-title>

        <v-card-text class="black--text">
          Meet new people to try out new activities. Share ideas and experiences with new friends. Discover new people in your city. Choose an activity partner. The easy steps are as follows :
          <ol>
              <li>Choose an activity.</li>
              <li>Choose the person who you like.</li>
              <li>Based on the activity and time you will be charged per half an hour.</li>
          </ol>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
export default {
    data: () => ({
        dialog: false
    })
}
</script>