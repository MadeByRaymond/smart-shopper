import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import SyncModal from 'react-native-modal'
import Realm from "realm";
import { Navigation } from 'react-native-navigation';
import LottieView from 'lottie-react-native';
import {getUniqueId} from 'react-native-device-info';
import Clipboard from "@react-native-community/clipboard";

import Header from '../../components/header';
import {globalStyles, colorScheme} from '../../components/uiComponents'
import CheckedIcon from '../../vectors/checkIcon/checkedIcon';
import FloatingButtonView from '../../components/buttons/floatingButtonView'
import Button from '../../components/buttons/singleButton'
import {OpacityLinks} from '../../components/links'
import {ShareIcon, CopyIcon, EditIcon, TrashIcon} from '../../vectors/generalIcons'

import {ListSchemas} from '../../realm-storage/schemas'
import {app as realmApp} from '../../realm-storage/realm'

// Includes 
import {updateStatusBarAppearance, navigateToScreen, onShare, randomString} from '../../includes/functions';
import {dWidth, realmStorePath, currencies,featureImages, mongoClientCluster} from '../../includes/variables';

class ListDetails extends Component {

    
    user = realmApp.currentUser;
    realm;
    storedLists;
    storedListDetails;

    syncedRealm;
    syncedStoredLists;
    syncedStoredListDetails;

    totalPrice = 0;

    state={
        isLoading: this.props.isLoading,
        showButtonLabels: false,
        showActionsMenu: false,
        syncModal: false,
        isOwner: this.props.isOwner,
        isSynced: this.props.isSynced,
        isSyncing: false,
        isStarred: false,
        showPrice: false,

        listDetails: {
            _id: '',
            _partition : '',
            synced: false,
            name: '',
            items: [
                {
                    id: '',
                    category: '',
                    title: '',
                    price: '0',
                    units: '1',
                    unitSymbol: {
                        id: 1,
                        symbol: ''
                    },
                    status: ''
                }
            ],
            categories: [
                {
                    categoryId: '',
                    categoryName: ''
                }
            ],
            currency: {
                id: currencies[0].id,
                symbol: currencies[0].symbol
            },
            featureImage: featureImages[0].id,
            code: '',
            status: "",
            ownerId: '',
            dateCreated: new Date(),
            dateModified: new Date(),
            lastViewed: new Date(),
            lastActivityLog: ''
        }
    }

    backHandler;

    componentDidMount(){
        updateStatusBarAppearance(this.props);

        this.backHandler = BackHandler.addEventListener("hardwareBackPress", (e) =>{
            // BackHandler.exitApp
            
            if(this.state.showActionsMenu){
                this.setState({showActionsMenu: false})
                return true;
            }else{
                return false
            } 
        });

        this.getLocalListDetails().then(()=>{
            this.state.listDetails.items.map(item => {
                (item.price && item.price.trim() != '') ? this.totalPrice += parseFloat(item.price) : null;
                this.forceUpdate()
            })
        });

        this.props.isSynced ? this.getSyncedListDetails().then(()=>{
            this.state.listDetails.items.map(item => {
                (item.price && item.price.trim() != '') ? this.totalPrice += parseFloat(item.price) : null;
                this.forceUpdate()
            })
        }) : null
    }

    componentDidUpdate(prevProps){
        if(prevProps.colorScheme != this.props.colorScheme){
            updateStatusBarAppearance(this.props);
        }
    }

    componentWillUnmount(){
        this.backHandler.remove()

        if(this.realm !== null && typeof this.realm !== 'undefined' && this.realm !== ""){
            this.realm.isInTransaction ? this.realm.cancelTransaction() : null;
            this.realm.isClosed ? null : this.realm.close();

            this.storedLists ? this.storedLists.removeAllListeners() : null;
        }
    }

    getLocalListDetails = async() => {
        try {
            this.realm = await Realm.open({
                path: realmStorePath,
                schema: [
                    ListSchemas.listSchema,
                    ListSchemas.listItemsSchema,
                    ListSchemas.unitSymbolSchema,
                    ListSchemas.listItemsCategoriesSchema,
                    ListSchemas.currencySchema
                ],
            });
            // console.log('ddd');
            // console.log("Realm is located at: " + this.realm.path);
            
            this.storedLists = this.realm.objects('list');
            
            this.storedListDetails = this.storedLists.filtered(`_id == '${this.props.listId}'`)[0];

            this.realm.write(() => {
                this.storedListDetails.lastViewed = new Date();
            });

            this.storedLists.addListener((lists,changes)=>{
                // Update UI in response to modified objects
                // `newModifications` contains object indexes from after they were modified
                // console.log(changes);
                changes.newModifications.forEach((index) => {
                    let modifiedList = lists[index];
                    // console.log(modifiedTask);
                    console.log(`modifiedTask: ${JSON.stringify(modifiedList, null, 2)}`);
                    if(!modifiedList.synced){
                        this.setState({
                            // isSynced: modifiedList.synced,
                            listDetails: modifiedList
                        })
                    }
                    // ...
                });
            });

            this.setState({
                isLoading: false,
                isOwner: this.storedListDetails.ownerId == getUniqueId(),
                // isSynced: this.storedListDetails.synced,
                listDetails: this.storedListDetails
            });
        } catch (error) {
            console.log('Error ==> ',error);
        }
    }

