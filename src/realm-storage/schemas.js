// List Schemas 

class ListSchemas {
    static listSchema = {
        name: 'list',
        primaryKey: '_id',
        properties: {
            _id: 'string?',
            _partition: 'string?',
            synced: 'bool?',
            isPriceShown: 'bool?',
            isUnitShown: 'bool?',
            name: 'string?',
            items: 'list_items[]',
            categories: 'list_categories[]',
            currency: 'list_currency',
            featureImage: 'int?',
            code: 'string?',
            status: 'string?',
            ownerId: 'string?',
            dateCreated: 'date?',
            dateModified: 'date?',
            lastViewed: 'date?',
            lastActivityLog: 'string?'
        }
    }

    static listItemsSchema = {
        name: 'list_items',
        embedded: true,
        properties: {
            id: 'string?',
            category: 'string?',
            title: 'string?',
            price: 'string?',
            units: 'string?',
            unitSymbol: 'list_items_unitSymbol',
            status: 'string?',
        },
    };

    static unitSymbolSchema = {
        name: 'list_items_unitSymbol',
        embedded: true,
        properties: {
            id: 'int?',
            symbol: 'string?',
        },
    };

    static listItemsCategoriesSchema = {
        name: 'list_categories',
        embedded: true,
        properties: {
            categoryId: 'string?',
            categoryName: 'string?'
        },
    };

    static currencySchema = {
        name: 'list_currency',
        embedded: true,
        properties: {
            id: 'int?',
            symbol: 'string?',
        },
    };
}
  
export {ListSchemas};