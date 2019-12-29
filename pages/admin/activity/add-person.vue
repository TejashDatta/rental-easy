<template>
  <v-container>
    <h1>Add Person</h1>
    <v-form v-model="valid">
      <v-row>
        <v-col cols="12" sm="6">
          <h2>Person details</h2>
          <v-text-field label="Name" required v-model="item.name" :rules="nameRules"></v-text-field>
          <v-text-field label="Age" required v-model="item.person.age" :rules="priceRules"></v-text-field>
          <v-autocomplete
            label="Gender"
            required
            :items="['male', 'female', 'LGBTQ']"
            v-model="item.person.gender"
            :rules="required"
          />
          <v-autocomplete
            label="Activity"
            required
            :items="activities"
            multiple
            chips
            v-model="item.activities"
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
        </v-col>

        <v-col cols="12" sm="6">
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
          <h3>Rent Prices</h3>
          <v-row>
            <v-col v-for="(value, name) in item.prices" :key="name" class="py-0">
              <v-text-field required v-model="item.prices[name]" :rules="priceRules">
                <span slot="prepend" class="mt-1">₹</span>
                <span slot="label" class="text-capitalize">{{ name }}</span>
              </v-text-field>
            </v-col>
          </v-row>
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
</template>
<script>
import AuthGuardMixin from "~/mixins/AuthGuardMixin";
import firebase from "firebase/app";
import "firebase/firestore";
import { categories, activities } from "~/constants";
import { db, storage } from "~/plugins/firebase";
import { mapState } from "vuex";
export default {
  mixins: [AuthGuardMixin],
  computed: mapState("user", ["currentUser"]),
  data: () => ({
    activities: [...activities],
    valid: false,
    item: {
      activities: [],
      name: null,
      details: null,
      category: 'person',
      prices: {
        session: null
      },
      photo: null,
      thumb: null,
      blockedDates: [],
      rating: {
        total: 0,
        votes: 0
      },
      person: {
        age: null,
        gender: null
      },
      show: true,
      addedOn: firebase.firestore.FieldValue.serverTimestamp()
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
    ]
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
          this.$router.push("/admin");
          // this.addToAlgolia(docRef.id, this.item);
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
      const storageRef = storage.ref(`activity-persons/${file.name}`);
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
    },
    addToAlgolia(id, item) {
      var client = algoliasearch(
        ALGOLIA_APP_ID,
        "700460c655efb66b95aaf6e0649ab6e0"
      );
      var index = client.initIndex("re_items");
      return index.addObject({
        objectID: id,
        name: item.name,
        category: item.category,
        thumb: item.thumb
      });
    }
  }
};
</script>
