import router from "@/routes/routes";

export async function navigateToRestaurant(restaurantId: string) {
    await router.push({name: 'RestaurantView', params: {restaurantId: restaurantId}});
}
