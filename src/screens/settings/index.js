import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, Linking, Image, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CharityModal from 'react-native-modal'

import Header from '../../components/header';
import {globalStyles, colorScheme, theme} from '../../components/uiComponents'
import {ThemeSelectorModal, ItemSelectionModal} from '../../components/modals'
import {OpacityLinks} from '../../components/links'
import CreditIcon from '../../vectors/creditIcon'
import Button from '../../components/buttons/singleButton'

import {setTheme, setColorScheme} from '../../store/actions'

// Includes 
import {updateComponentAppearance, onShare} from '../../includes/functions';
import {currencies, customItemId, displayModes, asyncStores, charities, dHeight} from '../../includes/variables';

export class Settings extends Component {

    state= {
        showThemeModal: false,
        showDisplayModal: false,
        displayMode: {
            display: '',
            type:''
        },
        showCurrencyModal: false,
        currencyModalOpenedOnce: false,
        defaultCurrency: {
            id: null,
            display: ''
        },

        charityModal: false,
        charityOrg: {
            id: 0,
            displayName: '',
            fullName: '',
            organizationSite: '',
            donationSite: '',
            orgLogo: '',
            description: ''
        }
    }

    componentDidMount(){
        // updateComponentAppearance(this.props);

        this.setState({charityOrg: charities[Math.floor(Math.random() * charities.length)]})

        AsyncStorage.getItem(asyncStores.currency).then((val) => {
            let defaultCurrency = JSON.parse(val);
            let currencyFound = {
                display: '',
                id: 0
            };

            currencies.map((item) => {
                if (item.id == defaultCurrency.id){
                    currencyFound = {
                        display: `${item.name} (${item.symbol})`,
                        id: item.id
                    }
                }
            })
            
            if (currencyFound.display.trim() == '') {
                currencyFound = {
                    display: defaultCurrency.symbol,
                    id: defaultCurrency.id
                }
            }

            this.setState({
                defaultCurrency: currencyFound
            })
        }).catch((e)=>{/* Do Nothing */})

        AsyncStorage.getItem(asyncStores.colorScheme).then((val)=>{
            this.renderDisplayMode(val)
        }).catch((e) => {/* Do Nothing */})

    }

    componentDidUpdate(prevProps){
        if(prevProps.colorScheme != this.props.colorScheme){
            updateComponentAppearance(this.props);
        }
    }

    renderDisplayMode = (val) => {
        displayModes.map(item => {
            if (item.type == val) {
                this.setState({
                    displayMode: {
                        display: item.name,
                        type: item.type
                    }
                })
            }
        })
    }

