<template>
  <q-page class="flex q-py-sm">
    <q-dialog v-model="dialogOffline" position="top" full-width>
      <q-banner inline-actions class="text-white bg-red">
        Im Offline-Modus nicht möglich
      </q-banner>
    </q-dialog>
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
          <q-expansion-item
            v-for="article in articlesWithoutOld"
            :key="article.id"
            expand-separator
          >
            <template v-slot:header>
              <q-item-section>
                <span class="text-h6 text-primary">
                  {{ article.name }}
                </span>
                <q-item-label caption>
                  {{ article.address.street }} -
                  {{ article.address.distance }} m
                </q-item-label>
              </q-item-section>
              <q-item-section side top class="text-caption">
                {{ openArticles(article) }} / {{ article.items.length }}
              </q-item-section>
            </template>

            <q-list>
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
          </q-expansion-item>
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
      dialogOffline: false,
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
      //Item kaufen
      //--> Offline --> Benutzer benachrichtigen und nach 1 Sekunde ausblenden

      if (navigator.onLine == false) {
        //--> Offline --> Benutzer benachrichtigen und nach 1 Sekunde ausblenden
        this.showOfflineNotification();
      } else {
        this.$mainStore.articles.buy(item);
      }
    },
    openReactivateDialog(item) {
      //Reaktivieren des Items
      //Nur möglich wenn Online
      if (navigator.onLine == false) {
        //--> Offline --> Benutzer benachrichtigen und nach 1 Sekunde ausblenden
        this.showOfflineNotification();
      } else {
        this.reactivateAlert = {
          active: true,
          item: item
        };
      }
    },
    reactivateItem(item) {
      this.$mainStore.articles.reactivate(item).then(() => {
        console.log("Reactivated: ", item);
      });
    },
    showOfflineNotification() {
      this.dialogOffline = true;
      setTimeout(() => {
        this.dialogOffline = false;
      }, 1000);
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
