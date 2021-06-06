import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, Appearance, ScrollView, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Navigation } from "react-native-navigation";
import LottieView from 'lottie-react-native';
import {getColorFromURL} from 'rn-dominant-color'

// ***** Component Imports *****
// Icons and Vectors 
// import SearchIcon from '../../vectors/generalIcons/searchIcon';
// import {SettingsIcon} from '../../vectors/generalIcons'

// Components 
import Header from '../../components/header'
import FloatingButtonView from '../../components/buttons/floatingButtonView'
import ShoppingLists from '../../components/home/shoppingLists'
import {colorScheme, globalStyles} from '../../components/uiComponents'

// Includes 
import {updateStatusBarAppearance} from '../../includes/functions';
import {dWidth, dHeight} from '../../includes/variables';

class Home extends Component {
    state={
        color: '#000000',
        text: this.props.colorScheme,
        items: true
    }

    componentDidMount(){
        updateStatusBarAppearance(this.props);
    }

    componentDidUpdate(prevProps){
        if(prevProps.colorScheme != this.props.colorScheme){
            updateStatusBarAppearance(this.props);
        }
    }

    renderView = (activeColorScheme) =>{
        let renderView = <View></View>

        if (this.state.items) {
            renderView = (<ScrollView 
                    style={globalStyles.scrollView} 
                    contentContainerStyle={globalStyles.scrollViewContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View><Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>Your Starred Lists</Text></View>

                    <ShoppingLists colors={activeColorScheme} starred={true} newScreenProps={{componentId: this.props.componentId}} />

                    <View><Text style={[globalStyles.subtext, {color: activeColorScheme.subtext_1}]}>Recently Created</Text></View>

                    <ShoppingLists colors={activeColorScheme} newScreenProps={{componentId: this.props.componentId}} />
                    <ShoppingLists colors={activeColorScheme} newScreenProps={{componentId: this.props.componentId}} />
                    <ShoppingLists colors={activeColorScheme} newScreenProps={{componentId: this.props.componentId}} />

            </ScrollView>)
        }else{
            let ArrowIcon = require('../../vectors/generalIcons').ArrowIcon;
            let path = `../../assets/lottie/51382-astronaut-light-theme.json`;
            renderView = (<View style={styles.emptyStateWrapper}>
                <LottieView 
                    source={require('../../assets/lottie/astronaout.json')} 
                    autoPlay loop
                    style={styles.emptyStateAnimation}
                    speed={1}
                    
                />

                <View style={styles.emptyStateTextWrapper}>
                    <View><Text style={[styles.emptyStateText, {color: this.props.colorScheme == 'dark' ? "#FFFFFF" : this.props.theme.primaryColor}]}>Create a list to start</Text></View>
                    <View><ArrowIcon width={38} height={38} colorScheme={this.props.colorScheme} theme={this.props.theme} /></View>
                </View>
            </View>)
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
                

                {this.state.items ? (<FloatingButtonView 
                    type='singleButton'
                    content={{text:'Create new list'}} 
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
