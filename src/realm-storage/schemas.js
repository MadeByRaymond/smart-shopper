// List Schemas 

class ListSchemas {
    static listSchema = {
        name: 'list',
        primaryKey: '_id',
        properties: {
            _id: 'string?',
            _partition: 'string?',
            synced: 'bool?',
            name: 'string?',
            items: 'listItems[]',
            categories: 'listItemsCategories[]',
            currency: 'currency',
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
        name: 'listItems',
        embedded: true,
        properties: {
            id: 'string?',
            category: 'string?',
            title: 'string?',
            price: 'string?',
            units: 'string?',
            unitSymbol: 'unitSymbol',
            status: 'string?',
        },
    };

    static unitSymbolSchema = {
        name: 'unitSymbol',
        embedded: true,
        properties: {
            id: 'int?',
            symbol: 'string?',
        },
    };

    static listItemsCategoriesSchema = {
        name: 'listItemsCategories',
        embedded: true,
        properties: {
            categoryId: 'string?',
            categoryName: 'string?'
        },
    };

    static currencySchema = {
        name: 'currency',
        embedded: true,
        properties: {
            id: 'int?',
            symbol: 'string?',
        },
    };
}
  
export {ListSchemas};