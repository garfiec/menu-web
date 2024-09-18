import type {DishCardUiModel} from "@/components/menu/dish/dish-card-ui-model";

export interface MenuSectionUiModel {
    name: string;
    dishes: DishCardUiModel[];
}
