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
          <q-item clickable v-ripple v-for="item in shoppingItems" :key="item.id">
            <q-item-section>{{item.text}}</q-item-section>
            <q-item-section top side>
              <q-btn flat round icon="delete" color="primary" @click="deleteItem(item.id)" />
            </q-item-section>
          </q-item>
        </q-list>
        <q-btn class="full-width q-mt-xl" color="primary" size="lg" label="Abschicken" />
      </div>
    </div>
  </q-page>
</template>

<script>
import userStore from "../stores/userStore";

export default {
  name: "CreateList",
  data() {
    return {
      newArticle: "",
      shoppingItems: [
        { id: 0, text: "Äpfel" },
        { id: 1, text: "Bananen" }
      ]
    };
  },
  methods: {
    addItem() {
      if (this.newArticle.length < 1) return;
      console.log(this.shoppingItems.length);
      this.shoppingItems.push({
        id: this.shoppingItems.length,
        text: this.newArticle
      });
      this.newArticle = "";
      console.log(this.shoppingItems);
    },
    deleteItem(itemId) {
      console.log(itemId);
      this.shoppingItems = this.shoppingItems.filter(obj => obj.id != itemId);
    }
  }
};
</script>
