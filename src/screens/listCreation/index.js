import React, { Component } from 'react'
import { View, Text, Image, TextInput, ScrollView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../../components/header';
import {globalStyles, colorScheme} from '../../components/uiComponents'
import {ItemSelectionModal} from '../../components/modals'
import {OpacityLinks, TouchableOSSpecific} from '../../components/links'
import FloatingButtonView from '../../components/buttons/floatingButtonView'
import {TrashIcon, AddIcon, MenuHalfedIcon} from '../../vectors/generalIcons'

// Includes 
import {updateStatusBarAppearance} from '../../includes/functions';
import {currencies, customCurrencyId, asyncStores, dHeight, dWidth} from '../../includes/variables';

export class ListCreation extends Component {

    state={
        showCurrencyModal: false,
        currencyModalOpenedOnce: false,


        currency:{
            id: currencies[0].id,
            symbol: currencies[0].symbol
        },
        listTitle: 'Often purchased',
        listItems: [
            {
                categoryId: 'category-1',
                categoryName: 'Dairy',
                items: [
                    {
                        id: 'item-1',
                        title: 'Milk',
                        price: '20',
                        units: '31',
                        unitSymbol: 'lb',
                        status: 'active'
                    },
                    {
                        id: 'item-2',
                        title: 'Butter',
                        price: '24',
                        units: '20',
                        unitSymbol: 'gal',
                        status: 'active'
                    }
                ]
            },
            {
                categoryId: 'category-2',
                categoryName: 'Cosmetics',
                items: [
                    {
                        id: 'item-1',
                        title: 'Extra white bathing soap',
                        price: '121',
                        units: '12',
                        unitSymbol: 'pcs',
                        status: 'active'
                    },
                    {
                        id: 'item-2',
                        title: 'Shear-Butter Soap',
                        price: '24',
                        units: '20',
                        unitSymbol: 'pcs',
                        status: 'active'
                    }
                ]
            }
        ]
    }

    componentDidMount(){ 
        updateStatusBarAppearance(this.props);

        AsyncStorage.getItem(asyncStores.currency).then(val => this.setState({
            currency: JSON.parse(val)
        })).catch((e)=>this.setState({
            id: currencies[0].id,
            symbol: currencies[0].symbol
        }))
    }

    componentDidUpdate(prevProps){
        if(prevProps.colorScheme != this.props.colorScheme){
            updateStatusBarAppearance(this.props);
        }
    }

    render() {
        let activeColorScheme = colorScheme[this.props.colorScheme == 'dark' ? 'dark' : 'light'];
        return (
            <View style={[globalStyles.container, {backgroundColor: activeColorScheme.background }]} >
                <Header
                    colors={activeColorScheme} 
                    leftIcons = {['currencySwap']}
                    currencySwapIconAction = {()=> this.setState({showCurrencyModal: true, currencyModalOpenedOnce: true})}

                    componentId = {this.props.componentId}
                 />

                {this.state.currencyModalOpenedOnce ? (<ItemSelectionModal
                    type= 'currency'
                    closeFunction = {()=> this.setState({showCurrencyModal: false})}
                    activeState={this.state.showCurrencyModal}
                    colorScheme = {activeColorScheme}
                    theme = {this.props.theme}
                    defaultCurrency = {this.state.currency}
                    setDefaultCurrency = {({id, symbol, setCustomCurrency, closeFunction}) => {
                        setCustomCurrency ? setCustomCurrency('') : null
                        this.setState({currency: {id, symbol}})
                        closeFunction ? closeFunction() : null
                    }}
                    customCurrency = {this.state.currency.id == customCurrencyId ? this.state.currency.symbol : ''}
                />) : null}
                
                <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.scrollViewContainer} showsVerticalScrollIndicator={false} snapToEnd>
                    <View style={styles.listMetaWrapper}>
                        <View>
                            <Image style={styles.listImage} source={require('../../assets/img/005-popsicle.png')} />
                        </View>
                        <View>
                            <TextInput 
                                value={this.state.listTitle}
                                onChangeText = {(val) => this.setState({listTitle: val})}
                                maxLength={30}
                                autoCapitalize={'words'}

                                style={[styles.listTitle, {color: activeColorScheme.textPrimary}]}
                            />
                        </View>
                    </View>
                    
                    <View>
                        <View style={styles.categoryWrapper}>
                            <TextInput 
                                value={'Dairy'}
                                maxLength={30}

                                style={[styles.listCategoryInput, {color: activeColorScheme.subtext_1}]}
                            />
                        </View>
                        <View style={styles.listItemsWrapper}>
                            <View style={styles.listItemContainer}>
                                <View style={styles.listItemRight}>
                                    <View>
                                        <TextInput
                                            value= {'Milk'}
                                            maxLength= {20}

                                            style={[styles.listItemTitle, {color: activeColorScheme.textPrimary}]}
                                        />
                                    </View>
                                    <View style={styles.listItemPriceWrapper}>
                                        <Text style={[styles.listItemPrice, {color: activeColorScheme.subtext_3}]}>{this.state.currency.symbol}</Text>
                                        <TextInput
                                            value= {'20'}
                                            maxLength={12}
                                            keyboardType= {'numeric'}
                                            

                                            style={[styles.listItemPrice, {color: activeColorScheme.subtext_3}]}
                                        />
                                    </View>
                                </View>
                                <View style={styles.listItemLeft}>
                                    <View style={styles.listItemUnitsWrapper}>
                                        <View style={styles.listItemUnitsBorder}>
                                            <TextInput 
                                                value={'29'}
                                                maxLength= {4}
                                                keyboardType= {'numeric'}

                                                style={[styles.listItemUnitsInput, {color: activeColorScheme.textPrimary}]}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                style={[styles.listItemUnitsInput, {color: activeColorScheme.textPrimary}]}
                                            >gal</Text>
                                        </View>
                                    </View>
                                    <View style={styles.trashButtonWrapper}>
                                        <TouchableOSSpecific onPress={()=> {/*alert('ff')*/}}>
                                            <View style={[styles.trashButton, {backgroundColor: this.props.theme.primaryColor}]}>
                                                <TrashIcon 
                                                    height={20}
                                                />
                                            </View>    
                                        </TouchableOSSpecific>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.listItemContainer}>
                                <View style={styles.listItemRight}>
                                    <View>
                                        <TextInput
                                            value= {'Milk'}
                                            maxLength= {20}

                                            style={[styles.listItemTitle, {color: activeColorScheme.textPrimary}]}
                                        />
                                    </View>
                                    <View style={styles.listItemPriceWrapper}>
                                        <Text style={[styles.listItemPrice, {color: activeColorScheme.subtext_3}]}>{this.state.currency.symbol}</Text>
                                        <TextInput
                                            value= {'20'}
                                            maxLength={12}
                                            keyboardType= {'numeric'}
                                            

                                            style={[styles.listItemPrice, {color: activeColorScheme.subtext_3}]}
                                        />
                                    </View>
                                </View>
                                <View style={styles.listItemLeft}>
                                    <View style={styles.listItemUnitsWrapper}>
                                        <View style={styles.listItemUnitsBorder}>
                                            <TextInput 
                                                value={'29'}
                                                maxLength= {4}
                                                keyboardType= {'numeric'}

                                                style={[styles.listItemUnitsInput, {color: activeColorScheme.textPrimary}]}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                style={[styles.listItemUnitsInput, {color: activeColorScheme.textPrimary}]}
                                            >gal</Text>
                                        </View>
                                    </View>
                                    <View style={styles.trashButtonWrapper}>
                                        <TouchableOSSpecific onPress={()=> {/*alert('ff')*/}}>
                                            <View style={[styles.trashButton, {backgroundColor: this.props.theme.primaryColor}]}>
                                                <TrashIcon 
                                                    height={20}
                                                />
                                            </View>    
                                        </TouchableOSSpecific>
                                    </View>
                                </View>
                            </View>
                        </View>
                        
                        <View>
                            <OpacityLinks activeOpacity={0.95}>
                                <View style={[styles.addButton, {borderColor: this.props.theme.primaryColor, backgroundColor: this.props.colorScheme == 'dark' ? this.props.theme.secondaryColor : activeColorScheme.background}]}>
                                    <View style={styles.addButtonIcon}>
                                        <AddIcon 
                                            theme={this.props.theme}
                                        />
                                    </View>
                                    <View><Text style={[styles.addButtonText, {color: this.props.theme.primaryColor}]}>Add Item</Text></View>
                                </View>
                            </OpacityLinks>
                        </View>
                    </View>
                    
                    <View>
                        <View style={[styles.listItemDivider, {borderColor: activeColorScheme.listDivider}]}></View>
                    </View>

                    <View style={styles.addSectionButtonWrapper}>
                        <View style={[styles.addSectionButton, {borderColor: this.props.theme.primaryColor, backgroundColor: this.props.colorScheme == 'dark' ? this.props.theme.secondaryColor : activeColorScheme.background}]}>
                            <AddIcon 
                                theme={this.props.theme}
                            />
                        </View>
                        <View style={[styles.listItemDivider, styles.addSectionButtonDivider, {borderColor: this.props.theme.primaryColor}]}></View>
                    </View>
                </ScrollView>


                <FloatingButtonView 
                    type='singleButton'
                    content={{
                        text:'Create list',
                        icon: <MenuHalfedIcon height={14} width={21} />
                    }} 
                    theme={this.props.theme} 
                    colors={activeColorScheme} 
                    onPress= {()=>{
                        alert('pie')
                    }} 
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    colorScheme: state.ui.colorScheme,
    theme: state.ui.theme,
    themeColorName: state.ui.themeColorName
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCreation)

const styles = StyleSheet.create({
    listMetaWrapper:{
        alignItems: 'center'
    },
    listImage:{
        height: 80,
        width: 80,
        marginHorizontal: 'auto',
        resizeMode: 'contain'
    },
    listTitle:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 20,
        textAlign: 'center',
        width: dWidth - 16 - 16,
        // backgroundColor: 'red'
    },

    categoryWrapper:{

    },
    listCategoryInput:{
        fontSize: 16,
        paddingVertical: 0,
        paddingHorizontal: 0,
        minHeight: 0,
        width: '100%',
        // backgroundColor: 'red'
    },

    listItemsWrapper:{
        marginTop: 10,
        marginBottom: -5
    },
    listItemContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    listItemTitle:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 20,
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: dWidth - 16 - 16 - 45 - 45 - 48 - 10 - 15,
    },
    listItemPriceWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        width: dWidth - 16 - 16 - 45 - 45 - 48 - 10 - 15,
    },
    listItemPrice:{
        fontFamily: 'Triomphe-Regular',
        fontSize: 18,
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginRight: 2
    },

    listItemRight:{

    },
    listItemLeft:{
        flexDirection: 'row',
        alignItems:'center'
    },

    listItemUnitsWrapper:{
        flexDirection: 'row',
        alignItems:'center',

        borderColor: '#DEDEE6',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 10
    },
    listItemUnitsBorder:{
        borderRightColor: '#DEDEE6',
        borderRightWidth: 1,
        borderStyle: 'solid',
    },
    listItemUnitsInput:{
        fontFamily: 'Triomphe-Regular',
        fontSize: 16,
        width: 45,
        textAlign: 'center',
        opacity: 0.7,

        paddingVertical: 10,
        paddingHorizontal: 5
    },

    trashButtonWrapper:{
        borderRadius: 10, 
        overflow: 'hidden',
        marginLeft: 10
    },
    trashButton:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        width: 48,
        paddingVertical: 10,
        borderRadius: 10
    },


    addButton:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 11.5,
        marginTop: 10,
        marginBottom: 15,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRadius: 10
    },
    addButtonIcon:{
        marginHorizontal: 4
    },
    addButtonText:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 16,
        marginHorizontal: 4
    },


    listItemDivider:{
        borderWidth: 1,
        borderRadius:1,
        borderStyle: 'dashed',
        marginVertical: 15
    },

    addSectionButtonWrapper:{
        position:'relative',
        justifyContent: 'center',
        alignItems: 'center',

        marginVertical: 8,
    },
    addSectionButton:{
        position:'relative',
        paddingVertical: 11,
        paddingHorizontal: 11,

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRadius: 1000,
        zIndex:1
    },
    addSectionButtonDivider:{
        position: 'absolute',
        top: '50%',
        width: '100%',
        marginVertical: 0,
        zIndex: 0
    }
})

