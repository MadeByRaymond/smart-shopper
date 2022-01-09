import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TextInput, BackHandler } from 'react-native'
import { Navigation } from "react-native-navigation";

// ***** Component Imports *****
// Icons and Vectors 
import {MenuIcon, StarredIcon, BackIcon, SettingsIcon, SearchIcon, CurrencySwapIcon, ImportIcon} from '../../vectors/generalIcons'

// Components 
import {OpacityLinks} from '../links';

// Includes 
import {dWidth} from '../../includes/variables'
import {navigateToScreen} from '../../includes/functions';

const checkIfDisplayIcon = (iconsProps, searchTerm='') => {
    if (Array.isArray(iconsProps)) {
        return iconsProps.includes(searchTerm);
    }else if(typeof iconsProps === 'string'){
        return iconsProps.trim().toLowerCase() == searchTerm.trim().toLowerCase()
    }else{
        return false;
    }
}

const Header = (props) => {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchInputVal, setSearchInputVal] = useState('');

    const syncState = {
        primaryColor: props.isSyncing ? '#FF9100' : props.isSynced ? '#66BB00' : '#C50000',
        secondaryColor: props.isSyncing ? '#FFE9CC' : props.isSynced ? '#E8F4CF' : '#FDD6CB',
        text: props.isSyncing ? 'Syncing' : props.isSynced ? 'Synced' : 'Not Synced',
    }

    useEffect(() => {    
        const backHandler = BackHandler.addEventListener("hardwareBackPress", (e) =>{
            // BackHandler.exitApp
            // alert('ss')
            
            if(showSearchBar){
                setShowSearchBar(false);
                setSearchInputVal('')
                return true;
            }else if(!props.hideBackButton){
                Navigation.pop(props.componentId)
                return true;
            }else{
                return false
            }

            
        });
    
        return () => backHandler.remove();
      }, [showSearchBar]);

    return (
        <View style={styles.container}>
            {
                showSearchBar 
                ? (<View style={styles.searchBar}>
                    <TextInput value={searchInputVal} onChangeText={(e) => {setSearchInputVal(e)}} autoFocus={true} returnKeyType={'search'} style={styles.searchBarInput} placeholder='Enter a list code to search' placeholderTextColor={'#9FA2B0'} />
                    <OpacityLinks onPress={()=> {
                        searchInputVal.trim() == '' ? setShowSearchBar(false) : null
                    }}><View style={styles.leftIcon}><SearchIcon width={24} height={21} /></View></OpacityLinks>
                </View>)
                : props.hideBackButton 
                ? <View><Text style={[styles.noBackTitle, {color: props.colors.textPrimary}]}>{props.title ? props.title : null}</Text></View>
                : <OpacityLinks onPress={()=>{
                    Navigation.pop(props.componentId)
                }}><View><BackIcon width={24} height={21} colors={props.colors} /></View></OpacityLinks>
            }
            {props.title && !props.hideBackButton ? <View><Text style={[styles.withBackTitle,{color: props.colors.subtext_1}]}>{props.title}</Text></View> : null }
            <View style={styles.leftIconsWrapper}>
                {/* Search Icon  */}
                {checkIfDisplayIcon(props.leftIcons, 'search') ? showSearchBar ? null : <OpacityLinks onPress={()=> setShowSearchBar(true)}><View style={styles.leftIcon}><SearchIcon width={24} height={21} colors={props.colors} /></View></OpacityLinks> : null}
                {/* Import Icon  */}
                {checkIfDisplayIcon(props.leftIcons, 'import') ? <OpacityLinks onPress={()=> props.showImportModal()}><View style={styles.leftIcon}><ImportIcon width={24} height={21} colors={props.colors} /></View></OpacityLinks> : null}
                {/* Settings Icon  */}
                {checkIfDisplayIcon(props.leftIcons, 'settings') ? <OpacityLinks onPress={()=>navigateToScreen(props.componentId,'com.mbr.smartshopper.screen.settings')}><View style={styles.leftIcon}><SettingsIcon width={24} height={21} colors={props.colors} /></View></OpacityLinks> : null}
                {/* Synced Status Pill  */}
                {checkIfDisplayIcon(props.leftIcons, 'syncPill') ? (<OpacityLinks onPress={props.syncIconAction}>
                    <View style={[styles.syncStatusPill, {borderColor: syncState.primaryColor, backgroundColor: syncState.secondaryColor}]}>
                            <Text style={[styles.syncStatusText, {color: syncState.primaryColor}]}>{syncState.text}</Text>
                    </View>
                </OpacityLinks>) : null}
                {/* Starred Icon  */}
                {checkIfDisplayIcon(props.leftIcons, 'starred') ? <OpacityLinks onPress={props.starredIconAction}><View style={styles.leftIcon}><StarredIcon width={24} height={23} colors={props.colors} active={props.isStarred} /></View></OpacityLinks> : null}
                {/* Menu Icon  */}
                {checkIfDisplayIcon(props.leftIcons, 'menu') ? <OpacityLinks onPress={props.menuIconAction}><View style={styles.leftIcon}><MenuIcon width={24} height={21} colors={props.colors} /></View></OpacityLinks> : null}
                {/* CurrencySwap Icon  */}
                {checkIfDisplayIcon(props.leftIcons, 'currencySwap') ? <OpacityLinks onPress={props.currencySwapIconAction}><View style={styles.leftIcon}><CurrencySwapIcon width={28} height={28} colors={props.colors} /></View></OpacityLinks> : null}
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20
    },
    noBackTitle:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 28,
    },
    withBackTitle:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 16,
        textAlign: 'center'
    },
    leftIconsWrapper:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftIcon:{
        padding: 8
    },

    searchBar:{
        backgroundColor: '#F7F3FE',
        borderRadius: 7,
        width: dWidth - 24 - 16 - 16 - 16,

        flexDirection: 'row',
        alignItems: 'center'
    },
    searchBarInput:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 14.5,
        color: '#021032',

        paddingLeft: 20,
        paddingHorizontal: 0,
        width: dWidth - 24 - 16 - 16 - 16 - 16 - 24,
        height: 21 + 8 + 8 + 10,
    },
    
    syncStatusPill:{
        backgroundColor: '#B5DBFF',
        borderWidth: 1,
        borderColor: '#0B799D',
        borderStyle: 'solid',
        borderRadius: 10000,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 8
    },
    syncStatusText:{
        color: '#0B799D',
        fontFamily: 'Gilroy-Medium',
        fontSize: 13
    }
})