    getSyncedListDetails = async() => {
        try {
            this.syncedRealm = await Realm.open({
                sync: {
                    user: this.user,
                    partitionValue: "public"
                }, 
                error: (a,b)=> console.log(a,b),
                schema: [
                    ListSchemas.listSchema,
                    ListSchemas.listItemsSchema,
                    ListSchemas.unitSymbolSchema,
                    ListSchemas.listItemsCategoriesSchema,
                    ListSchemas.currencySchema
                ],
            });
            // console.log('ddd');
            // console.log("Realm is located at: " + this.realm.path);
            
            this.syncedStoredLists = this.syncedRealm.objects('list');
            
            let syncedLists = this.syncedStoredLists.filtered(`_id == '${this.props.listId}'`);

            if(syncedLists.length < 1){
                throw 'List Not Synced'
            }else{
                this.syncedStoredListDetails = syncedLists[0]
            }

            this.syncedRealm.write(() => {
                this.syncedStoredListDetails.lastViewed = new Date();
            });

            this.syncedStoredLists.addListener((lists,changes)=>{
                // Update UI in response to modified objects
                // `newModifications` contains object indexes from after they were modified
                // console.log(changes);
                changes.newModifications.forEach((index) => {
                    let modifiedList = lists[index];
                    // console.log(modifiedTask);
                    console.log(`modifiedTask: ${JSON.stringify(modifiedList, null, 2)}`);
                    this.setState({
                        isSynced: modifiedList.synced,
                        listDetails: modifiedList
                    })
                    // ...
                });
            });

            this.setState({
                isLoading: false,
                isOwner: this.syncedStoredListDetails.ownerId == getUniqueId(),
                // isSynced: this.storedListDetails.synced,
                listDetails: this.syncedStoredListDetails
            });
        } catch (error) {
            console.log('Error ==> ',error);
            this.syncedRealm.close();

            this.realm.write(() => {
                this.storedListDetails.synced = false;
                this.storedListDetails.dateModified = new Date();
                this.storedListDetails.lastActivityLog = `Un-Synced List From Cloud`;
            });
        }
    }

    syncListToRealm = async() => {
        try {
            this.syncedRealm = await Realm.open({
                sync: {
                    user: this.user,
                    partitionValue: "public"
                }, 
                error: (a,b)=> console.log(a,b),
                schema: [
                    ListSchemas.listSchema,
                    ListSchemas.listItemsSchema,
                    ListSchemas.unitSymbolSchema,
                    ListSchemas.listItemsCategoriesSchema,
                    ListSchemas.currencySchema
                ],
            });
            
            this.syncedStoredLists = this.syncedRealm.objects('list');

            let listCode = 'S' + randomString(5)

            let keepCheckingCode = true
            while(keepCheckingCode){
                let listObject = this.syncedStoredLists.filtered(`code == '${listCode}'`);
                if(listObject.length > 0){
                    this.wishlistCode = "S" + randomString(5)
                }else{
                    keepCheckingCode = false
                }
            }

            this.syncedRealm.write(() => {
                this.syncedStoredLists = this.syncedRealm.create("list", { 
                    // ...this.state.listDetails,
                    _id: this.state.listDetails._id,
                    _partition : this.state.listDetails._partition,
                    synced: true,
                    name: this.state.listDetails.name,
                    items: this.state.listDetails.items,
                    categories: this.state.listDetails.categories,
                    currency: this.state.listDetails.currency,
                    featureImage: this.state.listDetails.featureImage,
                    code: this.wishlistCode,
                    status: this.state.listDetails.status,
                    ownerId: this.state.listDetails.ownerId,
                    dateCreated: this.state.listDetails.dateCreated,
                    dateModified: new Date(),
                    lastViewed: this.state.listDetails.lastViewed,
                    lastActivityLog : `Synced List To Cloud`
                });
            });

            console.log('List Synched ass ===>', JSON.stringify(this.syncedStoredLists, null, 2));

            this.syncedStoredLists.addListener((lists,changes)=>{
                // Update UI in response to modified objects
                // `newModifications` contains object indexes from after they were modified
                // console.log(changes);
                changes.newModifications.forEach((index) => {
                    let modifiedList = lists[index];
                    // console.log(modifiedTask);
                    console.log(`modifiedTask: ${JSON.stringify(modifiedList, null, 2)}`);
                    this.setState({
                        isSynced: modifiedList.synced,
                        listDetails: modifiedList
                    })
                    // ...
                });
            });

            this.setState({
                isOwner: this.syncedStoredListDetails.ownerId == getUniqueId(),
                isSynced: true,
                listDetails: this.syncedStoredListDetails
            });
        } catch (error) {
            console.log('Error ==> ',error);
        }
    }

