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
                  <q-item-label caption>Artikelanzahl: {{ article.count }}</q-item-label>
                </q-item-section>
              </template>
              <q-list>
                <q-item dense v-for="item in article.items" :key="item._id">
                  <q-item-section>&nbsp;</q-item-section>
                  <q-item-section side class="text-black q-mr-md">
                    {{
                    item.text
                    }}
                  </q-item-section>
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
          @click="loadItems()"
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
      articles: [],
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
          id: 4,
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
  mounted() {
    this.loadItems();
  },
  methods: {
    loadItems() {
      this.$feathers
        .service("articles")
        .find({ query: { status: "open" } })
        .then(result => {
          this.articles = this.arraymap(result.data);
          console.log(this.articles);
        });
    },
    arraymap(myarray) {
      let arraymap = {};
      myarray.map(x => {
        if (arraymap[x.ordererId] == undefined) {
          //Noch nicht enthalten
          arraymap[x.ordererId] = {
            name: x.orderer.firstname + " " + x.orderer.surname,
            id: x.ordererId,
            isSelected: false,
            count: 0,
            items: []
          };
        }
        //Daten einfügen
        arraymap[x.ordererId].count++;
        arraymap[x.ordererId].items.push(x);
      });

      return arraymap;
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
