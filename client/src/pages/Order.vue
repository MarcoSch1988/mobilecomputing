<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs">
        <q-form>
          <q-card-section>
            <q-input v-model="newArticle" label="Artikel">
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
          <q-item clickable v-ripple v-for="item in articles" :key="item._id">
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
        <q-btn
          class="full-width q-mt-xl"
          color="primary"
          size="lg"
          label="Abschicken"
          @click="test()"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import userStore from "../stores/userStore";

export default {
  name: "Order",
  data() {
    return {
      newArticle: "",
      articles: []
    };
  },
  mounted() {
    this.loadItems();
  },
  methods: {
    test() {
      console.log(this.articles);
    },
    loadItems() {
      this.$feathers
        .service("articles")
        .find({ query: { status: "open" } })
        .then(result => {
          this.articles = result.data;
        });
    },
    addItem() {
      if (this.newArticle.length < 1) return;

      const newArticle = {
        ordererId: "5e7de53f0a5418525482e03e",
        text: this.newArticle
      };
      console.log("New Article - before: ", newArticle);
      this.$feathers
        .service("articles")
        .create(newArticle)
        .then(result => {
          this.articles.push(result);
          this.newArticle = "";
          console.log("New Article - created: ", result);
        })
        .catch(err => {
          console.log("New Article - error: ", err);
        });
    },
    deleteItem(itemId) {
      this.$feathers
        .service("articles")
        .remove(itemId)
        .then(result => {
          this.articles = this.articles.filter(obj => obj._id != itemId);
        })
        .catch(err => {
          console.log("Delete Article - error: ", err);
        });
    }
  }
};
</script>
