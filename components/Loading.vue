<template>
  <div class="mt-10 mb-3 d-flex flex-column align-center">
    <v-progress-circular indeterminate size="200" width="10" color="primary" />
    <div class="text-center mt-5">{{ msg }}</div>
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      type: String
    }
  }
};
</script>