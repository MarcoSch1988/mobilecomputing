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
        v-for="syncProblem in syncProblems"
        :key="syncProblem.id"
        dense
        inline-actions
        class="text-white bg-red q-mb-xs"
      >
        {{ syncProblem.text }}
        <template v-slot:action>
          <q-btn
            flat
            color="white"
            icon="close"
            @click="deleteSyncProblem(syncProblem.id)"
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
      syncProblems: []
    };
  },
  mounted() {
    window.addEventListener("online", () => {
      this.online = navigator.onLine;
      this.dialogOffline = false;
      setTimeout(() => {
        //Wir müssen ein wenig warten bis die Queue abgearbeitet wurde
        //TODO
        //Ändern auf asynchrone Funktion --> mit Mitteilung wenn response queue fertig ist
        //FeathersQueue muss bereitschaft melden --> erst dann response-Queue anzeigen
        this.$mainStore.articles.getSyncProblems().then(result => {
          this.syncProblems = result;
          if (result.length > 0) {
            this.dialogSyncProblems = true;
          }
        });
      }, 1000);
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
    deleteSyncProblem(id) {
      //Lokal entfernen
      this.syncProblems = this.syncProblems.filter(problem => {
        console.log("Delete", "ID=" + id + " Array-ID=" + problem.id);
        return problem.id != id;
      });
      if (this.syncProblems.length < 1) {
        this.dialogSyncProblems = false;
      }

      //In der Datenbank entfernen
      this.$mainStore.articles.deleteSyncProblem(id);
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
</style>
