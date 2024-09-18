<script setup lang="ts">

import {computed, onMounted, onUnmounted, ref} from "vue";
import {LOCAL_STORAGE_RESTAURANTS_CATALOG, MENU_APP_NAME} from "@/utils/constants";
import router from "@/routes/routes";
import type {AppBarNavigationUiModel} from "@/components/layout/app-bar-navigation-ui-model";

const props = defineProps<AppBarNavigationUiModel>();

const drawer = ref(false)

const username = ref('');
const restaurantsList = ref<any[]>([]);

const updateRestaurantsList = () => {
  const restaurantsString = localStorage.getItem(LOCAL_STORAGE_RESTAURANTS_CATALOG);
  if (restaurantsString) {
    const restaurantMap = JSON.parse(restaurantsString);
    restaurantsList.value = Object.values(restaurantMap).reverse();
  }
};

const updateUsername = () => {
  const user = localStorage.getItem('username');
  if (user) {
    username.value = `Welcome ${user}!`;
  }
};

function onStorageUpdated() {
  updateUsername();
  updateRestaurantsList();
}

router.beforeEach((to, from, next) => {
  onStorageUpdated();
  next();
});

onMounted(() => {
  window.addEventListener('storage', onStorageUpdated);
  onStorageUpdated();
});

onUnmounted(() => {
  window.removeEventListener('storage', onStorageUpdated);
});

// use name from props if provided, otherwise use default. Default is MENU_APP_NAME
const titleText = computed(() => props.title ? props.title : MENU_APP_NAME);
const appBarDensity = computed(() => props.appBarDensity ? props.appBarDensity : 'default');
</script>
<template>
  <v-app-bar
      :elevation="2"
      :density="appBarDensity"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>{{ titleText }}</v-app-bar-title>
    <div v-if="showUsername">
      <v-spacer></v-spacer>
      <h3 class="pe-4">{{username}}</h3>
    </div>
  </v-app-bar>

  <v-navigation-drawer id="hamburger-menu-container" v-model="drawer" temporary>
    <v-list>
      <v-list-item :to="{ name: 'CreateMenuView' }" link
                   subtitle=""
                   title="Create New Menu"
      ></v-list-item>
      <v-list-item :to="{ name: 'SettingsView' }" title="Settings"></v-list-item>
      <br>
      <v-list-item title="Restaurants" subtitle="" append-icon="mdi-silverware-fork-knife"></v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="restaurant in restaurantsList"
                   :key="restaurant.restaurantId"
                   :title="restaurant.restaurantName"
                   :to="{ name: 'RestaurantView', params: { restaurantId: restaurant.restaurantId } }"
                   link>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>