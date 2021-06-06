import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import {Navigation} from 'react-native-navigation'

import {CaretIcon, StarredIcon} from '../../vectors/generalIcons'

import {OpacityLinks} from '../links'
import {navigateToScreen} from '../../includes/functions'

const shoppingLists = (props) => {
    return (
        <OpacityLinks onPress={()=> navigateToScreen(props.newScreenProps.componentId,'com.mbr.smartshopper.screen.listDetails')}>
            <View style={styles.itemContainer}>
                <View style={styles.left}>
                    <View>
                        <Image style={styles.image} source={require('../../assets/img/005-popsicle.png')} />
                    </View>
                    <View>
                        <View><Text style={[styles.title, {color: props.colors.textPrimary}]}>Often purchased</Text></View>
                        <View><Text style={[styles.subtext, {color: props.colors.subtext_2}]}>10 products</Text></View>
                    </View>
                </View>
                <View style={styles.right}>
                    {props.starred ? (
                    <View style={styles.icon}>
                        <StarredIcon height={18} width={18} active={true}  />
                    </View> )
                    : null}
                    <View style={styles.icon}>
                        <CaretIcon height={15} width={18} colors={props.colors} />
                    </View>
                </View>
            </View>
        </OpacityLinks>
    )
}

export default shoppingLists

const styles = StyleSheet.create({
    itemContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    left:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    right:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    image:{
        height: 60,
        width: 60,
        marginRight: 18
    },
    title:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 16,
        paddingBottom: 5
    },
    subtext:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 14.5,
    },
    icon:{
        paddingRight: 14
    }

})