    updateListItem = (itemId, categoryId, itemKey, value) => {
        let itemIndex = this.state.listDetails.items.findIndex((item) => (item.id == itemId && item.category == categoryId))
        let itemsArray = [...this.state.listDetails.items]
        let item = JSON.parse(JSON.stringify(itemsArray[itemIndex]))
        itemsArray[itemIndex] = {
            ...item,
            [itemKey]: value
        }

        console.log(JSON.stringify(itemsArray, null, 2));

        this.realm.write(() => {
            this.storedListDetails.items = JSON.parse(JSON.stringify(itemsArray));
            this.storedListDetails.dateModified = new Date();
            this.storedListDetails.lastActivityLog = `Updated list item <${itemsArray[itemIndex].id}> - '${itemsArray[itemIndex].title}'`;
        });
        
        // this.setState(prevState => {
        //     // let fppp = JSON.parse(JSON.stringify(prevState.listDetails))
        //     // console.log({...JSON.parse(JSON.stringify(prevState.listDetails))});
        //     return ({
        //         listDetails: {
        //             ...JSON.parse(JSON.stringify(prevState.listDetails)),
        //             items: itemsArray
        //         }
        //     })
        // })
    }


    renderListDetails = (activeColorScheme) => (
        <View style={{flex: 1}}>
            <Header
                colors={activeColorScheme} 
                leftIcons = {['menu', this.state.isOwner ? 'syncPill' : 'starred']}
                isSynced = {this.state.isSynced}
                isSyncing = {this.state.isSyncing}
                isStarred = {this.state.isStarred}
                menuIconAction = {()=>{this.setState((prevState) => ({showActionsMenu: !prevState.showActionsMenu}))}}
                syncIconAction = {(this.state.isSyncing || this.state.isSynced) ? null : ()=>{this.setState({syncModal: true})}}
                starredIconAction = {()=> this.setState((prevState)=> ({isStarred : !prevState.isStarred}))}

                componentId = {this.props.componentId}
                />

            <View style={globalStyles.pageTitleWrapper}>
                <View><Text style={[globalStyles.pageTitleText, {color: activeColorScheme.textPrimary}]}>{this.state.listDetails.name}</Text></View>
            </View>


            {this.state.isOwner ? (<SyncModal 
                isVisible={this.state.syncModal}
                hideModalContentWhileAnimating={true}
                swipeDirection={'down'}
                animationIn= {'slideInUp'}
                animationInTiming={1}
                animationOut= {'slideOutDown'}
                animationOutTiming={500}
                backdropOpacity={0.21}
                onBackButtonPress= {()=> this.setState({syncModal: false})}
                onBackdropPress= {()=> this.setState({syncModal: false})}
                onSwipeComplete= {()=> this.setState({syncModal: false})}
                style={globalStyles.globalModalLayout}
            >
                <View style={[globalStyles.modalBg,{backgroundColor: activeColorScheme.modalBackground,}]}>
                    <View><Text style={[globalStyles.modalTitle, {color: activeColorScheme.textPrimary}]}>Sync Your List</Text></View>
                    <View><Text style={[styles.syncModalContentText, {color: activeColorScheme.textPrimary}]}>Syncing your list to the Smart Shopper cloud means you can now share you shopping list with other users. This also means giving them access to mark list items as done/completed</Text></View>
                    <View><Text style={[styles.syncModalContentText, {color: activeColorScheme.textPrimary}]}>You will need an internet connection to sync the current state of your local list to the cloud</Text></View>
                    
                    <View style={styles.syncModalBtnWrapper}>
                        <Button 
                            content={{text:'Sync List'}} 
                            theme={this.props.theme} 
                            colors={activeColorScheme} 
                            colorScheme={this.props.colorScheme}
                            onPress= {async()=>{
                                this.realm.write(() => {
                                    this.storedListDetails.synced = true;
                                    this.storedListDetails.dateModified = new Date();
                                    this.storedListDetails.lastActivityLog = `Synced List To Cloud`;
                                });


                                try{
                                    // const mongo = realmApp.currentUser.mongoClient(mongoClientCluster);
                                    // const collection = mongo.db("lysts").collection("smartshopper_lists");

                                    // const result = await collection.insertOne(this.state.listDetails);

                                    // console.log(`Successfully inserted item with _id: ${result.insertedId}`)
                                    
                                    // this.setState({syncModal:false})

                                    await this.syncListToRealm()
                                }catch(error){
                                    console.log('Error Syncing List ---> ', error);
                                    this.realm.write(() => {
                                        this.storedListDetails.synced = false;
                                        this.storedListDetails.dateModified = new Date();
                                        this.storedListDetails.lastActivityLog = `Tried Syncing List To Cloud`;
                                    });
                                }finally{
                                    this.props.refreshView();
                                }
                            }}
                        />
                    </View>
                </View>
            </SyncModal>) : null }

            <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.scrollViewContainer} showsVerticalScrollIndicator={false} snapToEnd>
                {this.state.listDetails.categories.map((category, i) => {
                    return (
                        <View key={i}>
                            <View style={globalStyles.categoryWrapper}>
                                <Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>{category.categoryName}</Text>
                                {i == 0 ? <OpacityLinks hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} onPress={() => this.setState(prevState => ({showPrice: !prevState.showPrice}))}><View><Text style={[styles.priceToggle, {color:this.props.theme.primaryColor}]}> {this.state.showPrice ? 'Show Units' : 'Show Prices'}</Text></View></OpacityLinks> : null}
                            </View>

                            {
                                this.state.listDetails.items.map((item, key) => {
                                    {/* typeof parseFloat(item.price) == 'number' ? totalPrice += parseFloat(item.price) : null; */}
                                    return item.category == category.categoryId ? (
                                        <OpacityLinks key={key} onPress={() => this.updateListItem(item.id, category.categoryId, "status", item.status == 'active' ? 'inactive' : 'active')}>
                                            <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                                                <View style={globalStyles.listItemLeft}>
                                                    <View style={{marginRight: 10}}>
                                                        <CheckedIcon checkedStatus={!(item.status == 'active')} theme={this.props.theme} />
                                                    </View>
                                                    <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, item.status == 'active' ? {color: activeColorScheme.textPrimary} : globalStyles.listItemTitleCrossed]}>{item.title}</Text></View>
                                                </View>
                                                <View style={globalStyles.listItemRight}>
                                                    <Text style={globalStyles.listItemSubtext}>
                                                        {   
                                                            this.state.showPrice 
                                                            ? `${this.state.listDetails.currency.symbol} ${item.price}` 
                                                            : `${item.units} ${item.unitSymbol.symbol}`
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        </OpacityLinks>
                                    ) : null
                                })
                            }
                        </View>
                    )
                })}

                <View style={styles.priceTotalWrapper}>
                    <Text style={[styles.priceTotalText, {color: activeColorScheme.textPrimary}]}>Total Price (Est):  </Text><Text style={[styles.priceTotalValue,{color: activeColorScheme.textPrimary}]}>{this.state.listDetails.currency.symbol} {(Math.round(this.totalPrice * 100) / 100).toFixed(2)}</Text>
                </View>
            </ScrollView>

            {this.state.showActionsMenu ? (<FloatingButtonView 
                type='multiButtons'
                contents={this.state.isOwner ? [
                    {text: 'Share', icon: ShareIcon, onPress:()=>{onShare('Share your list', `${this.state.listDetails.code} is my list code on SmartShopper. Take a look!`, 'Check out my SmartShopper list')}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isSynced, disabledPressAction: ()=>{this.setState({syncModal: true})}},
                    {text: 'Copy', icon: CopyIcon, onPress:()=>{Clipboard.setString(this.state.listDetails.code)}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isSynced, disabledPressAction: ()=>{this.setState({syncModal: true})}},
                    {text: 'Edit', icon:  EditIcon, onPress:()=>{navigateToScreen(
                            this.props.componentId,
                            'com.mbr.smartshopper.screen.listCreation',
                            {
                                refreshView: ()=>{
                                    this.props.refreshView();
                                    this.state.isSynced ? this.getSyncedListDetails().then(()=>{
                                        this.totalPrice = 0;
                                        this.state.listDetails.items.map(item => {
                                            (item.price && item.price.trim() != '') ? this.totalPrice += parseFloat(item.price) : null;
                                            this.forceUpdate()
                                        })
                                    }) : this.getLocalListDetails().then(()=>{
                                        this.totalPrice = 0;
                                        this.state.listDetails.items.map(item => {
                                            (item.price && item.price.trim() != '') ? this.totalPrice += parseFloat(item.price) : null;
                                            this.forceUpdate()
                                        })
                                    });
                                },
                                showAsEdit: true,
                                listId: this.state.listDetails._id,
                                isSynced: this.state.isSynced,
                            }
                        )}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isOwner, disabledPressAction: ()=>{/* Do Nothing */}},
                    {text: 'Delete', icon: TrashIcon, onPress:()=>{
                            this.realm.write(() => {
                                // Delete the task from the realm.
                                this.realm.delete(this.storedListDetails)
                                // Discard the reference.
                                // this.storedListDetails = null
                            });

                            this.realm.close();
                            this.props.refreshView();
                            Navigation.pop(this.props.componentId)
                        }, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isOwner, disabledPressAction: ()=>{/* Do Nothing */}
                    }
                ]
                : [
                    {text: 'Share', icon: ShareIcon, onPress:()=>{alert('pie')}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isSynced, disabledPressAction: ()=>{this.setState({syncModal: true})}},
                    {text: 'Copy', icon: CopyIcon, onPress:()=>{alert('pie')}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isSynced, disabledPressAction: ()=>{this.setState({syncModal: true})}}
                ]}
                showButtonLabels={this.state.showButtonLabels}
                theme={this.props.theme} 
                colors={activeColorScheme} 
            />) : null}
        </View>
    )

    renderLoader= (activeColorScheme) => {
        this.props.isSynced ? this.getSyncedListDetails().then(()=>{
            this.totalPrice = 0;
            this.state.listDetails.items.map(item => {
                (item.price && item.price.trim() != '') ? this.totalPrice += parseFloat(item.price) : null;
                this.forceUpdate()
            })
        }) : this.getLocalListDetails().then(()=>{
            this.totalPrice = 0;
            this.state.listDetails.items.map(item => {
                (item.price && item.price.trim() != '') ? this.totalPrice += parseFloat(item.price) : null;
                this.forceUpdate()
            })
        });
        return (
            <View style={{flex: 1}}>
                <View><Text style={[styles.searchTitle, {color: activeColorScheme.textPrimary}]}>Searching...</Text></View>
                <LottieView 
                    source={require('../../assets/lottie/30206-loading.json')} 
                    autoPlay loop
                    style={styles.emptyStateAnimation}
                    speed={0.5}
                />
                {/* {this.getLocalListDetails()} */}
            </View>
        )
    }

    render() {
        let activeColorScheme = colorScheme[this.props.colorScheme == 'dark' ? 'dark' : 'light']
        return (
            <View style={[globalStyles.container, {backgroundColor: activeColorScheme.background }]}>
                {
                    this.state.isLoading 
                    ? this.renderLoader(activeColorScheme)
                    : this.renderListDetails(activeColorScheme)
                }
                {/* {alert(this.totalPrice)} */}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    colorScheme: state.ui.colorScheme,
    theme: state.ui.theme,
    themeColorName: state.ui.themeColorName
})

