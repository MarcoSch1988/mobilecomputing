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
          <span>I</span>ch<span>G</span>eh<span>E</span>inkaufen
        </q-toolbar-title>

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
      title: ""
    };
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
