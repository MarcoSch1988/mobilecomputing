<template>
  <q-page class="flex flex-center q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <h5 class="text-grey-7 text-center">{{street}}</h5>
        <q-btn
          unelevated
          size="xl"
          color="primary"
          class="full-width text-white"
          label="Bestellen"
          to="/CreateList"
        />&nbsp;
        <q-btn
          unelevated
          size="xl"
          color="primary"
          class="full-width text-white q-mb-xl"
          label="Einkaufen"
          to="/Shopping"
        />

        <q-img src="../statics/home.svg" class="q-mt-xl" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  data: function() {
    return {
      street: "Theodor-Körnerstraße 115"
    };
  },
  methods: {
    test() {
      console.log(this.$feathers);
    }
  }
};
</script>
