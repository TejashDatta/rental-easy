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
        v-model="dateRangeText"
        label="Select booking dates"
        prepend-icon="mdi-calendar-range"
        readonly
        hint="Select the start and end dates of the period of renting"
        persistent-hint
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="unsavedDates" range no-title scrollable :allowed-dates="allowedDates">
      <v-spacer></v-spacer>
      <v-btn text color="red" @click="cancel">Cancel</v-btn>
      <v-btn text color="green" @click="datesSelected">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
import dateMethods from "~/mixins/dateMethods";
export default {
  props: {
    dates: {
      type: Array,
      required: true
    },
    blockedDates: {
      type: Array,
      default: []
    }
  },
  watch: {
    dates() {
      this.$emit("update:dates", this.unsavedDates.sort());
    }
  },
  data: () => ({
    menu: false,
    unsavedDates: []
  }),
  methods: {
    cancel() {
      this.menu = false;
      this.unsavedDates = this.dates;
    },
    datesSelected() {
      this.menu = false;
      this.$emit("update:dates", this.unsavedDates.sort());
    },
    allowedDates(date) {
      var dateFuture7 = new Date();
      dateFuture7.setDate(dateFuture7.getDate() + 7);
      return new Date(date) > dateFuture7 && this.dateNotBlocked(date);
    },
    dateNotBlocked(dateString) {
      var date = new Date(dateString);
      for (let i in this.blockedDates) {
        var datePair = this.blockedDates[i],
          start = new Date(datePair.start),
          end = new Date(datePair.end);
        if (date >= start && date <= end) return false;
      }
      return true;
    }
  },
  computed: {
    dateRangeText() {
      return this.dates.map(date => this.formatDate(date)).join(" - ");
    }
  },
  mixins: [dateMethods]
};
</script>