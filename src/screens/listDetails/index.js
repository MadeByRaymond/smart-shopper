import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import SyncModal from 'react-native-modal'

import Header from '../../components/header';
import {globalStyles, colorScheme} from '../../components/uiComponents'
import CheckedIcon from '../../vectors/checkIcon/checkedIcon';
import FloatingButtonView from '../../components/buttons/floatingButtonView'
import Button from '../../components/buttons/singleButton'
import {ShareIcon, CopyIcon, EditIcon, TrashIcon} from '../../vectors/generalIcons'

// Includes 
import {updateStatusBarAppearance} from '../../includes/functions';
import {dWidth} from '../../includes/variables';

class ListDetails extends Component {

    state={
        showButtonLabels: false,
        showActionsMenu: false,
        syncModal: false,
        isOwner: false,
        isSynced: true,
        isSyncing: false,
        isStarred: false
    }

    backHandler;

    componentDidMount(){
        updateStatusBarAppearance(this.props);

        this.backHandler = BackHandler.addEventListener("hardwareBackPress", (e) =>{
            // BackHandler.exitApp
            alert(this.state.showActionsMenu)
            
            if(this.state.showActionsMenu){
                this.setState({showActionsMenu: false})
                return true;
            }else{
                return false
            }
    
            
        });
    }

    componentDidUpdate(prevProps){
        if(prevProps.colorScheme != this.props.colorScheme){
            updateStatusBarAppearance(this.props);
        }
    }

    componentWillUnmount(){
        this.backHandler.remove()
    }

