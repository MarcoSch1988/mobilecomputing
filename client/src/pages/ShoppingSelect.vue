<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs q-pt-md">
        <q-list>
          <div v-for="article in articles" :key="article.id">
            <q-expansion-item>
              <template v-slot:header>
                <q-checkbox v-model="article.isSelected" />

                <q-item-section class="q-pl-lg">
                  <q-item-label>{{ article.name }}</q-item-label>
                  <q-item-label caption
                    >{{ article.address.street }} -
                    {{ article.address.distance }} m</q-item-label
                  >
                  <q-item-label caption
                    >Artikelanzahl: {{ openArticles(article) }}</q-item-label
                  >
                </q-item-section>
              </template>
              <q-list>
                <div v-for="item in article.items" :key="item._id">
                  <q-item dense v-if="item.status === 'open'">
                    <q-item-section>&nbsp;</q-item-section>
                    <q-item-section side class="text-black q-mr-md">
                      {{ item.text }}
                    </q-item-section>
                  </q-item>
                </div>
              </q-list>
            </q-expansion-item>
            <q-separator />
          </div>
        </q-list>
        <q-btn
          class="full-width q-mt-xl"
          color="primary"
          size="lg"
          label="Einkaufen"
          @click="goShopping()"
        />
      </div>
      <q-img src="../statics/cart.svg" class="footerback" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "ShoppingSelect",
  data() {
    return {
      articles: []
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$mainStore.articles.load().then(() => {
        this.$mainStore.articles.getArticlesgroupedByName().then(() => {
          this.articles = this.$mainStore.articles.dataGrouped;
        });
      });
    },
    openArticles: function(article) {
      return article.items.filter(u => {
        return u.status === "open";
      }).length;
    },

    goShopping() {
      this.$mainStore.articles.load().then(() => {
        this.$mainStore.articles.getArticlesgroupedByName().then(() => {
          this.$router.push("/shopping");
        });
      });
    }
  }
};
</script>
<style lang="sass" scoped>
.footerback
  opacity: 0.4
  width: 80%
  position: absolute
  left: 10%
  z-index: -1
  bottom: 10px
  background-repeat: no-repeat
  filter: alpha(opacity=25) progid:DXImageTransform.Microsoft.Alpha(opacity=25)
</style>
