<script setup lang="ts">

import {useCreateMenuModalStore} from "@/store/create-menu-modal-store";
import {storeToRefs} from "pinia";
import AppBarNavigation from "@/components/layout/AppBarNavigation.vue";
import {requireLogin} from "@/utils/auth";
import {computed} from "vue";

requireLogin();

const store = useCreateMenuModalStore();
const {
  tab,
  restaurantNameInput,
  restaurantNameInputIcon,
  cuisineInput,
  urlInput,
  urlInputIcon,
  filesInput,
  textInput,
  isLoading,
  loadingProgress,
  shouldShowSnackbar,
  snackbarText
} = storeToRefs(store);

const isIndeterminate = computed(() => loadingProgress.value === 0);
const progressColor = computed(() => isIndeterminate.value ? 'grey-lighten-1' : 'primary');
</script>

<template>
  <AppBarNavigation show-username></AppBarNavigation>
  <v-snackbar v-model="shouldShowSnackbar">{{snackbarText}}</v-snackbar>
  <v-container class="d-flex justify-center align-center">
    <v-card title="Create Menu" class="main-container">
      <v-container>
        <v-text-field
            label="Restaurant Name (Required)"
            v-model="restaurantNameInput"
            :disabled="isLoading"
            @input="store.handleRestaurantInputChange"
            placeholder="Enter restaurant name">
          <template v-slot:append-inner>
            <v-icon
                :icon="restaurantNameInputIcon"
                color="error"></v-icon>
          </template>
        </v-text-field>

        <v-text-field
            label="Cuisine (Optional)"
            v-model="cuisineInput"
            :disabled="isLoading"
            placeholder="Korean"></v-text-field>

        <v-tabs v-model="tab" :disabled="isLoading">
          <v-tab value="url">URL</v-tab>
          <v-tab value="upload">Upload</v-tab>
          <v-tab value="text">Text</v-tab>
        </v-tabs>

        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="url">
              <p>Paste the link to a menu on a website, a pdf link, or image.</p>
              <v-text-field
                  label="Url"
                  v-model="urlInput"
                  :disabled="isLoading"
                  :append-icon="urlInputIcon"
                  placeholder="https://example.com"></v-text-field>
            </v-tabs-window-item>
            <v-tabs-window-item value="upload">
              <p>Select files to upload to create a menu from. Supported types are images and pdf.</p>
              <v-file-input
                  label="Upload"
                  v-model="filesInput"
                  multiple
                  :disabled="isLoading"
                  placeholder="Upload a file"></v-file-input>
            </v-tabs-window-item>
            <v-tabs-window-item value="text">
              <p>Paste the menu text below.</p>
              <v-textarea
                  label="Text"
                  v-model="textInput"
                  :disabled="isLoading"
                  rows="6"
                  auto-grow
                  placeholder="Al Pastor Tacos $3"></v-textarea>
            </v-tabs-window-item>
          </v-tabs-window>
          <p v-if="isLoading" class="mt-4">
            Generating menu from resource. This can take a few minutes...
          </p>
        </v-card-text>

        <v-btn color="primary" :disabled="isLoading" @click="store.createMenu()">Create Menu</v-btn>
      </v-container>


      <v-progress-linear
          v-if="isLoading"
          :model-value="loadingProgress"
          :color="progressColor"
          :indeterminate="isIndeterminate">
      </v-progress-linear>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>