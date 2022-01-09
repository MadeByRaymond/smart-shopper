import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';

import CreditIcon from '../../vectors/creditIcon'
import {colorScheme} from '../../components/uiComponents'
import store from '../../store/storeConfig'
import {mainRoot} from '../../../App'

import {updateComponentAppearance} from '../../includes/functions';
import { Navigation } from 'react-native-navigation';

export default function spalshScreen(props) {
    let activeColorScheme = store.getState().ui.colorScheme;
    updateComponentAppearance({
        ...props,
        colorScheme : activeColorScheme
    });

    return (
        <View style={[styles.splashScreenContainer, {backgroundColor: colorScheme[activeColorScheme == 'dark' ? 'dark' : 'light'].background }]}>
            <LottieView 
                source={require('../../assets/lottie/lf30_editor_hfam1tlq.json')} 
                autoPlay 
                loop = {false}
                style={styles.splashScreenAnimation}
                speed={1.35}
                onAnimationFinish={()=>{
                    setTimeout(()=>{
                        Navigation.setRoot(mainRoot)
                    }, 400)
                }}
            />

            <View style={styles.creditWrapper}>
                <CreditIcon colorScheme={activeColorScheme} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    splashScreenContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',

        backgroundColor: '#021032'
    },
    splashScreenAnimation:{
        width: 200,
        maxWidth: 200,
        position: 'relative'
        
    },

    creditWrapper:{
        // marginVertical: 20,
        position: 'absolute',
        bottom: 20,
        
    }
})
