import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, Appearance, ScrollView, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from "react-native-navigation";
import LottieView from 'lottie-react-native';
import {getColorFromURL} from 'rn-dominant-color'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUniqueId} from 'react-native-device-info';
import {ObjectId} from 'bson';
import ImportModal from 'react-native-modal'
import Realm from "realm";
import * as RNFS from 'react-native-fs';
import Svg, { Path } from "react-native-svg";
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isInProgress,
    types,
  } from 'react-native-document-picker';

// ***** Component Imports *****
// Icons and Vectors 
// import SearchIcon from '../../vectors/generalIcons/searchIcon';
// import {SettingsIcon} from '../../vectors/generalIcons'

// Components 
import Header from '../../components/header'
import FloatingButtonView from '../../components/buttons/floatingButtonView'
import Button from '../../components/buttons/singleButton'
import ShoppingLists from '../../components/home/shoppingLists'
import {colorScheme, globalStyles} from '../../components/uiComponents'

import {ListSchemas, OldListSchemas} from '../../realm-storage/schemas'

// Includes 
import {updateComponentAppearance, navigateToScreen} from '../../includes/functions';
import {dWidth, dHeight, realmStorePath, asyncStores} from '../../includes/variables';
import { OpacityLinks } from '../../components/links';

class Home extends Component {
    state={
        // color: '#000000',
        // text: this.props.colorScheme,
        // items: true,
        shoppingLists : [],
        starredLists: [],
        importFiles: [],
        importContent: null,
        isValidImport: false,
        invalidReason: null,

        importModal: false,
        showImportAction: false,
    }

    componentDidMount(){
        updateComponentAppearance(this.props);
        this.getListsFromStore();
        this._loadFiles();
    }