    render() {
        let activeColorScheme = colorScheme[this.props.colorScheme == 'dark' ? 'dark' : 'light']
        return (
            <View style={[globalStyles.container, {backgroundColor: activeColorScheme.background }]}>
                <Header
                    colors={activeColorScheme} 
                    leftIcons = {[]}

                    componentId = {this.props.componentId}
                 />

                <View style={globalStyles.pageTitleWrapper}>
                    <View><Text style={[globalStyles.pageTitleText, {color: activeColorScheme.textPrimary}]}>Settings</Text></View>
                </View>

                <ThemeSelectorModal 
                    closeFunction = {()=>{this.setState({showThemeModal: false})}}
                    activeState={this.state.showThemeModal}
                    colorScheme = {activeColorScheme}
                    activeThemeName = {this.props.themeColorName}
                    setTheme = {this.props.setTheme}
                />

                {this.state.currencyModalOpenedOnce ? (<ItemSelectionModal
                    type= 'default'
                    subtype= 'currency'
                    closeFunction = {()=>{this.setState({showCurrencyModal: false})}}
                    activeState={this.state.showCurrencyModal}
                    colorScheme = {activeColorScheme}
                    theme = {this.props.theme}
                    defaultItem = {this.state.defaultCurrency}
                    // ddd = {(display, id) => {this.setState({defaultCurrency: {id: id,display: display}})}}
                    setDefaultItem = {({id, symbol, name, setCustomItem, closeFunction}) => {
                        AsyncStorage.setItem(asyncStores.currency, JSON.stringify({id,symbol})).then(() => {
                            setCustomItem ? setCustomItem('') : null;
                            this.setState({defaultCurrency: {id, display: `${name} (${symbol})`}});
                            closeFunction ? closeFunction() : null
                        }).catch((e)=>{/* Do Nothing */});
                    }}
                    customItem = {this.state.defaultCurrency.id == customItemId ? this.state.defaultCurrency.display : ''}
                />) : null}

                <ItemSelectionModal
                    type= 'display'
                    closeFunction = {()=>{this.setState({showDisplayModal: false})}}
                    activeState={this.state.showDisplayModal}
                    colorScheme = {activeColorScheme}
                    theme = {this.props.theme}

                    setColorScheme = {this.props.setColorScheme}
                    setDisplayMode = {(val)=>this.renderDisplayMode(val)}
                    activeDisplayMode = {this.state.displayMode.type}
                />

                <CharityModal 
                    isVisible={this.state.charityModal}
                    hideModalContentWhileAnimating={true}
                    swipeDirection={'down'}
                    animationIn= {'slideInUp'}
                    animationInTiming={1}
                    animationOut= {'slideOutDown'}
                    animationOutTiming={500}
                    backdropOpacity={0.21}
                    propagateSwipe={true}
                    onBackButtonPress= {()=> this.setState({charityModal: false})}
                    onBackdropPress= {()=> this.setState({charityModal: false})}
                    onSwipeComplete= {()=> this.setState({charityModal: false})}
                    style={globalStyles.globalModalLayout}
                >
                    <View style={[globalStyles.modalBg,{backgroundColor: activeColorScheme.modalBackground,}]}>
                        <View>
                            <View>
                                <Image 
                                    defaultSource = {require('../../assets/img/logo-placeholder.png')}
                                    source={{uri: this.state.charityOrg.orgLogo}}
                                    style={styles.charityModalLogo}
                                />
                            </View>
                        </View>
                        <View><Text style={[styles.charityModalTitle, {color: activeColorScheme.textPrimary}]}>{this.state.charityOrg.fullName} ({this.state.charityOrg.displayName})</Text></View>
                        <View style={{maxHeight: dHeight - 325 - 48 - 85, marginBottom: 25,}}><ScrollView >
                            <View onStartShouldSetResponder={() => true}><Text style={[styles.charityModalContentText, {color: activeColorScheme.textPrimary, paddingBottom:0}]}>{this.state.charityOrg.description}</Text></View>
                        </ScrollView></View>
                        <OpacityLinks onPress={()=> {Linking.openURL(this.state.charityOrg.organizationSite).catch((e)=>{})}}><Text style={[styles.charityModalContentText, {color: this.props.theme.primaryColor}]}>{'>>'} Visit Charity / Organization Site</Text></OpacityLinks>
                        
                        <View style={styles.charityModalBtnWrapper}>
                            <Button 
                                content={{text:'Donate / Support Here'}} 
                                theme={this.props.theme} 
                                colors={activeColorScheme} 
                                colorScheme={this.props.colorScheme}
                                onPress= {()=>{
                                    Linking.openURL(this.state.charityOrg.donationSite).catch((e)=>{})
                                }}
                            />
                        </View>
                    </View>
                </CharityModal>


                <ScrollView contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false} snapToEnd>
                    <View style={globalStyles.categoryWrapper}>
                        <Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>App Settings</Text>
                    </View>

                    <OpacityLinks onPress={()=>this.setState({showCurrencyModal: true, currencyModalOpenedOnce:true})}>
                        <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                            <View style={globalStyles.listItemLeft}>
                                <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, {color: activeColorScheme.textPrimary}]}>Default Currency</Text></View>
                            </View>
                            <View style={globalStyles.listItemRight}>
                                <Text style={globalStyles.listItemSubtext}>{this.state.defaultCurrency.display}</Text>
                            </View>
                        </View>
                    </OpacityLinks>


                    <View style={globalStyles.categoryWrapper}>
                        <Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>Appearance</Text>
                    </View>

                    <OpacityLinks onPress={()=>this.setState({showDisplayModal: true})}>
                        <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                            <View style={globalStyles.listItemLeft}>
                                <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, {color: activeColorScheme.textPrimary}]}>Display Mode</Text></View>
                            </View>
                            <View style={globalStyles.listItemRight}>
                                <Text style={globalStyles.listItemSubtext}>{this.state.displayMode.display}</Text>
                            </View>
                        </View>
                    </OpacityLinks>
                    <OpacityLinks onPress={()=>this.setState({showThemeModal: true})}>
                        <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                            <View style={globalStyles.listItemLeft}>
                                <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, {color: activeColorScheme.textPrimary}]}>Theme Color</Text></View>
                            </View>
                            <View style={globalStyles.listItemRight}>
                                <LinearGradient colors={[this.props.theme.gradientColors[0],this.props.theme.gradientColors[1],this.props.theme.gradientColors[0]]} style={styles.themeColorPreview}></LinearGradient>
                            </View>
                        </View>
                    </OpacityLinks>


                    <View style={globalStyles.categoryWrapper}>
                        <Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>Donations & Support</Text>
                    </View>

                    <OpacityLinks onPress={()=>{onShare('Invite a friend via...', `Hey, 

Check out SmartShopper. I use it to create shopping list and other smart lists. It's awesome!!!

Get it now on android free:
https://play.google.com/store/apps/details?id=com.madebyraymond.smartshopper
                                `, 'Check out the SmartShopper app.').catch(e =>{
                                    if (__DEV__) console.log(e)
                                })}}>
                        <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                            <View style={globalStyles.listItemLeft}>
                                <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, {color: activeColorScheme.textPrimary}]}>Invite a friend</Text></View>
                            </View>
                            <View style={globalStyles.listItemRight}>
                                <Text style={globalStyles.listItemSubtext}>Share via ...</Text>
                            </View>
                        </View>
                    </OpacityLinks>
                    <OpacityLinks onPress={()=>{Linking.openURL('mailto:MadeByRaymond@gmail.com')}}>
                        <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                            <View style={globalStyles.listItemLeft}>
                                <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, {color: activeColorScheme.textPrimary}]}>Contact Us</Text></View>
                            </View>
                            <View style={globalStyles.listItemRight}>
                                <Text style={globalStyles.listItemSubtext}>via E-Mail</Text>
                            </View>
                        </View>
                    </OpacityLinks>
                    <OpacityLinks onPress={()=>{Linking.openURL('https://madebyraymond.herokuapp.com/buymecoffee')}}>
                        <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                            <View style={globalStyles.listItemLeft}>
                                <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, {color: activeColorScheme.textPrimary}]}>Support the developers</Text></View>
                            </View>
                            <View style={globalStyles.listItemRight}>
                                <Text style={globalStyles.listItemSubtext}>Buy Me A Coffee</Text>
                            </View>
                        </View>
                    </OpacityLinks>
                    <OpacityLinks onPress={()=>{this.setState({charityModal: true})}}>
                        <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                            <View style={globalStyles.listItemLeft}>
                                <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, {color: activeColorScheme.textPrimary}]}>Support a Charity</Text></View>
                            </View>
                            <View style={globalStyles.listItemRight}>
                                <Text style={globalStyles.listItemSubtext}>{this.state.charityOrg.displayName}</Text>
                            </View>
                        </View>
                    </OpacityLinks>
            

                    <View style={styles.creditIconWrapper}>
                        <TouchableWithoutFeedback onPress={()=>{Linking.openURL('https://madebyraymond.herokuapp.com/')}}>
                            <CreditIcon colorScheme={this.props.colorScheme} />
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>

            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    colorScheme: state.ui.colorScheme,
    theme: state.ui.theme,
    themeColorName: state.ui.themeColorName
})

