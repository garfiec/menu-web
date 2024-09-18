<script setup lang="ts">
import {computed, defineProps} from 'vue';

interface DietaryLabelInfo {
  label: string;
  color: string;
  icon: string;
}

const props = withDefaults(defineProps<{
  labelSize: string;
  dietaryLabelsInfo: DietaryLabelInfo[];
  compact: boolean;
}>(), {
  labelSize: 'default',
  compact: false
});

const showLabel = computed(() => (isHovering: boolean | null) => {
  return props.compact ? isHovering : true;
});
</script>

<template>
  <div style="display: flex; flex-wrap: wrap;">
    <div v-for="labelInfo in dietaryLabelsInfo" :key="labelInfo.label">
        <v-hover v-slot:default="{ isHovering, props }">
          <v-chip v-bind="props" :color="labelInfo.color" :size="labelSize" class="me-2 mb-1">
            <v-icon :color="labelInfo.color">{{ labelInfo.icon }}</v-icon>
              <v-slide-x-transition>
                <template v-if="showLabel(isHovering)">
                  <span>{{ labelInfo.label }}</span>
                </template>
              </v-slide-x-transition>
          </v-chip>
        </v-hover>
    </div>
  </div>
</template>

<style scoped>

</style>