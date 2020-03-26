<template>
  <q-layout view="hHh LpR fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>mobile computing projekt</q-toolbar-title>
        <q-btn flat dense round icon="logout" aria-label="logout" @click="logout()" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" class="show-if-above bordered" content-class="bg-voestgrey">
      <q-list>
        <q-item-label header class="text-grey-8">Essential Links</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        <q-item-label header class="text-grey-8">Sonstiges</q-item-label>
        <EssentialLink title="Login" icon="person" link="/Login" v-bind:locked="false" />
        <EssentialLink title="Register" icon="person_add" link="/Register" v-bind:locked="false" />
      </q-list>
    </q-drawer>

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
import EssentialLink from "components/EssentialLink";
import userStore from "../stores/userStore";

export default {
  name: "MainLayout",

  components: {
    EssentialLink
  },

  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: "Docs",
          caption: "quasar.dev",
          icon: "school",
          link: "https://quasar.dev",
          locked: false
        },
        {
          title: "Github",
          caption: "github.com/quasarframework",
          icon: "code",
          link: "https://github.com/quasarframework",
          locked: false
        },
        {
          title: "Discord Chat Channel",
          caption: "chat.quasar.dev",
          icon: "chat",
          link: "https://chat.quasar.dev",
          locked: true
        },
        {
          title: "Forum",
          caption: "forum.quasar.dev",
          icon: "record_voice_over",
          link: "https://forum.quasar.dev",
          locked: true
        },
        {
          title: "Twitter",
          caption: "@quasarframework",
          icon: "rss_feed",
          link: "https://twitter.quasar.dev",
          locked: true
        },
        {
          title: "Facebook",
          caption: "@QuasarFramework",
          icon: "public",
          link: "https://facebook.quasar.dev",
          locked: true
        }
      ]
    };
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
