import React from 'react'
import {Appearance} from 'react-native'
import { Navigation } from "react-native-navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import InAppReview from 'react-native-in-app-review';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

import ProviderConfig from './src/store/providerConfig';
import ReduxStore from './src/store/storeConfig';
import {setColorScheme, setTheme} from './src/store/actions';
import {asyncStores, currencies} from './src/includes/variables';
import {theme} from './src/components/uiComponents';

// SPLASH SCREENS IMPORTS
import Splash from "./src/screens/splash/index";

// ONBOARDING SCREENS 
// import OnBoarding from "./src/screens/onBoarding/onboarding";

// APP SCREENS IMPORTS
import Home from "./src/screens/home";
import ListCreation from "./src/screens/listCreation";
import ListDetails from "./src/screens/listDetails";
import Settings from "./src/screens/settings";

// SPLASH SCREEN
Navigation.registerComponent('com.mbr.smartshopper.screen.splash', () => Splash);

// ONBOARDING SCREEN
// Navigation.registerComponent('com.lysts.screen.onboarding', () => OnBoarding);

// APP SCREEN COMPONENTS REGISTER
Navigation.registerComponent('com.mbr.smartshopper.screen.home', () => (props) => ProviderConfig(props, Home), () => Home);
Navigation.registerComponent('com.mbr.smartshopper.screen.listCreation', () => (props) => ProviderConfig(props, ListCreation), () => ListCreation);
Navigation.registerComponent('com.mbr.smartshopper.screen.listDetails', () => (props) => ProviderConfig(props, ListDetails), () => ListDetails);
Navigation.registerComponent('com.mbr.smartshopper.screen.settings', () => (props) => ProviderConfig(props, Settings), () => Settings);


const inAppUpdates = new SpInAppUpdates(
  false // isDebug
);
// curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
inAppUpdates.checkNeedsUpdate({ curVersion: '1.0.0' }).then((result) => {
  if (result.shouldUpdate) {
    let updateOptions = {};
    if (Platform.OS === 'android') {
      // android only, on iOS the user will be promped to go to your app store page
      updateOptions = {
        updateType: IAUUpdateKind.FLEXIBLE,
      };
    }
    inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
  }else {
    throw 'Update not needed'
  }
}).catch((e) =>{
    if(__DEV__) console.log("InApp Update Error ==> ", e);
}).finally(async () =>{
  if (InAppReview.isAvailable()) {
    let openCount = parseInt(await AsyncStorage.getItem(asyncStores.appOpenCount))
    
    openCount = (typeof openCount == 'number') ? isNaN(openCount) ? 0 : openCount : 0;
    
    if ((openCount == 4 || openCount == 16 || openCount == 64 || openCount == 256 || openCount == 1024 || openCount == 4096)) {
      InAppReview.RequestInAppReview()
      .catch((e) => {
        if(__DEV__) console.log("InApp Review Error ==> ", e);
      })
    }

    await AsyncStorage.setItem(asyncStores.appOpenCount, `${openCount + 1}`)
  }
});


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
    let appTheme = await AsyncStorage.getItem(asyncStores.theme);
    if(typeof appTheme == 'undefined' || appTheme == null || appTheme.trim() == ''){
      throw 'Default App Theme Not Set'
    }
    await ReduxStore.dispatch(setTheme(appTheme))
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
export const splashRoot = {
  root: {
    component: {
      name: 'com.mbr.smartshopper.screen.splash',
      options : {
        statusBar: {
          backgroundColor: 'transparent',
          drawBehind: true,
          translucent: true,
          animate: true,
          blur: true,
          style: 'dark'
        }
      }
    }
  }
};

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


Navigation.events().registerAppLaunchedListener(async() => {
  try {
    await startupFunctions();
  } catch (error) {
    if(__DEV__) console.log(e);
  } finally {
    Navigation.setRoot(splashRoot);
  }
});