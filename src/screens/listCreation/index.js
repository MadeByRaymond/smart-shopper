import React, { Component } from 'react'
import { View, Text, Image, TextInput, ScrollView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeatureImagesModal from 'react-native-modal'

import Header from '../../components/header';
import {globalStyles, colorScheme, theme} from '../../components/uiComponents'
import {ItemSelectionModal} from '../../components/modals'
import {OpacityLinks, TouchableOSSpecific} from '../../components/links'
import FloatingButtonView from '../../components/buttons/floatingButtonView'
import {TrashIcon, AddIcon, MenuHalfedIcon} from '../../vectors/generalIcons'
import CheckedIcon from '../../vectors/checkIcon/checkedIcon'

// Includes 
import {updateStatusBarAppearance} from '../../includes/functions';
import {currencies, unitSymbols, customItemId, asyncStores, featureImages, dHeight, dWidth} from '../../includes/variables';

export class ListCreation extends Component {

    state={
        showCurrencyModal: false,
        currencyModalOpenedOnce: false,
        unitsModalOpenedOnce: false,
        itemCount: 99,
        categoryCount: 99,

        activeFeatureImage: featureImages[0].id,
        featureImagesModal: false,

        setUnitsSymbolModal:{
            visibility: false,
            itemId: '',
            categoryId: ''
        },


        currency:{
            id: currencies[0].id,
            symbol: currencies[0].symbol
        },
        listTitle: 'Often purchased',
        listItemCategories:[
            {
                categoryId: 'category-1',
                categoryName: 'Dairy'
            },
            {
                categoryId: 'category-2',
                categoryName: 'Cosmetics'
            },
        ],
        listItems:[
            {
                id: 'item-1',
                category: 'category-1',
                title: 'Milk',
                price: '20',
                units: '31',
                unitSymbol: {
                    id: 1,
                    symbol: 'pcs'
                },
                status: 'active'
            },
            {
                id: 'item-2',
                category: 'category-1',
                title: 'Butter',
                price: '24',
                units: '20',
                unitSymbol: {
                    id: 1,
                    symbol: 'pcs'
                },
                status: 'active'
            },
            {
                id: 'item-1',
                category: 'category-2',
                title: 'Extra white bathing soap',
                price: '121',
                units: '12',
                unitSymbol: {
                    id: 1,
                    symbol: 'pcs'
                },
                status: 'active'
            },
            {
                id: 'item-2',
                category: 'category-2',
                title: 'Shear-Butter Soap',
                price: '24',
                units: '20',
                unitSymbol: {
                    id: 1,
                    symbol: 'pcs'
                },
                status: 'active'
            }
        ],

        listItemssss: [
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

    updateListItem = (itemId, categoryId, itemKey, value) => {
        let itemIndex = this.state.listItems.findIndex((item) => (item.id == itemId && item.category == categoryId))
        let itemsArray = [...this.state.listItems]
        itemsArray[itemIndex] = {
            ...itemsArray[itemIndex],
            [itemKey]: value
        }
        
        this.setState({
            listItems: itemsArray
        })
    }

    createList=() => {

    }

    // removeListItem = ()

    renderItems = (activeColorScheme) =>{
        // let fff = this.state.listItemCategories.for
        // let fff;
        return this.state.listItemCategories.map((category, index) => {
            let itemsList = this.state.listItems.map((item, key) => {
                if(item.category.trim() == category.categoryId.trim()){
                    return (<View style={styles.listItemContainer} key={key}>
                        <View style={styles.listItemRight}>
                            <View>
                                <TextInput
                                    value= {item.title}
                                    maxLength= {20}
                                    onChangeText= {(val) => this.updateListItem(item.id, item.category, 'title', val)}

                                    style={[styles.listItemTitle, {color: activeColorScheme.textPrimary}]}
                                />
                            </View>
                            <View style={styles.listItemPriceWrapper}>
                                <Text style={[styles.listItemPrice, {color: activeColorScheme.subtext_3}]}>{this.state.currency.symbol}</Text>
                                <TextInput
                                    value= {item.price}
                                    maxLength={12}
                                    keyboardType= {'numeric'}
                                    onChangeText= {(val) => this.updateListItem(item.id, item.category, 'price', val)}

                                    style={[styles.listItemPrice, {color: activeColorScheme.subtext_3, width:dWidth - 16 - 16 - 45 - 45 - 48 - 10 - 15 - 55}]}
                                />
                            </View>
                        </View>
                        <View style={styles.listItemLeft}>
                            <View style={styles.listItemUnitsWrapper}>
                                <View style={styles.listItemUnitsBorder}>
                                    <TextInput 
                                        value={item.units}
                                        maxLength= {4}
                                        keyboardType= {'numeric'}
                                        onChangeText= {(val) => this.updateListItem(item.id, item.category, 'units', val)}

                                        style={[styles.listItemUnitsInput, {color: activeColorScheme.textPrimary}]}
                                    />
                                </View>
                                <View>
                                    <OpacityLinks onPress={() => this.setState({
                                        unitsModalOpenedOnce: true,
                                        setUnitsSymbolModal:{
                                            visibility: true,
                                            itemId: item.id,
                                            categoryId: item.category
                                        }
                                    })}>
                                        <Text
                                            style={[styles.listItemUnitsInput, {color: activeColorScheme.textPrimary}]}
                                        >{item.unitSymbol.symbol}</Text>
                                    </OpacityLinks>
                                    
                                </View>
                            </View>
                            <View style={styles.trashButtonWrapper}>
                                <TouchableOSSpecific onPress={()=> {
                                    let newListItems = this.state.listItems.filter(filterItem => !(filterItem.id == item.id && filterItem.category == item.category))
                                    // let listItems = [...this.state.listItems]
                                    // listItems.pop()

                                    let isLastItemInCategory = this.state.listItems.filter(filterItem => filterItem.category == item.category).length <= 1;
                                    let isLastItem = this.state.listItems.length <= 1;

                                    if(isLastItem){
                                        //Do Nothing
                                    }else if(isLastItemInCategory){
                                        this.setState({
                                            listItemCategories: this.state.listItemCategories.filter(filterItem => !(filterItem.categoryId == item.category)),
                                            listItems: newListItems
                                        })
                                    }else {
                                        this.setState({
                                            listItems: newListItems
                                        })
                                    }
                                }}>
                                    <View style={[styles.trashButton, {backgroundColor: this.props.theme.primaryColor, opacity: this.state.listItems.length <= 1 ? 0.6 : 1}]}>
                                        <TrashIcon 
                                            height={20}
                                        />
                                    </View>    
                                </TouchableOSSpecific>
                            </View>
                        </View>
                    </View>)
                }

                return null;
            });

            return (
                <View  key={index}>
                    <View style={styles.categoryWrapper}>
                        <TextInput 
                            value={category.categoryName}
                            maxLength={30}
                            onChangeText = {(val) => {
                                let categoryIndex = this.state.listItemCategories.findIndex(item => (item.categoryId == category.categoryId))
                                let categoriesArray = [...this.state.listItemCategories]
                                categoriesArray[categoryIndex] = {
                                    ...categoriesArray[categoryIndex],
                                    categoryName: val
                                }

                                this.setState({
                                    listItemCategories: categoriesArray
                                })
                            }}

                            style={[styles.listCategoryInput, {color: activeColorScheme.subtext_1}]}
                        />
                    </View>
                    <View style={styles.listItemsWrapper}>
                        {itemsList}
                    </View>
                    <View>
                        <OpacityLinks activeOpacity={0.95} onPress={()=> this.setState(prevState => {
                            let listItems = [...prevState.listItems, {
                                id: `item-${prevState.itemCount + 1}`,
                                category: category.categoryId,
                                title: 'Item Title',
                                price: '0',
                                units: '1',
                                unitSymbol: unitSymbols[0],
                                status: 'active'
                            }]

                            return {
                                itemCount: prevState.itemCount + 1,
                                listItems
                            }
                        })}>
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

                    {(index + 1 == this.state.listItemCategories.length) ? 
                    (<View style={styles.addSectionButtonWrapper} >
                        <OpacityLinks style={{zIndex: 9999}} activeOpacity={0.95} onPress={()=> this.setState(prevState => {
                            let listItems = [...prevState.listItems, {
                                id: `item-${prevState.itemCount + 1}`,
                                category: `category-${prevState.categoryCount + 1}`,
                                title: 'Item Title',
                                price: '0',
                                units: '1',
                                unitSymbol: unitSymbols[0],
                                status: 'active'
                            }]

                            let listItemCategories = [...prevState.listItemCategories, {
                                categoryId: `category-${prevState.categoryCount + 1}`,
                                categoryName: 'New Category'
                            }]

                            return {
                                itemCount: prevState.itemCount + 1,
                                categoryCount: prevState.categoryCount + 1,
                                listItems, listItemCategories
                            }
                        })}>
                            <View style={[styles.addSectionButton, {borderColor: this.props.theme.primaryColor, backgroundColor: this.props.colorScheme == 'dark' ? this.props.theme.secondaryColor : activeColorScheme.background}]}>
                                <AddIcon 
                                    theme={this.props.theme}
                                />
                            </View>
                        </OpacityLinks>
                        <View style={[styles.listItemDivider, styles.addSectionButtonDivider, {borderColor: this.props.theme.primaryColor}]}></View>
                    </View>)
                    : (<View>
                        <View style={[styles.listItemDivider, {borderColor: activeColorScheme.listDivider}]}></View>
                    </View>)}
                </View>
            );
        })
        for (const category of this.state.listItemCategories) {
            for (const item of this.state.listItems) {
                if(item.category.trim() == category.categoryId.trim()){
                    fff = fff + (<View>
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
                    </View>)
                }
                
            }
        }

        // console.log(fff);
        // return fff
    }

    renderModals= (activeColorScheme, activeUnitsSymbol) => (
        <View>
            {this.state.currencyModalOpenedOnce ? (<ItemSelectionModal
                type= 'default'
                subtype= 'currency'
                closeFunction = {()=> this.setState({showCurrencyModal: false})}
                activeState={this.state.showCurrencyModal}
                colorScheme = {activeColorScheme}
                theme = {this.props.theme}
                defaultItem = {this.state.currency}
                setDefaultItem = {({id, symbol, setCustomItem, closeFunction}) => {
                    setCustomItem ? setCustomItem('') : null
                    this.setState({currency: {id, symbol}})
                    closeFunction ? closeFunction() : null
                }}
                customItem = {this.state.currency.id == customItemId ? this.state.currency.symbol : ''}
            />) : null}

            {this.state.unitsModalOpenedOnce ? (<ItemSelectionModal
                type= 'default'
                subtype= 'units'
                closeFunction = {()=> this.setState({
                    unitsModalOpenedOnce: false,
                    setUnitsSymbolModal: {
                        visibility: false
                    }
                })}
                activeState={this.state.setUnitsSymbolModal.visibility}
                colorScheme = {activeColorScheme}
                theme = {this.props.theme}
                defaultItem = {activeUnitsSymbol}
                setDefaultItem = {({id, symbol, setCustomItem, closeFunction}) => {
                    setCustomItem ? setCustomItem('') : null
                    this.updateListItem(
                        this.state.setUnitsSymbolModal.itemId,
                        this.state.setUnitsSymbolModal.categoryId,
                        'unitSymbol',
                        {id, symbol}
                    )
                    closeFunction ? closeFunction() : null
                }}
                customItem = {activeUnitsSymbol.id == customItemId ? activeUnitsSymbol.symbol : ''}
            />) : null}


            <FeatureImagesModal 
                isVisible={this.state.featureImagesModal}
                hideModalContentWhileAnimating={true}
                swipeDirection={'down'}
                animationIn= {'slideInUp'}
                animationInTiming={1}
                animationOut= {'slideOutDown'}
                animationOutTiming={500}
                backdropOpacity={0.21}
                propagateSwipe={true}
                onBackButtonPress= {()=> this.setState({featureImagesModal: false})}
                onBackdropPress= {()=> this.setState({featureImagesModal: false})}
                onSwipeComplete= {()=> this.setState({featureImagesModal: false})}
                style={{margin: 0}}
            >
                <View style={globalStyles.modalBgWrapper}>
                    <View style={[globalStyles.modalBg,{backgroundColor: activeColorScheme.modalBackground, paddingHorizontal:16, paddingTop: 32}]}>
                        
                        <View><Text style={[globalStyles.modalTitle, {color: activeColorScheme.textPrimary}]}>Select Image</Text></View>
                        <View style={{maxHeight: dHeight - 27 - 17 - 62 - (dHeight / 8) }}>
                            <ScrollView>
                                <View onStartShouldSetResponder={() => true} style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    // justifyContent: 'space-evenly'
                                }}>
                                    {featureImages.map((item, key) => {
                                        let imageDim = (dWidth - 16 - 16 - 50) / 5;
                                        return (
                                            <OpacityLinks key={key} onPress={()=>{
                                                this.setState({
                                                    activeFeatureImage : item.id
                                                })
                                            }}>
                                                <View style={{margin:5}}>
                                                    <Image style={{width: imageDim, height: imageDim, maxHeight:80, maxWidth:80}} resizeMethod='resize' source={{uri: item.uri}} resizeMode='contain' />
                                                    { this.state.activeFeatureImage == item.id ? <View style={styles.itemCheckMark}>
                                                        <CheckedIcon height={28} width={28} checkedStatus={true} theme={this.props.theme} />
                                                    </View> : null}
                                                </View>
                                            </OpacityLinks>
                                        )
                                    })}
                                </View>
                            </ScrollView>
                        </View>  
                    </View>
                </View>
            </FeatureImagesModal>
        </View>
    )

    render() {
        let activeColorScheme = colorScheme[this.props.colorScheme == 'dark' ? 'dark' : 'light'];
        let activeUnitsSymbol = this.state.listItems.filter(item => (item.id == this.state.setUnitsSymbolModal.itemId && item.category == this.state.setUnitsSymbolModal.categoryId))[0]?.unitSymbol
        return (
            <View style={[globalStyles.container, {backgroundColor: activeColorScheme.background }]} >
                <Header
                    colors={activeColorScheme} 
                    leftIcons = {['currencySwap']}
                    currencySwapIconAction = {()=> this.setState({showCurrencyModal: true, currencyModalOpenedOnce: true})}

                    componentId = {this.props.componentId}
                 />

                {this.renderModals(activeColorScheme, activeUnitsSymbol)}
                
                <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.scrollViewContainer} showsVerticalScrollIndicator={false} snapToEnd>
                    <View style={styles.listMetaWrapper}>
                        <OpacityLinks onPress={()=>this.setState({featureImagesModal: true})}>
                            <View>
                                <Image style={styles.listImage} source={{uri: featureImages.find(item => (item.id == this.state.activeFeatureImage)).uri}} />
                            </View>
                        </OpacityLinks>
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

                    {this.renderItems(activeColorScheme)}
                    
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

                    style={{top: dHeight - 140}}
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
    },

    itemCheckMark:{
        position: 'absolute',
        top: -4,
        right: -4
    }
})

