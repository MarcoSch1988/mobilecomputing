<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs q-pt-md">
        <q-list>
          <div v-for="article in articles" :key="article.id">
            <q-expansion-item v-if="article.isSelected" default-opened>
              <template v-slot:header>
                <q-item-section>
                  <q-item-label
                    class="text-h5 text-primary text-weight-medium"
                    >{{ article.name }}</q-item-label
                  >
                </q-item-section>
              </template>
              <q-list>
                <q-btn
                  v-for="item in article.items"
                  :key="item._id"
                  no-caps
                  dense
                  :disable="item.status === 'open' ? false : true"
                  class="text-white q-pa-none q-ma-xs"
                  :class="item.status === 'open' ? 'bg-primary' : 'bg-grey-5'"
                  style="width: 100px; height:100px"
                  @click="boughtItem(item)"
                >
                  <div>
                    <div
                      class="text-h5"
                      style="position: absolute; top:0px; left:5px"
                    >
                      {{ item.text | subStr }}
                    </div>
                    <div class="text-caption q-pt-sm">{{ item.text }}</div>
                  </div>
                </q-btn>
              </q-list>
              <q-separator />
            </q-expansion-item>
          </div>
        </q-list>
      </div>
      <q-img src="../statics/cart.svg" class="footerback" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "CreateList",
  filters: {
    subStr: function(string) {
      console.log(string);
      return string.substring(0, 1);
    }
  },
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
    boughtItem(item) {
      this.$mainStore.articles.buy(item).then(() => {
        this.articles = this.$mainStore.articles.dataGrouped;
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
