<template>
  <v-container v-if="!added">
    <h1>Add Item</h1>
    <v-form v-model="valid">
      <v-row>
        <v-col cols="12" sm="6">
          <h2>Item details</h2>
          <v-text-field label="Name" required v-model="item.name" :rules="nameRules"></v-text-field>
          <v-autocomplete
            label="Category"
            required
            :items="categories"
            v-model="item.category"
            :rules="required"
          ></v-autocomplete>
          <v-textarea
            label="Details"
            auto-grow
            clearable
            counter="1000"
            rows="3"
            v-model="item.details"
            required
            :rules="detailsRules"
          ></v-textarea>
          <h3 class="mb-2">Add a Picture</h3>
          <input ref="fileInput" type="file" accept="image/png, image/jpeg" @change="selectPicture" />
          <br />
          <div v-if="imgSrc" class="mt-2 pa-2">
            <span class="grey--text">Preview</span>
            <v-img :lazy-src="imgSrc" :aspect-ratio="4 / 3">
              <template v-slot:placeholder>
                <v-row v-if="uploading" class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
                <v-img v-else :src="imgSrc" contain :aspect-ratio="4 / 3"></v-img>
              </template>
            </v-img>
          </div>

          <div v-if="$vuetify.breakpoint.xs">
            <br />
            <v-divider></v-divider>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <h2 class="mb-2">Price details</h2>
          <h3>Rent Prices</h3>
          <v-row>
            <v-col v-for="(value, name) in item.prices" :key="name" class="py-0">
              <v-text-field required v-model="item.prices[name]" :rules="priceRules">
                <span slot="prepend" class="mt-1">₹</span>
                <span slot="label" class="text-capitalize">{{ name }}</span>
              </v-text-field>
            </v-col>
          </v-row>
          <div class="d-flex align-center">
            <strong class="mr-2">Safety deposit charged:</strong>
            <v-text-field label="Safety Fee" required v-model="item.safety" :rules="priceRules">
              <span slot="prepend" class="mt-1">₹</span>
            </v-text-field>
          </div>
          <div class="d-flex justify-center mt-4">
            <v-btn
              :disabled="!valid || !item.photo"
              :loading="loading"
              large
              color="primary"
              @click="addItem"
            >Add Item</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
  <v-container v-else>
    <h1>Item Added</h1>
    <p>Thank you for adding your item to rentaleasy. It'll become available for others to rent out as soon as we verify it.</p>
  </v-container>
</template>
<script>
import emailjs from "emailjs-com";
import { service_id, template_id, user_id } from "~/emailjsConfig";
import AuthGuardMixin from "~/mixins/AuthGuardMixin";
import firebase from "firebase/app";
import "firebase/firestore";
import { categories } from "~/constants";
import { db, storage } from "~/plugins/firebase";
import { mapState } from "vuex";
export default {
  mixins: [AuthGuardMixin],
  computed: mapState("user", ["currentUser", "userProfile"]),
  data: () => ({
    categories: categories.filter(cat => cat != "Activity Sessions"),
    valid: false,
    item: {
      name: null,
      details: null,
      category: null,
      prices: {
        daily: null,
        weekly: null,
        monthly: null
      },
      photo: null,
      thumb: null,
      safety: null,
      blockedDates: [],
      rating: {
        total: 0,
        votes: 0
      },
      show: false,
      addedOn: firebase.firestore.FieldValue.serverTimestamp(),
      isActivity: false
    },
    imgSrc: null,
    uploading: false,
    loading: false,
    required: [v => !!v || "Required"],
    nameRules: [
      v => !!v || "Required",
      v => (v && v.length <= 30) || "Must be less than 30 characters"
    ],
    detailsRules: [
      v => !!v || "Required",
      v => (v && v.length <= 1000) || "Must be less than 1000 characters"
    ],
    priceRules: [
      v => !!v || "Required",
      v => !isNaN(v) || "Must be a number",
      v => v >= 0 || "Cannot be negative",
      v => v % 1 == 0 || "No decimal figures"
    ],
    added: false
  }),
  methods: {
    addItem() {
      this.loading = true;
      db.collection("items")
        .add({
          ...this.item,
          owner: this.currentUser.uid
        })
        .then(docRef => {
          var msg = { ...this.item };
          msg.owner = {
            email: this.currentUser.uid,
            name: this.currentUser.name,
            number: this.userProfile.number
          };
          var msg = JSON.stringify(msg)
            .replace(/{/g, "\n{")
            .replace(/,/g, ",\n");
          emailjs.send(service_id, template_id, { message_html: msg }, user_id);
          this.added = true;
        });
    },
    selectPicture(e) {
      this.imgSrc = null;
      this.uploading = true;

      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        alert("Please choose a file smaller than 2mb in size.");
        return;
      }

      if (!file.type.includes("image/")) {
        alert("Please select an image file");
        return;
      }

      if (typeof FileReader === "function") {
        this.upload(file);
        const reader = new FileReader();
        reader.onload = event => {
          this.imgSrc = event.target.result;

          var img = new Image();
          img.onload = () => {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            var h = img.height,
              w = img.width;

            var shrinkFactor = h > w ? 100 / h : 100 / w;
            canvas.height = h * shrinkFactor;
            canvas.width = w * shrinkFactor;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            this.item.thumb = canvas.toDataURL("image/jpeg", 0.85);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
        return;
      }
    },
    upload(file) {
      const storageRef = storage.ref(
        `${this.currentUser.uid}/items/${file.name}`
      );
      var task = storageRef.put(file);

      task.on(
        "state_changed",
        null,
        error => alert(error),
        () => {
          task.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.uploading = false;
            this.item.photo = downloadURL;
          });
        }
      );
    }
  }
};
</script>
