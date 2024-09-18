<script setup lang="ts">
import type {DishCardUiModel} from "@/components/menu/dish/dish-card-ui-model";
import {computed, ref} from "vue";
import {dietaryLabelMapping} from "@/components/menu/dish/dietary-label-mapping";
import DietaryLabels from "@/components/menu/dietary-labels/DietaryLabels.vue";

const props = defineProps<DishCardUiModel>();
const show = ref(false);
const DESCRIPTION_LIMIT = 80;

function toggleShow() {
  show.value = !show.value;
}

const thumbnailUrl = computed(() => {
  return props.images && props.images.length > 0 ? props.images[0].link : null;
});

const truncatedDescription = computed(() => {
  if (!show.value) {
    return props.description && props.description.length > DESCRIPTION_LIMIT
        ? props.description.slice(0, DESCRIPTION_LIMIT) + '...'
        : props.description;
  }
  return props.description;
});

const dietaryLabelsInfo = computed(() => {
  return props.dietaryLabels?.map(label => ({
    ...dietaryLabelMapping[label],
    label
  })) ?? [];
});

const hasGeneratedDetails = computed(() => {
  const hasAboutDish = props.aboutDish !== undefined;
  const hasDietaryLabels = !!props.dietaryLabels && props.dietaryLabels.length > 0;
  return hasAboutDish || hasDietaryLabels;
});
</script>

<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
        variant="elevated"
        class="rounded-xl"
        :class="{ 'on-hover': isHovering }"
        v-bind="props"
        :elevation="isHovering ? 16 : 2"
        fluid>
      <v-carousel
          v-if="show && thumbnailUrl"
          height="200px"
          hide-delimiter-background>
        <v-carousel-item
            cover
            v-for="(image, index) in images"
            :key="index"
            :src="image.link"></v-carousel-item>
      </v-carousel>
      <div @click="toggleShow" v-ripple>
        <div class="d-flex flex-no-wrap justify-space-between" :class="{ 'fixed-height': !show }">
          <v-card-text>
            <h3><b>{{ name }}</b></h3>
            <div class="mb-2" v-if="description">{{ truncatedDescription }}</div>
            <div class="d-flex">
              <span v-if="price" class="me-2"><b>{{ price }}</b></span>
              <DietaryLabels v-if="dietaryLabels && !show" :dietaryLabelsInfo="dietaryLabelsInfo" label-size="x-small" compact />
            </div>
          </v-card-text>
          <v-avatar
              v-if="!show && thumbnailUrl"
              rounded="0"
              size="150">
            <v-img :src="thumbnailUrl"></v-img>
          </v-avatar>
        </div>
        <v-expand-transition>
          <div v-if="hasGeneratedDetails" v-show="show">
            <v-divider></v-divider>
            <v-card-text>
              <div class="d-flex align-center pb-3">
                <v-icon color="grey">mdi-information</v-icon><span> The following details are AI generated</span>
              </div>
              <div class="ps-2">
                <div v-if="aboutDish"><i>{{aboutDish}}</i><br><br></div>
                <DietaryLabels v-if="dietaryLabels" :dietaryLabelsInfo="dietaryLabelsInfo"/>
              </div>
            </v-card-text>
          </div>
        </v-expand-transition>
      </div>
    </v-card>
  </v-hover>

</template>

<style scoped>
.fixed-height {
  height: 150px;
}
</style>