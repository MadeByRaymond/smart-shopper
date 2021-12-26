// import { Linking } from 'react-native';
import React from 'react'
import {Appearance} from 'react-native'
import { Navigation } from "react-native-navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import InAppReview from 'react-native-in-app-review';
import InAppUpdates from 'sp-react-native-in-app-updates';

import ProviderConfig from './src/store/providerConfig';
import ReduxStore from './src/store/storeConfig';
import {setColorScheme, setTheme} from './src/store/actions';
import {asyncStores, currencies} from './src/includes/variables';
import {theme} from './src/components/uiComponents';
import {app as realmApp} from './src/realm-storage/realm';

// SPLASH SCREENS IMPORTS
// import Splash from "./src/screens/splashScreen/splashScreen";

// ONBOARDING SCREENS 
// import OnBoarding from "./src/screens/onBoarding/onboarding";

// APP SCREENS IMPORTS
import Home from "./src/screens/home";
import ListCreation from "./src/screens/listCreation";
import ListDetails from "./src/screens/listDetails";
import Settings from "./src/screens/settings";

// DEMO REDUX SCREEN SCREEN
// Navigation.registerComponentWithRedux('com.lysts.screen.auth', () => Auth, Provider, store);

// SPLASH SCREEN
// Navigation.registerComponent('com.lysts.screen.splash', () => Splash);

// ONBOARDING SCREEN
// Navigation.registerComponent('com.lysts.screen.onboarding', () => OnBoarding);

// APP SCREEN COMPONENTS REGISTER
Navigation.registerComponent('com.mbr.smartshopper.screen.home', () => (props) => ProviderConfig(props, Home), () => Home);
Navigation.registerComponent('com.mbr.smartshopper.screen.listCreation', () => (props) => ProviderConfig(props, ListCreation), () => ListCreation);
Navigation.registerComponent('com.mbr.smartshopper.screen.listDetails', () => (props) => ProviderConfig(props, ListDetails), () => ListDetails);
Navigation.registerComponent('com.mbr.smartshopper.screen.settings', () => (props) => ProviderConfig(props, Settings), () => Settings);


// HANDLING DEEP LINKING 
// Deep Linking Launching Quit App Handler 
// Linking.getInitialURL().then((url) => {
//   if(url.toLowerCase().includes('/wishlink/')){
//     let wishlist_code = url.substring(url.lastIndexOf('/wishlink/') + 10);
    
//     if(wishlist_code.length == 6){
//       global.launchWithCode = wishlist_code;
//     }
//   }
// }).catch((e)=>{});

// Deep Linking Launching Background App Handler 
// Linking.addEventListener('url', ({url}) =>{
//   if(url.toLowerCase().includes('/wishlink/')){
//     let wishlist_code = url.substring(url.lastIndexOf('/wishlink/') + 10);
    
//     if(
//       wishlist_code.length == 6
//       && typeof global.activeComponentId !== 'undefined' 
//       && global.activeComponentId !== null 
//       && (typeof global.activeComponentId == 'string' && global.activeComponentId.trim() !== '')
//     ){
//       goToViewWishlistScreen(global.activeComponentId, wishlist_code)
//     }
//   }
// });

// // Add Appearance Change Listener 
// Appearance.addChangeListener(()=>{
//   AsyncStorage.getItem(asyncStores.colorScheme).then((result) => {
//     result == 'system' ? ReduxStore.dispatch(setColorScheme(result)) : null
//   }).catch((e) => {/* Do Nothing */})
// })

// AsyncStorage.getItem(asyncStores.colorScheme).then((result) => {
//   ReduxStore.dispatch(setColorScheme(result))
// }).catch((e) => {
//   AsyncStorage.setItem(asyncStores.colorScheme, 'light');
//   ReduxStore.dispatch(setColorScheme('light'))
// })


// // Set App Active Theme 
// AsyncStorage.getItem(asyncStores.theme).then((result) => {
//   ReduxStore.dispatch(setTheme(result))
// }).catch((e) => {
//   AsyncStorage.setItem(asyncStores.theme, Object.keys(theme)[0]);
//   ReduxStore.dispatch(setTheme(Object.keys(theme)[0]))
// })


