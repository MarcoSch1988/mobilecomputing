<template>
  <q-page class="flex flex-center q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 ">
        <!-- <h4 class="text-center q-my-sm">Willkommen</h4> -->
        <h6 class="text-primary text-center q-mt-sm">
          {{ this.$mainStore.user.data.firstname }} {{ user.surname }}<br />
          {{ user.street }}<br />
          {{ user.plz }} {{ user.city }}
        </h6>
        <div class="q-px-md">
          <q-btn
            unelevated
            size="xl"
            color="primary"
            class="full-width text-white"
            label="Bestellen"
            to="/order"
          />&nbsp;
          <q-btn
            unelevated
            size="xl"
            color="primary"
            class="full-width text-white q-mb-xl"
            label="Einkaufen"
            to="/shopping"
          />
        </div>
        <q-img src="../statics/home.svg" class="q-mt-xl" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Home",
  data: function() {
    return {
      user: this.$mainStore.user.data
    };
  },
  mounted() {
    // this.loadData();
    this.$mainStore.user.reAuthenticate().then(() => {
      this.user = this.$mainStore.user.data;
    });
  },
  methods: {
    loadData() {
      // this.$mainStore.user.reAuthenticate().then(() => {
      //   this.$mainStore.articles.load().then(() => {
      //     this.$mainStore.articles.getArticlesgroupedByName().then(() => {});
      //   });
      // });
      this.$mainStore.user.reAuthenticate().then(() => {
        this.user = this.$mainStore.user.data;
      });
    }
  }
};
</script>
