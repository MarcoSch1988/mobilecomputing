<template>
  <q-layout view="hHh LpR fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          aria-label="back"
          to="/"
          v-if="!['login','register', 'home'].includes($route.name)"
        />

        <q-toolbar-title>mobile computing projekt</q-toolbar-title>
        <q-btn
          flat
          dense
          round
          icon="logout"
          aria-label="logout"
          @click="logout()"
          v-if="['home'].includes($route.name)"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-primary text-white desktop-only">
      <q-toolbar>
        <q-toolbar-title
          class="text-subtitle2 q-ma-none"
        >&copy; {{ new Date().getFullYear() }} - Guppe 6</q-toolbar-title>
        <div>v0.0.1</div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { date } from "quasar";
import userStore from "../stores/userStore";

export default {
  name: "MainLayout",

  data() {
    return {};
  },
  computed: {
    currentYear() {
      console.log(Date.now().getYear());
      return Date.now().getYear();
    }
  },
  methods: {
    logout() {
      userStore.methods.logout();
    }
  }
};
</script>

<style lang="sass">
.q-drawer__content
  background-color: white
</style>
