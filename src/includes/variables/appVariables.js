import { Dimensions } from "react-native";

export const dWidth = Dimensions.get('window').width
export const dHeight = Dimensions.get('window').height


export const asyncStores = {
    theme: 'smartShopper:appStorage:theme',
    colorScheme: 'smartShopper:appStorage:colorScheme',
    currency: 'smartShopper:appStorage:currency',
    skipOnboarding: 'smartShopper:appStorage:skipOnboarding'
}

export const displayModes = [
    {
        type: 'light',
        name: 'Light'
    },
    {
        type: 'dark',
        name: 'Dark'
    },
    {
        type: 'system',
        name: 'System Default'
    }
]

export const currencies = [
    {
        id: 1,
        name: 'Dollars',
        code: 'USD',
        symbol: '$'
    },
    {
        id: 2,
        name: 'Euros',
        code: 'EUR',
        symbol: '€'
    },
    {
        id: 3,
        name: 'Pounds',
        code: 'GBP',
        symbol: '£'
    },
    {
        id: 4,
        name: 'Yuan, Yen',
        code: 'CNY, JPY',
        symbol: '¥'
    },
    {
        id: 5,
        name: 'Rupee',
        code: 'INR',
        symbol: '₹'
    },
    {
        id: 6,
        name: 'Naira',
        code: 'NGN',
        symbol: '₦'
    }
];

export const customCurrencyId = 902;