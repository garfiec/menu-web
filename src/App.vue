<script setup lang="ts">
import {initializeAppSettings} from "@/utils/setting-initialization";
initializeAppSettings();
</script>

<template>
  <v-app id="app">
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>
