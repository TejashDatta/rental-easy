import { db, auth } from "~/plugins/firebase";

export const state = () => ({
  currentUser: null,
  userProfile: null
});

export const mutations = {
  setCurrentUser: (state, user) => (state.currentUser = user),
  setProfile: (state, data) => (state.userProfile = data)
};

export const actions = {
  updateNumber({ commit, state }, number) {
    db.collection("users")
      .doc(state.currentUser.uid)
      .update({ number });
    const profile = { ...state.userProfile, number };
    commit("setProfile", profile);
  },

  addAddress({ commit, state }, address) {
    var addresses = [address, ...state.userProfile.addresses];
    db.collection("users")
      .doc(state.currentUser.uid)
      .update({ addresses });
    const profile = { ...state.userProfile, addresses };
    commit("setProfile", profile);
  },

  removeAddress({ commit, state }, givenAddress) {
    var addresses = state.userProfile.addresses.filter(
      add => add.address !== givenAddress.address
    );
    db.collection("users")
      .doc(state.currentUser.uid)
      .update({ addresses });
    const profile = { ...state.userProfile, addresses };
    commit("setProfile", profile);
  },

  updateAuthPhoto({ commit, state }, photoURL) {
    auth.currentUser.updateProfile({ photoURL });
    commit("setCurrentUser", {
      ...state.currentUser,
      photoURL
    });
  },

  saveTalkAnswers({ commit, state }, talkAnswers) {
    db.collection("users")
      .doc(state.currentUser.uid)
      .update({ talkAnswers });
    const profile = { ...state.userProfile, talkAnswers };
    commit("setProfile", profile);
  },

  saveActivityAnswers({ commit, state }, activityAnswers) {
    db.collection("users")
      .doc(state.currentUser.uid)
      .update({ activityAnswers });
    const profile = { ...state.userProfile, activityAnswers };
    commit("setProfile", profile);
  },

  getProfile({ commit, dispatch, state }) {
    db.collection("users")
      .doc(state.currentUser.uid)
      .get()
      .then(doc => {
        if (doc.exists) commit("setProfile", doc.data());
        else dispatch("initProfile");
      });
  },

  initProfile({ commit, dispatch, state }) {
    var initProfile = {
      name: state.currentUser.displayName,
      addresses: [],
      number: null,
      photo: {}
    };
    const done = () => {
      commit("setProfile", initProfile);
      db.collection("users")
        .doc(state.currentUser.uid)
        .set(initProfile);
    };
    if (state.currentUser.photoURL && state.currentUser.providerData.length) {
      const provider = state.currentUser.providerData[0];
      if (provider.providerId === "facebook.com")
        initProfile.photo.full = provider.photoURL + "?height=300&width=300";
      //google oauth
      else initProfile.photo.full = provider.photoURL;

      var img = new Image();
      img.onload = () => {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 70;
        canvas.height = 70;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var thumb = canvas.toDataURL("image/jpeg", 0.85);
        initProfile.photo.thumb = thumb;
        done();
      };
      img.crossOrigin = "Anonymous";
      img.src = state.currentUser.photoURL;
    } else {
      const defaultURL =
        "https://firebasestorage.googleapis.com/v0/b/rental-easy.appspot.com/o/defaultProfilePicture.png?alt=media&token=5c77a041-75d2-4532-ae33-84b40d893a5b";
      initProfile.photo = {
        full: defaultURL,
        thumb: defaultURL
      };
      dispatch("updateAuthPhoto", defaultURL);
      done();
    }
  }
};
