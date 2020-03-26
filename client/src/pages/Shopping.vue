<template>
  <q-page class="flex q-py-sm">
    <div class="row fit justify-center">
      <div class="col-xl-3 col-md-6 col-xs-12 q-px-xs q-pt-md">
        <q-list>
          <div v-for="shoppingList in shoppingLists" :key="shoppingList.id">
            <q-expansion-item>
              <template v-slot:header>
                <q-checkbox v-model="shoppingList.isSelected" />

                <q-item-section class="q-pl-lg">
                  <q-item-label>{{shoppingList.besteller}}</q-item-label>
                  <q-item-label caption>Artikelanzahl: {{shoppingList.anzahl}}</q-item-label>
                </q-item-section>
              </template>
              <q-list>
                <q-item dense v-for="item in shoppingList.items" :key="item.text">
                  <q-item-section>&nbsp;</q-item-section>
                  <q-item-section side class="text-black q-mr-md">{{item.text}}</q-item-section>
                </q-item>
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
          @click="showList()"
        />
      </div>
      <q-img src="../statics/cart.svg" class="footerback" />
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
      shoppingLists: [
        {
          id: 0,
          isSelected: false,
          besteller: "Simon Bauer-Kieslinger",
          anzahl: 2,
          items: [{ text: "1kg Äpfel" }, { text: "Kondome" }]
        },
        {
          id: 1,
          isSelected: true,
          besteller: "Julian Hanzlik",
          anzahl: 1,
          items: [
            {
              text: "Bananen"
            }
          ]
        },
        {
          id: 2,
          isSelected: false,
          besteller: "Daniel Lintschinger",
          anzahl: 2,
          items: [
            {
              text: "Brot",
              text: "Wurst"
            }
          ]
        },
        {
          id: 2,
          isSelected: false,
          besteller: "Daniel Lintschinger",
          anzahl: 2,
          items: [
            {
              text: "Brot",
              text: "Wurst"
            }
          ]
        },
        {
          id: 3,
          isSelected: false,
          besteller: "Florian Ortbauer",
          anzahl: 2,
          items: [
            {
              text: "Steak",
              text: "Zigarren"
            }
          ]
        }
      ]
    };
  },
  methods: {
    addItem() {
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
    },
    showList() {
      console.log(this.shoppingLists);
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