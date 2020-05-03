<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs q-pt-md">
        <h5
          v-if="articlesWithoutOld.length < 1 && isLoading === false"
          class="text-center text-primary"
        >
          Keine Einkäufe in Ihrer Umgebung verfügbar oder Sie haben keine
          Internetverbindung
        </h5>
        <q-list>
          <div v-for="article in articlesWithoutOld" :key="article.id">
            <q-expansion-item
              v-if="article.isSelected"
              style="border-bottom: solid 1px #CCCCCC"
            >
              <template v-slot:header>
                <q-item-section>
                  <q-item-label
                    class="text-h6 text-primary q-ml-none"
                    style="display: flex; justify-content: space-between"
                  >
                    {{ article.name }}
                    <span class="text-caption text-grey-7"
                      >{{ openArticles(article) }}/{{
                        article.items.length
                      }}</span
                    >
                  </q-item-label>
                  <q-item-label caption>
                    {{ article.address.street }} -
                    {{ article.address.distance }} m
                  </q-item-label>
                </q-item-section>
                <q-separator />
              </template>
              <q-list>
                <!-- :disable="item.status === 'open' ? false : true" -->
                <q-btn
                  v-for="item in article.items"
                  :key="item._id"
                  no-caps
                  dense
                  class="text-white q-pa-none q-ma-xs"
                  :class="item.status === 'open' ? 'bg-primary' : 'bg-grey-5'"
                  style="width: 100px; height:100px"
                  @click="
                    item.status === 'open'
                      ? boughtItem(item)
                      : openReactivateDialog(item)
                  "
                >
                  <div>
                    <div
                      class="text-h5 text-left"
                      style="position: absolute; top:0px; left:5px;"
                    >
                      {{ item.text | subStr }}
                    </div>
                    <div
                      class="text-caption text-center"
                      style="max-width:100px; word-wrap: break-word;"
                    >
                      {{ item.text }}
                    </div>
                  </div>
                </q-btn>
              </q-list>
              <q-separator />
            </q-expansion-item>
          </div>
        </q-list>
      </div>
      <q-dialog v-model="reactivateAlert.active" persistent>
        <q-card>
          <q-toolbar>
            <q-icon name="reply" style="font-size: 2em;" />
            <q-toolbar-title>
              <span class="text-weight-bold">Rückgängig</span>
            </q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <q-card-section style="font-size: 1.4em; word-wrap: break-word;">
            Wollen Sie den Einkauf von
            <b>{{ reactivateAlert.item.text }}</b> rückgängig machen?
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              v-close-popup
              label="Abbrechen"
              color="primary"
              class="q-pa-xs"
            />
            <q-btn
              v-close-popup
              label="Ja"
              color="primary"
              class="q-pa-xs"
              @click="reactivateItem(reactivateAlert.item)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-img src="../statics/cart.svg" class="footerback" />
    </div>
  </q-page>
</template>

<script>
import { date, Loading } from "quasar";

export default {
  name: "CreateList",
  filters: {
    subStr: function(string) {
      return string.substring(0, 1);
    }
  },
  data() {
    return {
      articles: this.$mainStore.articles,
      isLoading: false,
      reactivateAlert: {
        active: false,
        item: {}
      }
    };
  },
  computed: {
    articlesWithoutOld: function() {
      const maxAgeInHours = 24;

      //Article kopieren
      let myarticles = Array.from(this.articles.dataGrouped);

      let asd = myarticles.filter(article => {
        if (article.isSelected === false) {
          return;
        }
        article.items = article.items.filter(item => {
          //Prüfen ob Status = closed und boughtAt-Date älter als maxAgeinHours
          //Nur die Zurücklieferen die nicht zu alt sind

          let dateDiffInHours = date.getDateDiff(
            Date.now(),
            item.boughtAt,
            "hours"
          );
          if (
            (item.status === "closed" && dateDiffInHours <= maxAgeInHours) ||
            item.status === "open"
          ) {
            return item;
          }
        });
        return article;
      });

      return asd;
    }
  },
  mounted() {
    this.loadData();
  },

  methods: {
    loadData() {
      this.isLoading = true;
      Loading.show();
      this.$mainStore.articles.load().finally(() => {
        Loading.hide();
        this.isLoading = false;
      });
    },
    boughtItem(item) {
      this.$mainStore.articles.buy(item).then(() => {
        console.log("bought item");
      });
    },
    openReactivateDialog(item) {
      this.reactivateAlert = {
        active: true,
        item: item
      };
    },
    reactivateItem(item) {
      this.$mainStore.articles.reactivate(item).then(() => {
        console.log("Reactivated: ", item);
      });
    },

    openArticles: function(article) {
      return article.items.filter(u => {
        return u.status === "open";
      }).length;
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

.wordwrap
  text-align: center;
  white-space: pre-wrap;      /* CSS3 */
  word-wrap: break-word;      /* IE */
</style>
