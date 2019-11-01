<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on" block outlined style="min-height:100px; height: 100%">
        <v-icon left>mdi-plus</v-icon>Address
      </v-btn>
    </template>
    <v-card>
      <v-container>
        <v-card-title class="headline">Add Address</v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-text-field label="Name" required v-model="address.name" :rules="nameRules"></v-text-field>
            <v-textarea
              label="Address"
              required
              auto-grow
              clearable
              counter="200"
              rows="3"
              v-model="address.address"
              :rules="addressRules"
            ></v-textarea>
            <v-text-field label="City" value="Kolkata" disabled></v-text-field>
            <v-text-field label="Pin Code" required v-model="address.pin" :rules="pinRules"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="$refs.form.resetValidation(); dialog = false">Cancel</v-btn>
          <v-btn
            color="green"
            text
            :disabled="!valid"
            @click="addAddress(address); dialog = false"
          >Save</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    dialog: false,
    valid: false,
    address: {
      name: null,
      address: null,
      pin: null
    },
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 30) || "Name must be less than 30 characters"
    ],
    addressRules: [
      v => !!v || "Address is required",
      v => (v && v.length <= 200) || "Address must be less than 200 characters"
    ],
    pinRules: [
      v => !!v || "Pin Code is required",
      v => !isNaN(v) || "Pin Code must be a number"
    ]
  }),
  methods: mapActions("user", ["addAddress"])
};
</script>