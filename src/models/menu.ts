export interface MenuItem {
    dish: string;
    price: string;
    metadata: string;
}

export interface Menu {
    [section: string]: MenuItem[];
}