    render() {
        let activeColorScheme = colorScheme[this.props.colorScheme == 'dark' ? 'dark' : 'light']
        return (
            <View style={[globalStyles.container, {backgroundColor: activeColorScheme.background }]}>
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
                    <View><Text style={[globalStyles.pageTitleText, {color: activeColorScheme.textPrimary}]}>Morning breakfast Tea Cup</Text></View>
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
                    style={{margin: 0}}
                >
                    <View style={styles.syncModalBgWrapper}>
                        <View style={[styles.syncModalBg,{backgroundColor: activeColorScheme.modalBackground,}]}>
                            <View><Text style={[styles.syncModalTitle, {color: activeColorScheme.textPrimary}]}>Sync Your List</Text></View>
                            <View><Text style={[styles.syncModalContentText, {color: activeColorScheme.textPrimary}]}>Syncing your list to the Smart Shopper cloud means you can now share you shopping list with other users. This also means giving them access to mark list items as done/completed</Text></View>
                            <View><Text style={[styles.syncModalContentText, {color: activeColorScheme.textPrimary}]}>You will need an internet connection to sync the current state of your list locally with the cloud</Text></View>
                            
                            <View style={styles.syncModalBtnWrapper}>
                                <Button 
                                    content={{text:'Sync List'}} 
                                    theme={this.props.theme} 
                                    colors={activeColorScheme} 
                                    colorScheme={this.props.colorScheme}
                                    onPress= {()=>{
                                        alert('pie')
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </SyncModal>) : null }

                <ScrollView style={globalStyles.scrollView} contentContainerStyle={globalStyles.scrollViewContainer} showsVerticalScrollIndicator={false} snapToEnd>
                    <View style={globalStyles.categoryWrapper}>
                        <Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>Dairy</Text>
                        <View><Text style={[styles.priceToggle, {color:this.props.theme.primaryColor}]}> Show Prices</Text></View>
                    </View>

                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={false} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, {color: activeColorScheme.textPrimary}]}>Butter</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>1 ct</Text>
                        </View>
                    </View>
                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={true} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, globalStyles.listItemTitleCrossed]}>Parmesan cheese, Low fat, No sugar, all synthetic</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>$ 200</Text>
                        </View>
                    </View>

                    <View style={globalStyles.categoryWrapper}>
                        <Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>Dairy</Text>
                    </View>

                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={false} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, {color: activeColorScheme.textPrimary}]}>Butter</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>1 ct</Text>
                        </View>
                    </View>
                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={true} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, globalStyles.listItemTitleCrossed]}>Parmesan cheese</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>1 ct</Text>
                        </View>
                    </View>
                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={true} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, globalStyles.listItemTitleCrossed]}>Parmesan cheese</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>1 ct</Text>
                        </View>
                    </View>
                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={true} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, globalStyles.listItemTitleCrossed]}>Parmesan cheese</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>1 ct</Text>
                        </View>
                    </View>
                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={true} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, globalStyles.listItemTitleCrossed]}>Parmesan cheese</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>1 ct</Text>
                        </View>
                    </View>
                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={true} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, globalStyles.listItemTitleCrossed]}>Parmesan cheese</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>1 ct</Text>
                        </View>
                    </View>
                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={true} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, globalStyles.listItemTitleCrossed]}>Parmesan cheese</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>1 ct</Text>
                        </View>
                    </View>
                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={true} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, globalStyles.listItemTitleCrossed]}>Parmesan cheese</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>1 ct</Text>
                        </View>
                    </View>
                    <View style={[globalStyles.listItem, {borderBottomColor: activeColorScheme.listBorder}]}>
                        <View style={globalStyles.listItemLeft}>
                            <View style={{marginRight: 10}}>
                                <CheckedIcon checkedStatus={true} theme={this.props.theme} />
                            </View>
                            <View style={globalStyles.listItemTitleWrapper}><Text style={[globalStyles.listItemTitle, globalStyles.listItemTitleCrossed]}>Parmesan cheese</Text></View>
                        </View>
                        <View style={globalStyles.listItemRight}>
                            <Text style={globalStyles.listItemSubtext}>1 ct</Text>
                        </View>
                    </View>

                    <View style={styles.priceTotalWrapper}>
                        <Text style={styles.priceTotalText}>Total Price (Est):  </Text><Text style={styles.priceTotalValue}>$200.23</Text>
                    </View>
                </ScrollView>

                {this.state.showActionsMenu ? (<FloatingButtonView 
                    type='multiButtons'
                    contents={this.state.isOwner ? [
                        {text: 'Share', icon: ShareIcon, onPress:()=>{alert('pie')}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isSynced, disabledPressAction: ()=>{this.setState({syncModal: true})}},
                        {text: 'Copy', icon: CopyIcon, onPress:()=>{alert('pie')}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isSynced, disabledPressAction: ()=>{this.setState({syncModal: true})}},
                        {text: 'Edit', icon:  EditIcon, onPress:()=>{alert('pie')}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isOwner, disabledPressAction: ()=>{/* Do Nothing */}},
                        {text: 'Delete', icon: TrashIcon, onPress:()=>{alert('pie')}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isOwner, disabledPressAction: ()=>{/* Do Nothing */}}
                    ]
                    : [
                        {text: 'Share', icon: ShareIcon, onPress:()=>{alert('pie')}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isSynced, disabledPressAction: ()=>{this.setState({syncModal: true})}},
                        {text: 'Copy', icon: CopyIcon, onPress:()=>{alert('pie')}, onHold: ()=>{this.setState({showButtonLabels: true})}, disabledState: !this.state.isSynced, disabledPressAction: ()=>{this.setState({syncModal: true})}}
                    ]}
                    showButtonLabels={this.state.showButtonLabels}
                    theme={this.props.theme} 
                    colors={activeColorScheme} 
                    onPress= {()=>{
                        alert('pie')
                    }}
                />) : null}
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

    syncModalBgWrapper:{
        flex: 1, 
        backgroundColor: 'transparent',
        justifyContent: 'flex-end'
    },
    syncModalBg:{
        paddingHorizontal: 26,
        paddingTop: 48,
        paddingBottom: 30,
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        elevation: -10
    },
    syncModalTitle:{
        fontFamily: 'Gilroy-Medium', 
        fontSize: 22,

        marginBottom: 17
    },
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
