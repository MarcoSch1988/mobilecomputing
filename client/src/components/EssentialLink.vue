<template>
  <q-item clickable :to="locked ? '/checkout' : link">
    <!-- ToDo: href zu to ändern dann funktioniert aber das Hovern nicht mehr  -->

    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" color="primary" />
    </q-item-section>

    <q-item-section>
      <q-item-label color="primary" class="text-weight-medium">{{
        title
      }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
    <q-item-section v-if="locked" avatar color="primary">
      <q-icon name="lock" />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ""
    },

    link: {
      type: String,
      default: "#"
    },

    icon: {
      type: String,
      default: ""
    },

    locked: {
      type: Boolean,
      default: true
    }
  }
};
</script>