const mapDispatchToProps = (dispatch) => {
    return {
        // setColorSchemeDispatch: () => dispatch(setColorScheme())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDetails)

const styles = StyleSheet.create({
    searchTitle:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 28,
    },


    priceToggle:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 15
    },

    priceTotalWrapper:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingHorizontal: 3
    },
    priceTotalText:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 15,
        lineHeight: 25,
    },
    priceTotalValue:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 24,
        lineHeight: 29,
    },

    // syncModalBgWrapper:{
    //     flex: 1, 
    //     backgroundColor: 'transparent',
    //     justifyContent: 'flex-end'
    // },
    // syncModalBg:{
    //     paddingHorizontal: 26,
    //     paddingTop: 48,
    //     paddingBottom: 30,
    //     borderTopLeftRadius: 13,
    //     borderTopRightRadius: 13,
    //     elevation: -10
    // },
    // syncModalTitle:{
    //     fontFamily: 'Gilroy-Medium', 
    //     fontSize: 22,

    //     marginBottom: 17
    // },
    syncModalContentText:{
        fontFamily: 'Gilroy-Medium', 
        fontSize: 15.5,
        lineHeight: 19,

        paddingBottom: 10,
        opacity: 0.86
    },
    syncModalBtnWrapper:{
        marginTop: 30,
        marginBottom: 20
    }

    
})
