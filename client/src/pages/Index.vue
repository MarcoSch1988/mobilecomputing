<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" />
    <q-btn @click="test()">Test</q-btn>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  methods: {
    test() {
      console.log(this.$feathers);
    }
  }
};
</script>
