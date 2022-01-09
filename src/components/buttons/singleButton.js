import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Shadow from 'react-native-drop-shadow';

import {TouchableOSSpecific} from '../links';

export default function SingleButton(props) {
    return (
        <Shadow style={[styles.buttonShadow, {shadowColor: props.theme.primaryColor, shadowOpacity: props.colorScheme == 'dark' ? 0.25 : 0.4}]}>
            <View style={styles.buttonRadius}>
                <TouchableOSSpecific onPress={props.onPress} >
                    <View style={[styles.button, {backgroundColor: props.theme.primaryColor}]}>
                        {props.content?.icon ? (<View style={{marginRight: 8}}>
                            {props.content.icon}
                        </View>) : null}
                        <View><Text style={styles.buttonText}>{props.content?.text}</Text></View>
                    </View>
                </TouchableOSSpecific>
            </View>
        </Shadow>
    )
}

const styles = StyleSheet.create({
    buttonShadow:{
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.4,
        shadowColor: "#C06A46",
        shadowRadius: 18,
        borderRadius: 1000,
        backgroundColor: 'transparent',
        overflow: 'hidden'
    },
    button:{
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 25,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonRadius:{
        borderRadius: 25,
        overflow:'hidden'
    },
    buttonText:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 16,
        color: '#FFFFFF',
    }
})
