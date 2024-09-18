import type {DishImage} from "@/models/enhanced-menu";

export interface DishCardUiModel {
    name?: string;
    price?: string;
    description?: string;
    images: DishImage[];
    aboutDish?: string;
    dietaryLabels?: string[];
}
