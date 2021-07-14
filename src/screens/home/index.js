import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, Appearance, ScrollView, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from "react-native-navigation";
import LottieView from 'lottie-react-native';
import {getColorFromURL} from 'rn-dominant-color'
import {getUniqueId} from 'react-native-device-info';
import Realm from "realm";

// ***** Component Imports *****
// Icons and Vectors 
// import SearchIcon from '../../vectors/generalIcons/searchIcon';
// import {SettingsIcon} from '../../vectors/generalIcons'

// Components 
import Header from '../../components/header'
import FloatingButtonView from '../../components/buttons/floatingButtonView'
import ShoppingLists from '../../components/home/shoppingLists'
import {colorScheme, globalStyles} from '../../components/uiComponents'

import {ListSchemas, OldListSchemas} from '../../realm-storage/schemas'

// Includes 
import {updateStatusBarAppearance, navigateToScreen} from '../../includes/functions';
import {dWidth, dHeight, realmStorePath} from '../../includes/variables';
import { OpacityLinks } from '../../components/links';

class Home extends Component {
    state={
        color: '#000000',
        text: this.props.colorScheme,
        items: true,

        shoppingLists : [],
        starredList: [],
    }

    componentDidMount(){
        updateStatusBarAppearance(this.props);

        this.getListsFromStore();
    }

    componentDidUpdate(prevProps){
        if(prevProps.colorScheme != this.props.colorScheme){
            updateStatusBarAppearance(this.props);
        }
    }

    getListsFromStore = () => {
        Realm.open({
            path: realmStorePath,
            schema: [
                ListSchemas.listSchema,
                ListSchemas.listItemsSchema,
                ListSchemas.unitSymbolSchema,
                ListSchemas.listItemsCategoriesSchema,
                ListSchemas.currencySchema
            ]
        }).then(realm => {
            let shoppingLists = realm.objects('list').sorted("dateCreated",true);
            
            shoppingLists.addListener((list,changes)=>{
                // Update UI in response to inserted objects
                changes.insertions.forEach((index) => {
                    let insertedLists = list[index];

                    console.log(
                      `insertedList: ${JSON.stringify(insertedLists, null, 2)}`
                    );
                });

                console.log('Insertions ==> ', changes);
            });

            this.setState({shoppingLists})
            // realm.close();
        }).catch(e => {
            console.log(e);
        })
    }

    renderView = (activeColorScheme) =>{
        let renderView = <View></View>
        
        if ((!this.state.shoppingLists || this.state.shoppingLists.length < 1) && (!this.state.starredList || this.state.starredList.length < 1)) {
            let ArrowIcon = require('../../vectors/generalIcons').ArrowIcon;
            // let path = `../../assets/lottie/51382-astronaut-light-theme.json`;
            renderView = (<View style={styles.emptyStateWrapper}>
                <LottieView 
                    source={require('../../assets/lottie/astronaout.json')} 
                    autoPlay loop
                    style={styles.emptyStateAnimation}
                    speed={1}
                    
                />
                <OpacityLinks onPress={()=> {
                    navigateToScreen(this.props.componentId,'com.mbr.smartshopper.screen.listCreation',{
                        refreshView: () => this.getListsFromStore()
                    })
                }}>
                    <View style={styles.emptyStateTextWrapper}>
                        <View><Text style={[styles.emptyStateText, {color: this.props.colorScheme == 'dark' ? "#C6DAFF" : this.props.theme.primaryColor}]}>Let's Create a New List</Text></View>
                        <View><ArrowIcon width={38} height={38} colorScheme={this.props.colorScheme} theme={this.props.theme} /></View>
                    </View> 
                </OpacityLinks>
                
            </View>)
        } else{
            renderView = (<ScrollView 
                    style={globalStyles.scrollView} 
                    contentContainerStyle={globalStyles.scrollViewContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {(!this.state.starredList || this.state.starredList.length < 1) ? null : <View><Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>Your Starred Lists</Text></View>}

                    {/* <ShoppingLists colors={activeColorScheme} starred={true} newScreenProps={{componentId: this.props.componentId}} /> */}

                    {(!this.state.shoppingLists || this.state.shoppingLists.length < 1) ? null : <View><Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>Recently Created</Text></View>}

                    {/* <ShoppingLists colors={activeColorScheme} newScreenProps={{componentId: this.props.componentId}} />
                    <ShoppingLists colors={activeColorScheme} newScreenProps={{componentId: this.props.componentId}} />
                    <ShoppingLists colors={activeColorScheme} newScreenProps={{componentId: this.props.componentId}} /> */}

                    {this.state.shoppingLists.map((item, key) => (
                        <ShoppingLists 
                            key={key}
                            colors={activeColorScheme} 
                            newScreenProps={{componentId: this.props.componentId}} 
                            itemsCount = {item.items.length}
                            featureImage = {item.featureImage}
                            listName = {item.name}
                            listId = {item._id}
                            loadOnView= {item.synced}
                            isSynced= {item.synced}
                            isOwner = {item.ownerId == getUniqueId()}
                            refreshView= {() => this.getListsFromStore()}
                        />
                    ))}

            </ScrollView>)
        }
       

        return renderView;
    }
    
    render() {
        let activeColorScheme = colorScheme[this.props.colorScheme == 'dark' ? 'dark' : 'light']
        return (
            <View style={[globalStyles.container, {backgroundColor: activeColorScheme.background }]}>
                <Header 
                    colors={activeColorScheme} 
                    title = {'Shopping Lists'}
                    hideBackButton = {true}
                    leftIcons = {['settings', 'search']}

                    componentId={this.props.componentId}
                />

                
                {this.renderView(activeColorScheme)}
                

                {(this.state.shoppingLists.length < 1) && (this.state.starredList.length < 1) ? null : (<FloatingButtonView 
                    type='singleButton'
                    content={{text:'Create new list'}} 
                    theme={this.props.theme} 
                    colors={activeColorScheme} 
                    onPress= {()=>{
                        navigateToScreen(this.props.componentId,'com.mbr.smartshopper.screen.listCreation',{
                            refreshView: () => this.getListsFromStore()
                        })
                    }}
                />)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({

    emptyStateWrapper:{
        flex: 1,
        // backgroundColor:'red',
        justifyContent: 'center',
        alignItems: 'center',

        position: 'absolute',
        top: -(dHeight / 15),
        left: 26,
        right: 26,
        bottom: 0
    },
    emptyStateAnimation:{
        width: dWidth / 1.2,
        maxWidth: 500,
        position: 'relative'
        
    },
    emptyStateTextWrapper:{
        alignItems: 'center',
        marginTop : 5
    },
    emptyStateText:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 24,
        opacity: 0.9,

        marginBottom: 10
    }
})
