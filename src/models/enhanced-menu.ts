import type {MenuItem} from "@/models/menu";

export type DietaryLabel = 'Spicy' | 'Gluten-free' | 'Vegan' | 'Vegetarian' | 'Keto'

export interface DishImage {
    title: string,
    link: string
}

export interface EnhancedMenuItem extends MenuItem {
    thumbnail?: DishImage;
    images?: DishImage[]; // Google images
    description?: string; // Generated description
    dietaryLabels?: DietaryLabel[]; // Inferred dietary labels

    translatedDish?: string;
    translatedMetadata?: string;
}

export interface EnhancedMenuSections {
    [section: string]: EnhancedMenuItem[];
}

export interface EnhancedMenuExtras {
    translationLanguage?: string;
}

export interface RestaurantInfo {
    name?: string;
    address?: string;
    phone?: string;
    website?: string;
    hours?: string;
    cuisine?: string;
}

export interface EnhancedMenu {
    restaurantInfo?: RestaurantInfo;
    sections: EnhancedMenuSections;
    extras?: EnhancedMenuExtras;
}
