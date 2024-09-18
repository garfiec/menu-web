<script setup lang="ts">

import {useRestaurantMenuStore} from "@/store/restaurant-menu-store";
import {storeToRefs} from "pinia";
import MenuSection from "@/components/menu/section/MenuSection.vue";
import {onMounted, watch} from "vue";
import {useRoute} from "vue-router";
import AppBarNavigation from "@/components/layout/AppBarNavigation.vue";
import {
  ENHANCEMENT_TYPE_WITH_CUISINE, ENHANCEMENT_TYPE_WITH_DESCRIPTIONS, ENHANCEMENT_TYPE_WITH_DIETARY_LABELS,
  ENHANCEMENT_TYPE_WITH_IMAGES,
  ENHANCEMENT_TYPE_WITH_TRANSLATIONS
} from "@/utils/constants";

const route = useRoute();

const store = useRestaurantMenuStore();
const {
  restaurantId,
  restaurantName,
  menuSections,
  isLoadingEnhancements,
  enhancementLoadingDescription,
  enhancementLoadingIcon,
  enhancementLoadingProgress,
  enhancementSpeedDialDisabled
} = storeToRefs(store);

// Update to new restaurant menu when page is loaded
onMounted(() => {
  if (typeof route.params.restaurantId === 'string') {
    restaurantId.value = route.params.restaurantId;
    store.init(route.params.restaurantId)
  }
})

// Update to new restaurant menu when on the same route
watch(() => route.params.restaurantId, () => {
  if (typeof route.params.restaurantId === 'string') {
    restaurantId.value = route.params.restaurantId;
    store.init(route.params.restaurantId)
  }
}, {deep: true});

const buttonConfigs = [
  { key: 1, icon: "mdi-translate", tooltip: "Add Translations", action: () => store.addEnhancement(ENHANCEMENT_TYPE_WITH_TRANSLATIONS) },
  { key: 2, icon: "mdi-earth", tooltip: "Infer Cuisine", action: () => store.addEnhancement(ENHANCEMENT_TYPE_WITH_CUISINE) },
  { key: 3, icon: "mdi-image", tooltip: "Add Images", action: () => store.addEnhancement(ENHANCEMENT_TYPE_WITH_IMAGES) },
  { key: 4, icon: "mdi-pen", tooltip: "Generate Descriptions", action: () => store.addEnhancement(ENHANCEMENT_TYPE_WITH_DESCRIPTIONS) },
  { key: 5, icon: "mdi-format-list-checks", tooltip: "Infer Dietary Labels", action: () => store.addEnhancement(ENHANCEMENT_TYPE_WITH_DIETARY_LABELS) }
];
</script>

<template>
  <AppBarNavigation :title="restaurantName">
  </AppBarNavigation>

  <transition name="slide-y-transition">
    <v-alert
        v-if="isLoadingEnhancements"
        border="start"
        border-color="deep-purple accent-4"
        :text="enhancementLoadingDescription"
        :icon="enhancementLoadingIcon">
      <template v-slot:append>
        <v-spacer></v-spacer>
        <v-progress-circular :model-value="enhancementLoadingProgress" color="deep-purple accent-4"/>
      </template>
    </v-alert>
  </transition>

  <MenuSection v-for="section in menuSections"
               :key="section.name"
               :name="section.name"
               :dishes="section.dishes"/>

  <v-speed-dial location="top right" transition="slide-y-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-fab
          v-bind="activatorProps"
          color="deep-purple"
          location="bottom end"
          size="large"
          icon="mdi-lightning-bolt"
          class="mb-4"
          :disabled="enhancementSpeedDialDisabled"
          fixed
          app></v-fab>
    </template>

    <v-tooltip v-for="config in buttonConfigs" :key="config.key" :text="config.tooltip">
      <template v-slot:activator="{ props }">
        <v-btn
            v-bind="props"
            size="large"
            color="deep-purple-lighten-5"
            :icon="config.icon"
            @click="config.action"
            :disabled="enhancementSpeedDialDisabled"
        ></v-btn>
      </template>
    </v-tooltip>
  </v-speed-dial>
</template>

<style scoped>

</style>