let startupFunctions = async() => {
  // Add Appearance Change Listener 
  Appearance.addChangeListener(()=>{
    AsyncStorage.getItem(asyncStores.colorScheme).then((result) => {
      result == 'system' ? ReduxStore.dispatch(setColorScheme(result)) : null
    }).catch((e) => {/* Do Nothing */})
  })

  try {
    let appColorScheme = await AsyncStorage.getItem(asyncStores.colorScheme);
    if(typeof appColorScheme == 'undefined' || appColorScheme == null || appColorScheme.trim() == ''){
      throw 'Default App Color Scheme Not Set'
    }
    await ReduxStore.dispatch(setColorScheme(appColorScheme))
  } catch (error) {
    await AsyncStorage.setItem(asyncStores.colorScheme, 'light');
    await ReduxStore.dispatch(setColorScheme('light'))
  }

  // Set App Active Theme 
  try {
    let appTheme = await AsyncStorage.getItem(asyncStores.theme)
    if(typeof appTheme == 'undefined' || appTheme == null || appTheme.trim() == ''){
      throw 'Default App Theme Not Set'
    }
  } catch (error) {
    await AsyncStorage.setItem(asyncStores.theme, Object.keys(theme)[0]);
    await ReduxStore.dispatch(setTheme(Object.keys(theme)[0]))
  }

  // Set App Active Currency 
  try {
    let appCurrency = await AsyncStorage.getItem(asyncStores.currency);
    if(typeof appCurrency == 'undefined' || appCurrency == null || appCurrency.trim() == ''){
      throw 'Default App Currency Not Set'
    }
  } catch (error) {
    await AsyncStorage.setItem(asyncStores.currency, JSON.stringify({
      id: currencies[0].id,
      symbol: currencies[0].symbol
    }));
  }
}


// APP ROOTS 
// export const splashRoot = {
//   root: {
//     component: {
//       name: 'com.lysts.screen.splash',
//       options : {
//         statusBar: {
//           backgroundColor: 'transparent',
//           drawBehind: true,
//           translucent: true,
//           animate: true,
//           blur: true,
//           style: 'dark'
//         }
//       }
//     }
//   }
// };

// export const onBoardingRoot = {
//   root: {
//     component: {
//       name: 'com.lysts.screen.onboarding',
//       options : {
//         statusBar: {
//           backgroundColor: 'transparent',
//           drawBehind: true,
//           translucent: true,
//           animate: true,
//           blur: true,
//           style: 'dark'
//         }
//       }
//     }
//   }
// };

export const mainRoot = {
  root: {
    stack: {
      id: 'AUTH_STACK',
      children: [
        {
          component: {
            id: 'HOME_SCREEN',
            name: 'com.mbr.smartshopper.screen.home'
          }
        }
      ],
      options : {
        statusBar: {
          backgroundColor: '#FEFEFD',
          style: 'dark',
        }
      }
    }
  }
};

// Navigation Default Options
Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: '#FEFEFD',
    style: 'dark'
  },
  topBar: {
    visible: false,
    drawBehind: true,
    animate: false,
    background: {color: '#ffffff00'},
    borderColor: '#FFFFFF00'
  },
  animations:{
    setRoot :{
      alpha:{
        from : 0,
        to: 1,
        duration: 400,
        startDelay: 0,
        interpolation: 'decelerate'
      }
    }
  },
  layout: {
    orientation: ['portrait'],
    componentBackgroundColor: '#ffffff00',
    backgroundColor: '#ffffff00'
  }
});

export const getRoot = async () =>{
  try {
    return (await AsyncStorage.getItem(asyncStores.skipOnboarding) == "true") ? mainRoot : mainRoot;
  } catch(e) {
    // return onBoardingRoot;
    return mainRoot;
  }
}


Navigation.events().registerAppLaunchedListener(async() => {
  try {
    await startupFunctions();
    realmApp.logIn(Realm.Credentials.anonymous());
    // await realmApp.logIn(Realm.Credentials.emailPassword("demo@mymail.com", "password"));
    // console.log(realmApp.currentUser.id);
  } catch (error) {
    console.log(e);
  }
  //  Navigation.setRoot(await isLoggedIn() ? mainRoot : loginRoot);
  //  Navigation.setRoot(await getRoot());
  Navigation.setRoot(mainRoot);
});