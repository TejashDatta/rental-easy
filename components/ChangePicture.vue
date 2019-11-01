<template>
  <div>
    <input
      ref="fileInput"
      v-show="false"
      type="file"
      accept="image/png, image/jpeg"
      @change="selectPicture"
    />
    <slot :clickHandler="() => $refs.fileInput.click()" />
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title class="headline">Crop Picture</v-card-title>
        <div v-if="!imgSrc">
          <Loading />
        </div>
        <VueCropper
          class="mx-auto mt-2 mb-8"
          v-else
          ref="cropper"
          :src="imgSrc"
          :viewMode="3"
          dragMode="move"
          :toggleDragModeOnDblclick="false"
          :aspectRatio="1"
          :autoCropArea="1"
          :containerStyle="containerStyle"
        />
        <v-card-actions class="d-flex flex-column align-end">
          <v-progress-linear height="1" :value="uploadProgress" />
          <div>
            <v-btn color="red" text @click="close">Cancel</v-btn>
            <v-btn color="green" text @click="crop" :loading="uploading">Upload</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import VueCropper from "vue-cropperjs";
import Loading from "@/components/Loading";
import "cropperjs/dist/cropper.css";
import { db, storage, auth } from "@/firebase";
import { mapState } from "vuex";

export default {
  components: { VueCropper, Loading },
  data: () => ({
    dialog: false,
    imgSrc: null,
    uploadProgress: 0,
    uploading: false
  }),
  computed: {
    ...mapState(["currentUser"]),
    containerStyle() {
      return this.$vuetify.breakpoint.xs
        ? { width: "300px", height: "300px" }
        : { width: "400px", height: "400px" };
    }
  },
  methods: {
    selectPicture(e) {
      this.imgSrc = null;
      this.uploadProgress = 0;
      this.uploading = false;

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
        this.dialog = true;
        const reader = new FileReader();

        reader.onload = event => {
          this.imgSrc = event.target.result;
        };

        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    close() {
      this.dialog = false;
      this.$refs.fileInput.value = "";
    },
    crop() {
      this.uploading = true;
      const cropImg = this.$refs.cropper.getCroppedCanvas({
        maxWidth: 350,
        maxHeight: 350
      });

      var img = new Image();

      img.onload = () => {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        canvas.width = 70;
        canvas.height = 70;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        var thumb = canvas.toDataURL("image/jpeg", 0.85);

        cropImg.toBlob(blob => this.upload(blob, thumb), "image/jpeg", 0.85);
      };

      img.src = cropImg.toDataURL();
    },
    upload(imgBlob, thumbDataURL) {
      const storageRef = storage.ref("profilePictures/" + this.currentUser.uid);
      var task = storageRef.put(imgBlob);

      task.on(
        "state_changed",
        snapshot => {
          this.uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => alert(error),
        () => {
          task.snapshot.ref.getDownloadURL().then(downloadURL => {
            const dbUpdate = db
              .collection("users")
              .doc(this.currentUser.uid)
              .update({
                photo: {
                  full: downloadURL,
                  thumb: thumbDataURL
                }
              });

            const authUpdate = auth.currentUser.updateProfile({
              photoURL: downloadURL
            });

            this.done(downloadURL);
            this.$store.dispatch("changeProfilePicture", downloadURL);
            return Promise.all([dbUpdate, authUpdate]);
          });
        }
      );
    },
    done(photoURL) {
      this.close();
      this.$emit("changedPicture", photoURL);
    }
  }
};
</script>