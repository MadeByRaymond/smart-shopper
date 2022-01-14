import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native'
import Shadow from 'react-native-drop-shadow';
import LinearGradient from 'react-native-linear-gradient';

import {TouchableOSSpecific, OpacityLinks} from '../links';

const whatToReturn = (props) =>{
    switch (props.type) {
        case 'singleButton':
            return (
                <View style={styles.buttonRadius}>
                    <TouchableOSSpecific onPress={props.onPress} >
                        <View style={[styles.button, {backgroundColor: props.theme.primaryColor}]}>
                            {props.content?.icon ? (<View style={{marginRight: 8}}>
                                {props.content.icon}
                                {/* <MenuHalfedIcons height={14} width={21} /> */}
                            </View>) : null}
                            <View><Text style={styles.buttonText}>{props.content?.text}</Text></View>
                        </View>
                    </TouchableOSSpecific>
                </View>
            )
            break;
        case 'multiButtons' :
            // let props = {contents:[]};
            return(
                <View style={[styles.button, styles.multiButtonWrapper, {backgroundColor: props.theme.primaryColor}]}>  
                    {props.contents.map((item, i)=>(
                        <OpacityLinks hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} onPress={item.disabledState ? item.disabledPressAction : item.onPress} onLongPress={item.onHold}  key={i}>
                            <View style={{alignItems: 'center', opacity: item.disabledState ? 0.6 : 1}}>
                                <View><item.icon height={35} width={35} active={item.isActive ? item.isActive : false} fillColor={'#fff'} ></item.icon></View>
                                {props.showButtonLabels ? <View><Text style={styles.multiButtonText}>{item.text}</Text></View> : null}
                            </View>
                        </OpacityLinks>
                    ))}
                </View>
            )
            break;
        default:
            break;
    }
}

const FloatingButtonView = (props) => {

    const [slideValue, setSlideValue] = useState(new Animated.Value(0))

    useEffect(() => {
        Animated.timing(slideValue, {
            toValue: 1,
            duration:100,
            useNativeDriver : true
        }).start();
    }, [])

    return (
        <Animated.View style={[styles.container, {padding:0,opacity:slideValue}, props.style ? props.style : null]}>
            <LinearGradient 
                colors={[(props.colors.background + '00'), props.colors.background, props.colors.background]}
                locations={[0.05,0.2,1]} 
                style={[styles.container,{paddingBottom: props.type == 'multiButtons' ? 30 : 35}]}
            >
                <Shadow style={[styles.buttonShadow, {shadowColor: props.theme.primaryColor, shadowOpacity: props?.colorScheme == 'dark' ? 0.25 : 0.4}]}>
                    {whatToReturn(props)}
                    
                </Shadow>
            </LinearGradient>
        </Animated.View>
    )
}

export default FloatingButtonView

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 40,
        position:'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
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
    },
    multiButtonWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    multiButtonText: {
        fontFamily: 'Gilroy-Medium',
        fontSize: 12.5,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 7
    }
})
