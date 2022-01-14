import Share from 'react-native-share';
import {Navigation} from 'react-native-navigation'
import debounce from 'lodash.debounce';

import {colorScheme} from '../../components/uiComponents';

import store from '../../store/storeConfig'

export const updateComponentAppearance = (props) =>{
    Navigation.mergeOptions(props.componentId, {
        layout: {
          componentBackgroundColor: colorScheme[props.colorScheme == 'dark' ? 'dark' : 'light'].background,
          backgroundColor: colorScheme[props.colorScheme == 'dark' ? 'dark' : 'light'].background
        },
        statusBar: {
          backgroundColor: colorScheme[props.colorScheme == 'dark' ? 'dark' : 'light'].statusBackground,
          style: props.colorScheme == 'dark' ? 'light' : 'dark'
        },
        navigationBar: {
          backgroundColor: colorScheme[props.colorScheme == 'dark' ? 'dark' : 'light'].background
        },
    });
}

export const navigateToScreen = debounce((screenComponentId, newScreenComponentName, screenProps, screenOptions)=>{
  let colorSchemeState = store.getState().ui.colorScheme;
    Navigation.push(screenComponentId, {
        component:{
            name: newScreenComponentName,
            passProps:{...screenProps},
            options:{
              layout: {
                componentBackgroundColor: colorScheme[colorSchemeState == 'dark' ? 'dark' : 'light'].background,
                backgroundColor: colorScheme[colorSchemeState == 'dark' ? 'dark' : 'light'].background
              },
              statusBar: {
                backgroundColor: colorScheme[colorSchemeState == 'dark' ? 'dark' : 'light'].statusBackground,
                style: colorSchemeState == 'dark' ? 'light' : 'dark'
              },
              navigationBar: {
                backgroundColor: colorScheme[colorSchemeState == 'dark' ? 'dark' : 'light'].background
              },
              ...screenOptions
            }
        }
    })
},1000,{leading: true,trailing: false})

export const onShare = debounce(async (dialogTitle, message, title, url, isSmartlistFile) => {
  try {
    await Share.open({title, subject: title, message, url, type: isSmartlistFile ? 'application/octet-stream' : 'text/plain'});
  } catch (error) {
    // if(__DEV__) console.log(error);
    throw 'Error sharing message: ' + error
  }
}, 1000, {leading: true,trailing: false});


export const randomString = (length, chars = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ') => {
  length = Math.floor(length);
  let firstChar = 'ADEJMNUVXY'
  let result = firstChar[Math.round(Math.random() * (firstChar.length - 1))];
  for (let i = (length-1); i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return (length < 1) ? '' : result;
}