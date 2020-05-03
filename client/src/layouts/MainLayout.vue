<template>
  <q-layout view="hHh LpR fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          v-if="$route.meta.backRoute"
          flat
          dense
          round
          icon="arrow_back"
          aria-label="back"
          :to="$route.meta.backRoute"
        />

        <q-toolbar-title v-if="title != ''">
          {{ title }}
        </q-toolbar-title>
        <q-toolbar-title v-if="title === ''" class="titleclass">
          IchGehEinkaufen
        </q-toolbar-title>

        <q-btn
          v-if="online === false"
          flat
          dense
          round
          class="text-red"
          icon="warning"
          @click="dialogOffline = !dialogOffline"
        />

        <q-btn
          v-if="['home'].includes($route.name)"
          flat
          dense
          round
          icon="logout"
          aria-label="logout"
          @click="logout()"
        />
      </q-toolbar>
    </q-header>

    <q-dialog v-model="dialogOffline" position="top" full-width>
      <q-banner inline-actions class="text-white bg-red">
        Sie haben keine Internetverbindung. Die App ist offline.
      </q-banner>
    </q-dialog>
    <q-dialog v-model="dialogSyncProblems" position="top" full-width>
      <q-banner
        v-for="response in queue.responses"
        :key="response.id"
        dense
        inline-actions
        class="text-white bg-red q-mb-xs"
      >
        {{ response.text }}
        <template v-slot:action>
          <q-btn
            flat
            color="white"
            icon="close"
            @click="deleteResponse(response.id)"
          />
        </template>
      </q-banner>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-primary text-white desktop-only">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2 q-ma-none"
          >&copy; {{ new Date().getFullYear() }} - Guppe 6
        </q-toolbar-title>
        <div>v0.0.1</div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {
      title: "",
      online: navigator.onLine,
      dialogOffline: false,
      dialogSyncProblems: false,
      queue: this.$mainStore.queue,
      articles: this.$mainStore.articles
    };
  },
  mounted() {
    window.addEventListener("online", () => {
      this.online = navigator.onLine;
      this.dialogOffline = false;
      if (this.queue.responses.length > 0) {
        this.dialogSyncProblems = true;
      }
    });
    window.addEventListener("offline", () => {
      this.online = navigator.onLine;
      this.dialogOffline = true;
    });
  },

  computed: {
    currentYear() {
      console.log(Date.now().getYear());
      return Date.now().getYear();
    }
  },
  watch: {
    $route(to) {
      this.title = to.meta.title || "";
    }
  },

  methods: {
    logout() {
      this.$mainStore.user.logout();
    },
    deleteResponse(id) {
      //Lokal entfernen
      // this.syncProblems = this.syncProblems.filter(problem => {
      //   console.log("Delete", "ID=" + id + " Array-ID=" + problem.id);
      //   return problem.id != id;
      // });
      //In der Datenbank entfernen

      this.$mainStore.queue.deleteResponse(id);
      setTimeout(() => {
        if (this.queue.responses.length < 1) {
          this.dialogSyncProblems = false;
        }
      }, 300);
    }
  }
};
</script>

<style>
.titleclass {
  font-weight: 300;
}
.titleclass span {
  font-weight: bold;
}
#overlay {
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
}
</style>
