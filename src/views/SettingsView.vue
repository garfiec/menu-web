<script setup lang="ts">
import AppBarNavigation from "@/components/layout/AppBarNavigation.vue";
import {loadUser} from "@/utils/auth";
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/store/settings-store";
import {OCR_LANGUAGES, SUPPORTED_TRANSLATION_LANGUAGES} from "@/utils/constants";

loadUser();

const store = useSettingsStore();
const {
  menuApiKey,
  apiKeyIcon,
  apiKeyIconColor,
  selectedOcrLanguages,
  selectedEnhancements,
  selectedLanguage,
  showSettingsClearedSnackbar
} = storeToRefs(store);
store.init();
</script>

<template>
  <AppBarNavigation show-username></AppBarNavigation>
  <v-container class="d-flex justify-center align-center">
    <v-card title="Settings" class="main-container">
      <v-container class="pa-4">
        <v-col>
          <h3>API Key</h3>
          <v-text-field
              v-model="menuApiKey"
              label="API Key"
              clearable
              outlined
              dense
              @update:modelValue="store.onMenuApiKeyChanged">
            <template v-slot:append-inner>
              <v-icon
                  :icon="apiKeyIcon"
                  :color="apiKeyIconColor"></v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-divider></v-divider>
        <v-col>
          <h3>Menu Creation</h3>
          <v-combobox
              v-model="selectedOcrLanguages"
              chips
              multiple
              label="OCR Languages"
              :items="OCR_LANGUAGES"
              :return-object="false"
              :rules="[value => Object.values(value).every(lang => OCR_LANGUAGES.some(item => item.code === lang)) || 'Invalid selection']"
              item-title="name"
              item-value="code"
              @update:modelValue="store.onSelectedOcrLanguagesChanged">
          </v-combobox>
        </v-col>
        <v-col>
          <h3>Enhancements</h3>
          <v-checkbox
              class="shrink mb-n8"
              v-model="selectedEnhancements"
              label="With Translations"
              value="with-translations"
              dense
              @update:modelValue="store.onSelectedEnhancementsChanged">
          </v-checkbox>
          <v-select
              v-model="selectedLanguage"
              class="ms-4"
              dense
              label="Translation Language"
              :items="SUPPORTED_TRANSLATION_LANGUAGES"
              @update:modelValue="store.onSelectedLanguageChanged">
          </v-select>
          <v-checkbox
              class="shrink mb-n8"
              v-model="selectedEnhancements"
              label="With Cuisine"
              value="with-cuisine"
              dense
              @update:modelValue="store.onSelectedEnhancementsChanged">
          </v-checkbox>
          <v-checkbox
              class="shrink mb-n8"
              v-model="selectedEnhancements"
              label="With Images"
              value="with-images"
              dense
              @update:modelValue="store.onSelectedEnhancementsChanged">
          </v-checkbox>
          <v-checkbox
              class="shrink mb-n8"
              v-model="selectedEnhancements"
              label="With Descriptions"
              value="with-descriptions"
              dense
              @update:modelValue="store.onSelectedEnhancementsChanged">
          </v-checkbox>
          <v-checkbox
              class="shrink mb-n8"
              v-model="selectedEnhancements"
              label="With Dietary Labels"
              value="with-dietary-labels"
              dense
              @update:modelValue="store.onSelectedEnhancementsChanged">
          </v-checkbox>
        </v-col>
        <v-divider></v-divider>
        <v-col>
          <h3>Delete all existing menus</h3>
          <p>If you are running into issues/crashes, clear the storage with the button below.</p>
          <v-btn
              class="ma-4"
              color="primary"
              @click="store.clearStorage()">Clear Storage
          </v-btn>
        </v-col>
      </v-container>
    </v-card>
    <v-snackbar v-model="showSettingsClearedSnackbar">Storage cleared!</v-snackbar>
  </v-container>
</template>

<style scoped>

</style>