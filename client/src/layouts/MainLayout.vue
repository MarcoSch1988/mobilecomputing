<template>
  <q-layout view="hHh LpR fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          v-if="!['login', 'register', 'home'].includes($route.name)"
          flat
          dense
          round
          icon="arrow_back"
          aria-label="back"
          to="/"
        />

        <q-toolbar-title
          ><span>I</span
          >ch<span>G</span>eh<span>E</span>inkaufen</q-toolbar-title
        >
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
          >&copy; {{ new Date().getFullYear() }} - Guppe 6</q-toolbar-title
        >
        <div>v0.0.1</div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
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
      this.$mainStore.user.logout();
    }
  }
};
</script>

<style>
.q-toolbar__title {
  font-weight: 300;
}
span {
  font-weight: bold;
}
</style>
