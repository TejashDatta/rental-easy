<template>
  <v-card class="mt-6">
    <v-container>
      <v-card-title class="headline">Frequently Asked Questions</v-card-title>
      <v-card-text>
        <div v-for="(value, key) in desc" :key="key">
          <p>
            <b>{{label[key]}}</b>
            <br />
            {{value}}
          </p>
        </div>

        <p>
          <b>What are the payment options available ?</b>
          <br />Payment may be made on the booking day itself at the location or can be paid online as well.
        </p>
        <p>
          <b>What is the cancellation policy ?</b>
          <br />In case of unavailability of the service or any cancelation, the money is fully refundable within 24 hrs.
        </p>
      </v-card-text>
    </v-container>
  </v-card>
</template>
<script>
export default {
  props: {
    activityName: {
      type: String,
      required: true
    }
  },
  data: () => ({
    label: {
      duration: "What is the Duration of the Event?",
      timing: "What are the Available Timings?",
      equipment: "Is the neccesary equipment provided by Rental Easy?"
    }
  }),
  computed: {
    desc() {
      switch (this.activityName) {
        case "Swimming":
        case "Badminton":
        case "Pool":
        case "Table Tennis":
        case "Steam Bath":
          return {
            duration: `The pricing provided are for each session which last for 30-35 minutes.\n
            The session can be prolonged but are chargeable at Rs. 30 per 15 mins extra.`,
            timing: `Tue to Sun, 11 A.M. to 8 P.M.`,
            equipment: `All the materials like shuttle cock, badminton racket, table tennis bat, pool balls and pool cue club will be provided.
            Kindly carry your own swimming costume.`
          };
        case "Table Talk":
          return {
            duration: `Each session which last for 30-35 minutes.`,
            timing: `Mon to Sun, 11 A.M. to 8 P.M.`
          };
        case "Zumba":
          return {
            duration: `The pricing provided are for each session which last for 45-60 minutes.`,
            timing: `Mon to Sun, 11 AM to 8PM.`
          };
        case "Pottery":
          return {
            timing: `Tue to Sun, 5 AM - 7AM or 5 PM - 7 PM`,
            equipment: "All the equipments will be provided by us."
          };
        case "Horse Riding":
          return {
            timing: `Saturday and Sunday (11:00 am - 1:00 pm)`,
            equipment: "All the equipments will be provided by us."
          };
      }
    }
  }
};
</script>
<style scoped>
.v-card__title {
  word-break: break-word;
}
</style>