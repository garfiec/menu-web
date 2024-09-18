import type {EnhancedMenu} from "@/models/enhanced-menu";

export interface Restaurant {
    restaurantName: string;
    menu: EnhancedMenu;
    metadata: any;
    enhancements: Partial<{ [key: string]: EnhancementStatus }>;
}

export interface EnhancementStatus {
    shouldRefresh: boolean;
    jobId: string;
}
