<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-banner
          v-if="alreadyExists"
          dense
          fit
          widht="100%"
          class="text-red text-center"
        >
          <b>Der Artikel '{{ newArticle }}' ist bereits vorhanden</b>
        </q-banner>
        <q-form>
          <q-card-section>
            <q-input
              v-model="newArticle"
              label="Artikel"
              maxlength="30"
              @input="alreadyExists = false"
              @keydown.enter.prevent
              @keydown.enter="addItem()"
            >
              <template v-slot:after>
                <q-btn
                  round
                  flat
                  icon="add_shopping_cart"
                  color="primary"
                  size="lg"
                  @click="addItem()"
                />
              </template>
            </q-input>
          </q-card-section>
        </q-form>

        <q-list>
          <q-item
            v-for="item in openArticles.slice().reverse()"
            :key="item._id"
            v-ripple
            clickable
          >
            <q-item-section>{{ item.text }}</q-item-section>
            <q-item-section top side>
              <q-btn
                flat
                round
                icon="delete"
                color="primary"
                @click="deleteItem(item._id)"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator />
        <q-expansion-item class="q-mt-md">
          <template v-slot:header>
            <q-item-section>
              <q-item-label class="text-h6 text-primary text-weight-bold"
                >Abgeschlossene Einkäufe</q-item-label
              >
            </q-item-section>
          </template>
          <q-list separator>
            <q-item
              v-for="item in closedArticles.slice().reverse()"
              :key="item._id"
              dense
            >
              <q-item-section>{{ item.text }}</q-item-section>
              <q-item-section top side class="q-mr-sm">
                {{ item.boughtAt | normalDate }}
                <br />
                {{ item.buyer.firstname }}
                {{ item.buyer.surname }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
      <q-img src="../statics/options.svg" class="footerback" />
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";

export default {
  name: "Order",
  filters: {
    normalDate: function(text) {
      return date.formatDate(new Date(text), "DD.MM.YYYY HH:mm");
    }
  },
  data() {
    return {
      newArticle: "",
      articles: this.$mainStore.articles,
      alreadyExists: false
    };
  },

  computed: {
    openArticles: function() {
      return this.articles.data.filter(u => {
        if (
          u.status === "open" &&
          u.ordererId === this.$mainStore.user.data._id
        ) {
          return u;
        }
      });
    },
    closedArticles: function() {
      return this.articles.data
        .filter(u => {
          return (
            u.status === "closed" &&
            u.ordererId === this.$mainStore.user.data._id
          );
        })
        .sort((a, b) => {
          //Berechnet die Datumsdifferenz in Sekunden
          //und sortiert anhand der Differenz das Array --> Neueste zuerst
          return date.getDateDiff(a.boughtAt, b.boughtAt, "seconds");
        });
    }
  },
  mounted() {
    //this.$mainStore.user.reAuthenticate(); //Immer zuerst aufrufen damit aktueller Benutzer geladen ist
    this.loadData();

    //Event Listener
    // this.$feathersSocket.service("articles").on("patched", () => {
    //   if (navigator.onLine) {
    //     this.$mainStore.articles.load().then(() => {
    //       this.articles = this.$mainStore.articles.data;
    //     });
    //   }
    // });
    //Event Listener
    // this.$feathersSocket.service("articles").on("created", messages => {
    //   if (navigator.onLine) {
    //     this.$mainStore.articles.load().then(() => {
    //       this.articles = this.$mainStore.articles;
    //     });
    //   }
    //   console.log("Socket-Event-Created: ", messages);
    // });
    // //Event Listener
    // this.$feathersSocket.service("articles").on("removed", () => {
    //   if (navigator.onLine) {
    //     this.$mainStore.articles.load().then(() => {
    //       this.articles = this.$mainStore.articles;
    //     });
    //   }
    // });
  },
  methods: {
    loadData() {
      // this.$mainStore.articles.load().then(() => {
      //   this.articles = this.$mainStore.articles;
      // });
      this.$mainStore.articles.load();
    },
    addItem() {
      if (this.newArticle.length < 1) return;

      this.$mainStore.articles
        .add(this.newArticle)
        .then(() => {
          this.newArticle = "";
        })
        .catch(err => {
          console.log("AddItem-Error: ", err);
          this.alreadyExists = true;
        });
    },
    async deleteItem(itemId) {
      await this.$mainStore.articles.delete(itemId);
    }
  }
};
</script>

<style lang="sass" scoped>
.footerback
  opacity: 0.20
  width: 60%
  position: absolute
  left: 10%
  z-index: -1
  bottom: 10px
  background-repeat: no-repeat
  filter: alpha(opacity=25) progid:DXImageTransform.Microsoft.Alpha(opacity=25)
</style>
