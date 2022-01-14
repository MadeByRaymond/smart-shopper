import React, {useState} from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-async-storage/async-storage';

import {OpacityLinks, TouchableOSSpecific} from '../links'
import CheckedIcon from '../../vectors/checkIcon/checkedIcon'

// Includes 
import {asyncStores, currencies, unitSymbols, customItemId, displayModes} from '../../includes/variables'

let setDefaultCurrency = (currencyObj) => {
    AsyncStorage.setItem(asyncStores.currency, JSON.stringify(currencyObj), (e)=>{/* Do Nothing */});
} 

let renderItems = (itemsType, activeItem, setItem, customItem, setCustomItem, theme, colorScheme, closeFunction) =>{
    let items = itemsType == 'currency' ? currencies : unitSymbols
    return (<View>
        {items.map(item => (
            <OpacityLinks onPress={() => {
                setItem({
                    id:item.id,
                    name:item.name,
                    symbol:item.symbol, 
                    setCustomItem,
                    closeFunction
                })
            }}  key={item.id}>
                <View style={[styles.itemWrapper, {borderBottomColor: colorScheme.listBorder}]}>
                    <View><Text style={[styles.itemText, {color: colorScheme.textPrimary}]}>{item.name} ({item.symbol})</Text></View>
                    {(customItem.trim() == '' && activeItem == item.id) ? (<View style={styles.itemCheckMark}>
                        <CheckedIcon height={28} width={28} checkedStatus={true} theme={theme} />
                    </View>) : null}
                </View>
            </OpacityLinks>
        ))}

        <View style={[styles.itemWrapper, {borderBottomWidth: 0}]}>
            <TextInput 
                placeholder = 'Enter Custom Symbol'
                placeholderTextColor= {'rgba(159, 162, 176, 0.53);'}
                style= {[styles.itemTextInput, {color: colorScheme.textPrimary}]}
                maxLength={itemsType == 'currency' ? 5 : 3}
                autoCapitalize= {itemsType == 'currency' ? 'characters' : 'none'}

                value={customItem}
                onChangeText = {(val) => setCustomItem(val.trim())}
            />
        </View>
        {customItem.trim() != '' ? (<TouchableOSSpecific onPress={()=>{
            setItem({
                id:customItemId,
                name:'',
                symbol:customItem,
                closeFunction
            })
        }}>
            <View style={[styles.itemWrapper, {borderBottomWidth: 0, backgroundColor: theme.primaryColor}]}>
                <Text style={styles.itemButtonText}>Save Currency</Text>
            </View>
        </TouchableOSSpecific>) : null}
        
    </View>)
}

let renderDisplayModes = (setColorScheme, activeDisplayMode, setDisplayMode, theme, colorScheme) =>{
    return (<View>
        {displayModes.map((item, i) => (
            <OpacityLinks onPress={() => {
                AsyncStorage.setItem(asyncStores.colorScheme, item.type).then(() => {
                    setColorScheme(item.type);
                    setDisplayMode(item.type)
                }).catch((e)=>{/* Do Nothing */});
            }}  key={i}>
                <View style={[styles.itemWrapper, {borderBottomColor: colorScheme.listBorder, borderBottomWidth: i >= (displayModes.length - 1) ? 0 : 1}]}>
                    <View><Text style={[styles.itemText, {color: colorScheme.textPrimary}]}>{item.name} {item.type == 'system' ? null : 'Mode'}</Text></View>
                    {activeDisplayMode == item.type ? (<View style={styles.itemCheckMark}>
                        <CheckedIcon height={28} width={28} checkedStatus={true} theme={theme} />
                    </View>) : null}
                </View>
            </OpacityLinks>
        ))}
        
    </View>)
}

export function ItemSelectionModal(props) {
    // const [activeCurrency, setCurrency] = useState(currencies[0].id);
    const [customItem, setCustomItem] = useState(props.customItem);
    
    return (
        <Modal
            isVisible = {props.activeState}
            // hideModalContentWhileAnimating={true}
            swipeDirection={['up','down']}
            animationIn= {'zoomIn'}
            animationInTiming={1}
            animationOut= {'zoomOut'}
            animationOutTiming={500}
            backdropOpacity={0.5}
            onBackButtonPress= {props.closeFunction}
            onBackdropPress= {props.closeFunction}
            onSwipeComplete= {props.closeFunction}
            style={{margin: 0, alignItems: 'center', justifyContent: 'center'}}
        >
            <View style={[styles.container, {backgroundColor: props.colorScheme.modalBackground, paddingBottom: props.type == 'display' ? 5 : 0}]}>
                { props.type == 'default' 
                  ? renderItems(props.subtype, props.defaultItem.id, props.setDefaultItem, customItem, setCustomItem, props.theme, props.colorScheme, props.closeFunction)
                  : props.type == 'display'
                  ? renderDisplayModes(props.setColorScheme, props.activeDisplayMode, props.setDisplayMode, props.theme, props.colorScheme)
                  : null
                }
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container:{
        width: 260,
        minHeight: 20,
        paddingTop: 5,
        overflow: 'hidden',
        borderRadius: 8
    },
    itemWrapper:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1
    },
    itemText:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 18,
    },
    itemButtonText:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 16,

        textAlign: 'center', 
        color: '#FFFFFF', 
        width: '100%'
    },
    itemTextInput:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 18,

        padding: 0,
        margin: 0,
        width: '100%'
    },
    itemCheckMark:{
        marginVertical: -4
    }
})
