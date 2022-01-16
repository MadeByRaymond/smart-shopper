import React from 'react'
import { Platform, TouchableOpacity, TouchableNativeFeedback } from 'react-native'

export const OpacityLinks = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.5} {...props} delayLongPress={200} >
            {props.children}
        </TouchableOpacity>
    )
}

export const TouchableOSSpecific = (props) =>{
    let Touchable = Platform.OS == 'android' ? TouchableNativeFeedback : TouchableOpacity
    return (
        <Touchable activeOpacity={0.5} {...props}>
            {props.children}
        </Touchable>
    )
}
