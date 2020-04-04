<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-form>
          <q-card-section>
            <q-input
              v-model="newArticle"
              label="Artikel"
              maxlength="30"
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
      articles: this.$mainStore.articles.data
    };
  },

  computed: {
    openArticles: function() {
      return this.articles.filter(u => {
        if (
          u.status === "open" &&
          u.ordererId === this.$mainStore.user.data._id
        ) {
          return u;
        }
      });
    },
    closedArticles: function() {
      return this.articles.filter(u => {
        return (
          u.status === "closed" && u.ordererId === this.$mainStore.user.data._id
        );
      });
    }
  },
  mounted() {
    this.loadData();

    //Example Own Event Listener :-)
    this.$mainStore.listener.add(this.givemepush);

    //Event Listener
    this.$feathers.service("articles").on("patched", async message => {
      console.log("locally patched", message);
      this.articles = await this.$mainStore.articles.load();
      this.$forceUpdate();
    });
  },
  methods: {
    loadData() {
      this.$mainStore.articles.load().then(() => {
        this.articles = this.$mainStore.articles.data;
      });
    },
    addItem() {
      if (this.newArticle.length < 1) return;

      const newArticle = {
        text: this.newArticle
      };
      this.$mainStore.articles.add(newArticle);
      this.newArticle = "";
    },
    async deleteItem(itemId) {
      this.articles = await this.$mainStore.articles.delete(itemId);
    },
    onlyOwnArticles: function(articles) {
      return articles.filter(article => {
        if (article.ordererId === this.$mainStore.methods.user._id) {
          return article;
        }
      });
    },
    givemepush: async function() {
      console.log("I got pushed");
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
