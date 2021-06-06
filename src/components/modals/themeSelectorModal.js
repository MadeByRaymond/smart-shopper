import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Modal from 'react-native-modal'
import LinearGradient from 'react-native-linear-gradient';
import Shadow from 'react-native-drop-shadow';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {theme} from '../uiComponents'
import {OpacityLinks} from '../links'
import CheckedIcon from '../../vectors/checkIcon/checkedIcon'

// Includes 
import {asyncStores} from '../../includes/variables'

export function ThemeSelectorModal(props) {

    const [activeTheme, setActiveTheme] = useState(props.activeThemeName)

    let themeSelectors = [];
    for (const key in theme) {
        if (Object.hasOwnProperty.call(theme, key)) {
            themeSelectors.push({...theme[key], theme: key})  
        }
    }

    return (
        <Modal
            isVisible = {props.activeState}
            // hideModalContentWhileAnimating={true}
            swipeDirection={['up','down']}
            animationIn= {'slideInUp'}
            animationInTiming={1}
            animationOut= {'slideOutDown'}
            animationOutTiming={500}
            backdropOpacity={0.05}
            onBackButtonPress= {props.closeFunction}
            onBackdropPress= {props.closeFunction}
            onSwipeComplete= {props.closeFunction}
            style={{margin: 0}}
        >
            <Shadow style={styles.themeSelectorsShadow}>
                <View style={[styles.themeSelectorsWrapper, {backgroundColor: props.colorScheme.modalBackground}]}>
                    {themeSelectors.map((item, i) => (<OpacityLinks key={i} onPress={() => {
                        setActiveTheme(item.theme);
                        props.setTheme(item.theme)
                        AsyncStorage.setItem(asyncStores.theme, item.theme, (e)=>{/* Do Nothing */});
                    }}>
                        <LinearGradient style={styles.themeSelector} colors={[item.gradientColors[0],item.gradientColors[1],item.gradientColors[0]]}>
                            {activeTheme == item.theme ? <View style={styles.themeSelectorCheckedIcon}><CheckedIcon checkedStatus={true} theme={item}  /></View> : null}
                        </LinearGradient>
                    </OpacityLinks>))}
                </View>
            </Shadow>
        </Modal>
    )
}

const styles = StyleSheet.create({
    themeSelectorsShadow:{
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.19,
        shadowColor: "#000000",
        shadowRadius: 18,
        borderRadius: 12,
        backgroundColor: 'transparent',

        position: 'absolute',
        bottom: 26,
        left: 26,
        right: 26,
    },
    themeSelectorsWrapper:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',

        paddingHorizontal: 10,
        paddingVertical: 25,
        borderRadius: 12,

        backgroundColor: '#fff',


    },
    themeSelector:{
        height: 50,
        width: 50,
        borderRadius: 10000,
    },

    themeSelectorCheckedIcon:{
        position: 'absolute',
        bottom: -5,
        right: -3
    }
})
