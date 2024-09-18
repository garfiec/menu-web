<script setup lang="ts">
import { defineProps } from 'vue';
import DishItemCard from '../dish/DishCard.vue';
import type {MenuSectionUiModel} from "@/components/menu/section/menu-section-ui-model";
defineProps<MenuSectionUiModel>();
</script>

<template>
  <h2 class="ma-4">{{ name }}</h2>
  <v-row>
    <v-col cols="12" md="4" sm="6" v-for="dish in dishes" :key="dish.name">
      <DishItemCard
          :name="dish.name"
          :price="dish.price"
          :description="dish.description"
          :images="dish.images"
          :about-dish="dish.aboutDish"
          :dietary-labels="dish.dietaryLabels"/>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