const mapDispatchToProps = (dispatch) => ({
    setTheme: (theme) => dispatch(setTheme(theme)),
    setColorScheme: (type) => dispatch(setColorScheme(type))
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)


const styles = StyleSheet.create({
    themeColorPreview:{
        // backgroundColor: 'red',
        height: 30,
        width: 30,
        marginVertical: -10,

        borderRadius: 6

    },

    creditIconWrapper:{
        flex: 1, 
        minHeight: 110, 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        paddingBottom: 30
    },

    // charityModalBgWrapper:{
    //     flex: 1, 
    //     backgroundColor: 'transparent',
    //     justifyContent: 'flex-end'
    // },
    // charityModalBg:{
    //     paddingHorizontal: 26,
    //     paddingTop: 48,
    //     paddingBottom: 30,
    //     borderTopLeftRadius: 13,
    //     borderTopRightRadius: 13,
    //     elevation: -10
    // },
    charityModalTitle:{
        fontFamily: 'Gilroy-Medium', 
        fontSize: 20,
        lineHeight: 28,
        marginBottom: 20
    },
    charityModalLogo:{
        height: 70,
        width: 100,
        resizeMode: 'contain',
        backgroundColor: 'transparent',
        alignSelf: 'center',
        marginBottom: 15
    },
    charityModalContentText:{
        fontFamily: 'Gilroy-Medium', 
        fontSize: 15.5,
        lineHeight: 20,

        paddingBottom: 25,
        opacity: 0.86
    },
    charityModalBtnWrapper:{
        marginTop: 15,
        marginBottom: 20
    }
})

