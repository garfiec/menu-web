export type DietaryLabelMappingType = {
    [key: string]: {
        label: string;
        icon: string;
        color: string;
    };
};

export const dietaryLabelMapping: DietaryLabelMappingType = {
    'Spicy': {
        label: 'Spicy',
        icon: 'mdi-chili-mild',
        color: 'red'
    },
    'Gluten-free': {
        label: 'Gluten-free',
        icon: 'mdi-barley-off',
        color: 'brown'
    },
    'Vegan': {
        label: 'Vegan',
        icon: 'mdi-leaf',
        color: 'green'
    },
    'Vegetarian': {
        label: 'Vegetarian',
        icon: 'mdi-sprout',
        color: 'green'
    },
    'Keto': {
        label: 'Keto',
        icon: 'mdi-food-drumstick',
        color: 'orange'
    },
    'Pescatarian': {
        label: 'Pescatarian',
        icon: 'mdi-fish',
        color: 'blue'
    },
    'Dairy-free': {
        label: 'Dairy-free',
        icon: 'mdi-cow-off',
        color: 'black'
    }
};
