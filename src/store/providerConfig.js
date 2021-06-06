import React from 'react'
import {Provider} from 'react-redux'

import store from './storeConfig';

export default function ProviderConfig(props, Screen) {
    return (
        <Provider store={store}>
            <Screen {...props} />
        </Provider>
    )
}
