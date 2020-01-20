<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :close-on-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateText"
        label="Select booking date"
        prepend-icon="mdi-calendar-range"
        readonly
        persistent-hint
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="unsavedDate" no-title scrollable :allowed-dates="allowedDates">
      <v-spacer></v-spacer>
      <v-btn text color="red" @click="cancel">Cancel</v-btn>
      <v-btn text color="green" @click="dateSelected">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
import dateMethods from "~/mixins/dateMethods";
export default {
  props: {
    date: {
      required: true
    },
    blockedDates: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    date() {
      this.$emit("update:date", this.unsavedDate);
    }
  },
  data: () => ({
    menu: false,
    unsavedDate: null
  }),
  methods: {
    cancel() {
      this.menu = false;
      this.unsavedDate = this.date;
    },
    dateSelected() {
      this.menu = false;
      this.$emit("update:date", this.unsavedDate);
    },
    allowedDates(date) {
      var dateFuture3 = new Date();
      dateFuture3.setDate(dateFuture3.getDate() + 3);
      return new Date(date) > dateFuture3;
      // && this.dateNotBlocked(date);
    }
    // dateNotBlocked(dateString) {
    //   var date = new Date(dateString);
    //   for (let i in this.blockedDates) {
    //     var datePair = this.blockedDates[i],
    //       start = new Date(datePair.start),
    //       end = new Date(datePair.end);
    //     if (date >= start && date <= end) return false;
    //   }
    //   return true;
    // }
  },
  computed: {
    dateText() {
      return this.formatDate(this.date);
    }
  },
  mixins: [dateMethods]
};
</script>