    componentDidUpdate(prevProps){
        if(prevProps.colorScheme != this.props.colorScheme){
            updateComponentAppearance(this.props);
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
        }).then(async(realm) => {
            let shoppingLists = realm.objects('list').sorted("dateCreated",true);
            let starredLists = [];

            try {
                starredLists = JSON.parse(await AsyncStorage.getItem(asyncStores.starredLists));
                
                if(!Array.isArray(starredLists)) starredLists = [];
            } catch (error) {
                starredLists = [];
            }
            
            shoppingLists.addListener((list,changes)=>{
                // Update UI in response to inserted objects
                // changes.insertions.forEach((index) => {
                //     let insertedLists = list[index];

                //     console.log(
                //       `insertedList: ${JSON.stringify(insertedLists, null, 2)}`
                //     );
                // });

                // console.log('Insertions ==> ', changes);
            });

            // console.log('Starred lists', starredLists);

            this.setState({shoppingLists, starredLists})
            // realm.close();
        }).catch(e => {
            if(__DEV__) console.log(e);
        })
    }

    renderView = (activeColorScheme) =>{
        let renderView;
        
        if ((!this.state.shoppingLists || this.state.shoppingLists.length < 1)) {
            let ArrowIcon = require('../../vectors/generalIcons').ArrowIcon;
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
                        <View><Text style={[styles.emptyStateText, {color: activeColorScheme.noInfoText }]}>Let's Create a New List</Text></View>
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
                    {(!this.state.starredLists || this.state.starredLists.length < 1) ? null : <View><Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>Your Starred Lists</Text></View>}
                    
                    {this.state.shoppingLists.map((item, key) => {
                      return this.state.starredLists.includes(item._id) ? (
                        <ShoppingLists 
                            key={key + 1000}
                            colors={activeColorScheme} 
                            starred={true}
                            newScreenProps={{componentId: this.props.componentId}} 
                            itemsCount = {item.items.length}
                            featureImage = {item.featureImage}
                            listName = {item.name}
                            listId = {item._id}
                            loadOnView= {item.synced}
                            // isSynced= {item.synced}
                            // isOwner = {item.ownerId == getUniqueId()}
                            refreshView= {() => this.getListsFromStore()}
                        />
                      ) : null
                    })}

                    {/* <ShoppingLists colors={activeColorScheme} starred={true} newScreenProps={{componentId: this.props.componentId}} /> */}

                    {(!this.state.shoppingLists || this.state.shoppingLists.length < 1 || this.state.shoppingLists.length == this.state.starredLists.length) ? null : <View><Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>Recently Created</Text></View>}

                    {/* <ShoppingLists colors={activeColorScheme} newScreenProps={{componentId: this.props.componentId}} />
                    <ShoppingLists colors={activeColorScheme} newScreenProps={{componentId: this.props.componentId}} />
                    <ShoppingLists colors={activeColorScheme} newScreenProps={{componentId: this.props.componentId}} /> */}

                    {this.state.shoppingLists.map((item, key) => {
                      return this.state.starredLists.includes(item._id) ? null : (
                        <ShoppingLists 
                            key={key}
                            colors={activeColorScheme} 
                            newScreenProps={{componentId: this.props.componentId}} 
                            itemsCount = {item.items.length}
                            featureImage = {item.featureImage}
                            listName = {item.name}
                            listId = {item._id}
                            loadOnView= {item.synced}
                            // isSynced= {item.synced}
                            // isOwner = {item.ownerId == getUniqueId()}
                            refreshView= {() => this.getListsFromStore()}
                        />
                      )
                    })}

            </ScrollView>)
        }
       

        return renderView;
    }

    _loadFiles = async () => {
        if (Platform.OS === 'ios') {
            await this._moveInboxFiles();
        }
    
        RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then((srcFiles) => {
            let importFiles = [];
            srcFiles.map((file) => {
            // console.log(file);
                if (file.isFile() && file.name.indexOf('.smartlist') >= 0) {
                    importFiles.push(file);
                    // console.log(file);
                    // return Promise.all([RNFS.stat(file.path), file.path]);
                }
            });
            this.setState({ importFiles });
            // console.log('files ==> ', this.state.files);
            // console.log('importFiles ==> ', importFiles);

            if (importFiles.length > 0) {
                return Promise.all([RNFS.stat(importFiles[0].path), importFiles[0].path]);
            }else{
                throw {message: 'No files found'}
            }
        })
        .then((statResult) => {
            if (statResult[0].isFile()) {
              // if we have a file, read it
              return RNFS.readFile(statResult[1], 'utf8');
            }else{
                throw {message: 'Result is not a file'}
            }
        })
        .then(async (contents) => {
            // log the file contents
            // console.log(contents);
            let importContent;
            let isValidImport = true;

            try {
                importContent = JSON.parse(contents);
            } catch (error) {
                // console.log(error);
                importContent = {
                    name: false,
                    items: false,
                    categories: false,
                    currency: false,
                    featureImage: false
                }
            }

            if (!importContent?.name || !importContent?.items || !importContent?.categories || !importContent?.currency || !importContent?.featureImage){
                isValidImport = false
            }

            this.setState({
                importContent,
                isValidImport,
                invalidReason: isValidImport ? null : 'The file seems to contain an invalid smartlist',
                importModal: true
            })

            if (this.state.importFiles.length > 0) {
                for (const file of this.state.importFiles) {
                    try {
                        let filename = file.name;
                        await RNFS.unlink(file.path);
                        if(__DEV__) console.log(` ${filename} FILE DELETED`);
                    } catch (err) {
                        if(__DEV__) console.log(err.message, err.code);
                    }
                }
            }

            // this.setState({importFiles: []})
        })
        .catch(err => {
            if(__DEV__) console.log(`Error: ${err.message} ${err.code ? '- ' + err.code : ''}`);
        });
    };

    _moveInboxFiles = async () => {
        try {
            const inboxFiles = await RNFS.readDir(RNFS.DocumentDirectoryPath + '/Inbox');
            if (inboxFiles) {
                inboxFiles.map(async file => {
                    if (file.isFile()) {
                        await RNFS.moveFile(
                        file.path,
                        `${RNFS.DocumentDirectoryPath}/${file.name}`
                        );
                    }
                });
            }
        } catch (err) {
            if(__DEV__) console.log(err.message, err.code);
        }
    };

    openFileSelectionImport = () =>{
        DocumentPicker.pickSingle({
            type: 'application/octet-stream',
            mode: 'open',
            copyTo: "cachesDirectory"
        }).then(res => {
            // console.log('Result ==> ', res)
            let fileCopyUri = res.fileCopyUri;
            let fileName = res.name;

            this.setState({importFiles:[{...res}]})

            try{
                if(!(res.name.indexOf('.smartlist') >= 0)){
                    throw {message: 'This is not a smartlist file'}
                }
                
                RNFS.stat(res.fileCopyUri).then((statResult) => {
                    // console.log(statResult);
                    if (statResult.isFile()) {
                        // if we have a file, read it
                        return RNFS.readFile(statResult.path, 'utf8');
                    }else{
                        throw {message: 'Seems you didn\'t select a file'}
                    }
                })
                .then(async (contents) => {
                    // log the file contents
                    // console.log(contents);
                    let importContent;
                    let isValidImport = true;

                    try {
                        importContent = JSON.parse(contents);
                    } catch (error) {
                        // console.log(error);
                        importContent = {
                            name: false,
                            items: false,
                            categories: false,
                            currency: false,
                            featureImage: false
                        }
                    }

                    if (!importContent?.name || !importContent?.items || !importContent?.categories || !importContent?.currency || !importContent?.featureImage){
                        isValidImport = false
                    }

                    
                    this.setState({
                        importContent
                    })

                    RNFS.unlink(fileCopyUri).then(() => {
                        if(__DEV__) console.log(` ${fileName} FILE DELETED`);
                    }).catch(() => {
                        if(__DEV__) console.log(err.message, err.code);
                    });

                    if(!isValidImport) throw {message: 'The file seems to contain an invalid smartlist'}

                    this.setState({
                        isValidImport: true,
                        invalidReason: null,
                        importModal: true
                    });

                })
                .catch((e) => {
                    this.setState({
                        isValidImport: false,
                        invalidReason: e.message,
                        importModal: true
                    })
                });
            }
            catch (e){
                this.setState({
                    isValidImport: false,
                    invalidReason: e.message,
                    importModal: true
                })
            }
            
        }).catch(err => {
            if(__DEV__) console.log('Error ==> ', err)
        })
    }
    
    render() {
        let activeColorScheme = colorScheme[this.props.colorScheme == 'dark' ? 'dark' : 'light']
        return (
            <View style={[globalStyles.container, {backgroundColor: activeColorScheme.background }]}>
                <Header 
                    colors={activeColorScheme} 
                    title = {'Shopping Lists'}
                    hideBackButton = {true}
                    leftIcons = {['settings', 'import']}
                    showImportModal = {async () => {
                        try{
                            let isFirstClick = await AsyncStorage.getItem(asyncStores.firstImportClick);
                            if(typeof isFirstClick == 'undefined' || isFirstClick == null || isFirstClick.trim() == '' || isFirstClick.trim() == 'false'){
                                throw 'Not first click'
                            }else{
                                this.openFileSelectionImport();
                            }
                        } catch (e){
                            this.setState({showImportAction: true})
                            AsyncStorage.setItem(asyncStores.firstImportClick, 'true')
                        }
                    }}

                    componentId={this.props.componentId}
                />

                
                {this.renderView(activeColorScheme)}

                <ImportModal 
                    isVisible={this.state.importModal}
                    hideModalContentWhileAnimating={true}
                    swipeDirection={'down'}
                    animationIn= {'slideInUp'}
                    animationInTiming={1}
                    animationOut= {'slideOutDown'}
                    animationOutTiming={500}
                    backdropOpacity={0.21}
                    onBackButtonPress= {()=> this.setState({importModal: false})}
                    onBackdropPress= {()=> this.setState({importModal: false})}
                    onSwipeComplete= {()=> this.setState({importModal: false})}
                    style={globalStyles.globalModalLayout}
                >
                    <View style={[globalStyles.modalBg,{backgroundColor: activeColorScheme.modalBackground,}]}>
                        <View><Text style={[globalStyles.modalTitle, {color: activeColorScheme.textPrimary}]}>Import List From File</Text></View>
                        <View>
                            <Text style={[globalStyles.modalContentText, {color: activeColorScheme.textPrimary}]}>
                                {
                                    this.state.isValidImport
                                    ? 'An import file was found containing the SmartList below. Do you want to import it into your app or close this modal to cancel?'
                                    : 'There seems to be an issue with the file you tried to import'
                                }
                            </Text>
                        </View>
                        {   
                            this.state.isValidImport
                            ? (
                                <View>
                                  <View style={{marginVertical: 20}}>
                                    <ShoppingLists
                                        colors={activeColorScheme} 
                                        starred={true}
                                        newScreenProps={{componentId: this.props.componentId}} 
                                        itemsCount = {this.state.importContent?.items?.length}
                                        featureImage = {this.state.importContent?.featureImage}
                                        listName = {this.state.importContent?.name}
                                        listId = {this.state.importContent?._id}
                                        loadOnView= {this.state.importContent?.synced}
                                        // isSynced= {item.synced}
                                        // isOwner = {item.ownerId == getUniqueId()}
                                        refreshView= {() => {}}
                                        isImportModal = {true}
                                    />
                                  </View>
                                  <View style={globalStyles.syncModalBtnWrapper}>
                                    <Button 
                                        content={{text:'Import List'}} 
                                        theme={this.props.theme} 
                                        colors={activeColorScheme} 
                                        colorScheme={this.props.colorScheme}
                                        onPress= {()=>{
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
                                                realm.write(() => {
                                                    realm.create("list", {
                                                        _id: new ObjectId().toHexString(),
                                                        _partition : 'public',
                                                        synced: false,
                                                        name: this.state.importContent?.name?.trim(),
                                                        items: this.state.importContent?.items,
                                                        categories: this.state.importContent?.categories,
                                                        currency: this.state.importContent?.currency ,
                                                        featureImage: this.state.importContent?.featureImage,
                                                        code: '',
                                                        status: "active",
                                                        ownerId: getUniqueId(),
                                                        dateCreated: this.state.importContent?.dateCreated || new Date(),
                                                        dateModified: new Date(),
                                                        lastViewed: new Date(),
                                                        lastActivityLog: 'Imported list from smartlist file'
                                                    })
                                                    
                                                })

                                                // realm.close();
                                                // this.props.refreshView();
                                                // Navigation.pop(this.props.componentId);
                                            }).catch(e => {
                                                if(__DEV__) console.log(e);
                                            }).finally(() =>{
                                                this.getListsFromStore();
                                                this.setState({importModal: false})
                                            })
                                        }}
                                    />
                                  </View>
                                </View>
                            )
                            : (
                                <View style={styles.invalidFilenameContainer}>
                                    <View>
                                        <Svg
                                            width={40}
                                            height={40}
                                            viewBox="0 0 40 40"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <Path
                                                d="M10 7.5a5 5 0 0 1 5-5h8.965a3.75 3.75 0 0 1 2.65 1.1l7.288 7.285A3.75 3.75 0 0 1 35 13.535V32.5a5 5 0 0 1-5 5h-8.342a13.852 13.852 0 0 0 2.7-2.5H30a2.5 2.5 0 0 0 2.5-2.5V15h-6.25a3.75 3.75 0 0 1-3.75-3.75V5H15a2.5 2.5 0 0 0-2.5 2.5v5.055c-.846.076-1.683.231-2.5.463V7.5Zm16.25 5h5.733L25 5.518v5.732a1.25 1.25 0 0 0 1.25 1.25ZM5.795 18.295a11.25 11.25 0 1 0 15.91 15.91 11.25 11.25 0 0 0-15.91-15.91ZM18.17 30.67a1.25 1.25 0 0 1-1.767 0l-2.653-2.65-2.65 2.65a1.25 1.25 0 0 1-1.77-1.768l2.65-2.652-2.65-2.65a1.25 1.25 0 1 1 1.768-1.77l2.652 2.65 2.65-2.65a1.25 1.25 0 0 1 1.77 1.768l-2.65 2.652 2.65 2.65a1.25 1.25 0 0 1 0 1.77Z"
                                                fill="#E63950"
                                            />
                                        </Svg>
                                    </View>
                                    <View >
                                        <Text style={styles.invalidFilename}>{this.state.importFiles[0]?.name || 'File not found'}</Text>
                                        {this.state.invalidReason ? (<View><Text style={[styles.invalidFilename, {fontSize: 14, marginTop: 4}]}>{this.state.invalidReason}</Text></View>) : null}
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </ImportModal>

                <ImportModal 
                    isVisible={this.state.showImportAction}
                    hideModalContentWhileAnimating={true}
                    swipeDirection={'down'}
                    animationIn= {'slideInUp'}
                    animationInTiming={1}
                    animationOut= {'slideOutDown'}
                    animationOutTiming={500}
                    backdropOpacity={0.21}
                    onBackButtonPress= {()=> this.setState({showImportAction: false})}
                    onBackdropPress= {()=> this.setState({showImportAction: false})}
                    onSwipeComplete= {()=> this.setState({showImportAction: false})}
                    style={globalStyles.globalModalLayout}
                >
                    <View style={[globalStyles.modalBg,{backgroundColor: activeColorScheme.modalBackground,}]}>
                        <View><Text style={[globalStyles.modalTitle, {color: activeColorScheme.textPrimary}]}>Did you know?</Text></View>
                        <View style={{marginBottom: 16}}>
                            <Text style={[globalStyles.modalContentText, {color: activeColorScheme.textPrimary}]}>
                                You can import lists from smartlist files on your device. Click the button below to continue
                            </Text>
                        </View>
                        <View style={[globalStyles.syncModalBtnWrapper, {marginBottom: 16}]}>
                            <Button 
                                content={{text:'Select Import File'}} 
                                theme={this.props.theme} 
                                colors={activeColorScheme} 
                                colorScheme={this.props.colorScheme}
                                onPress= {()=> {
                                    this.setState({showImportAction: false}, () => this.openFileSelectionImport())
                                }}
                            />
                        </View>
                    </View>
                </ImportModal>
                

                {(this.state.shoppingLists.length < 1) ? null : (<FloatingButtonView 
                    type='singleButton'
                    content={{text:'Create new list'}} 
                    theme={this.props.theme} 
                    colors={activeColorScheme} 
                    colorScheme= {this.props.colorScheme}
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
        marginTop : 8
    },
    emptyStateText:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 24,
        opacity: 0.9,

        marginBottom: 10
    },

    invalidFilenameContainer:{
        backgroundColor: '#FEE2DB',
        paddingVertical: 16,
        paddingHorizontal: 26,
        marginHorizontal: -26,
        marginTop: 16,
        marginBottom: 30,

        flexDirection: 'row',
        alignItems:'center'
    }, 
    invalidFilename:{
        fontFamily: 'Gilroy-Medium',
        fontSize: 16,
        marginStart: 10,
        color: '#E63950'
    }
})
