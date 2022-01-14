import { Dimensions } from "react-native";

export const dWidth = Dimensions.get('window').width
export const dHeight = Dimensions.get('window').height

export const realmStorePath= 'com.mbr.smartshopper.realmstore.lists'


export const asyncStores = {
    theme: 'smartShopper:appStorage:theme',
    colorScheme: 'smartShopper:appStorage:colorScheme',
    currency: 'smartShopper:appStorage:currency',
    skipOnboarding: 'smartShopper:appStorage:skipOnboarding',
    firstImportClick: 'smartShopper:appStorage:firstImportClick',
    starredLists: 'smartShopper:appStorage:starredLists',
    appOpenCount: 'smartShopper:appStorage:appOpenCount'
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

export const unitSymbols = [
    {
        id: 1,
        name: 'Pieces',
        symbol: 'pcs'
    },
    {
        id: 2,
        name: 'Units',
        symbol: 'unt'
    },
    {
        id: 3,
        name: 'Pounds',
        symbol: 'lbs'
    },
    {
        id: 4,
        name: 'Grams',
        symbol: 'g'
    },
    {
        id: 5,
        name: 'Kilograms',
        symbol: 'kg'
    },
    {
        id: 6,
        name: 'Liters',
        symbol: 'L'
    },
    {
        id: 7,
        name: 'Centiliter',
        symbol: 'cl'
    },
    {
        id: 8,
        name: 'Meters',
        symbol: 'm'
    },
    {
        id: 9,
        name: 'Centimeter',
        symbol: 'lbs'
    }
];

export const customItemId = 902;