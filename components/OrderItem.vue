<template>
  <v-card outlined class="my-2 px-2">
    <v-row align="center" :dense="$vuetify.breakpoint.xsOnly">
      <v-col cols="4" sm="2">
        <BlurredThumb
          v-if="!order.person"
          :thumb="order.item.thumb"
          :full="order.item.thumb"
          style="border-radius: 5px"
        />
        <v-img
          v-else
          :lazy-src="require(`~/assets/activityImages/${order.item.name}.jpg`)"
          :aspect-ratio="4/3"
          class="d-flex align-center"
        >
          <v-img
            :src="require(`~/assets/activityImages/${order.item.name}.jpg`)"
            contain
            :aspect-ratio="4/3"
          ></v-img>
        </v-img>
      </v-col>
      <v-col>
        <h3>{{order.item.name}}</h3>
        <span
          v-if="!order.person"
        >{{formatDate(order.dates.start)}} - {{formatDate(order.dates.end)}}</span>
        <span v-else>{{order.startTime}} on {{order.dates}}</span>
        <br />
        <strong class="mr-1">₹{{order.price}}</strong>
        <span v-if="order.item.safety">
          +
          <strong>₹{{order.item.safety}}</strong>safety
        </span>
      </v-col>
      <!-- <v-col cols="1" class="d-flex justify-end justify-md-center">
                  <v-btn text icon small color="red" @click="removeOrder(order.item.id)">
                    <v-icon>mdi-minus-circle</v-icon>
                  </v-btn>
      </v-col>-->
    </v-row>
  </v-card>
</template>
<script>
import BlurredThumb from "~/components/BlurredThumb";
import dateMethods from "~/mixins/dateMethods";
export default {
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  components: { BlurredThumb },
  mixins: [dateMethods]
};
</script>