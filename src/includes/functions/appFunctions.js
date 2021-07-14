import { Share } from 'react-native';
import {Navigation} from 'react-native-navigation'
import debounce from 'lodash.debounce';

import {colorScheme} from '../../components/uiComponents';

export const updateStatusBarAppearance = (props) =>{
    Navigation.mergeOptions(props.componentId, {
        statusBar: {
            backgroundColor: colorScheme[props.colorScheme == 'dark' ? 'dark' : 'light'].statusBackground,
            style: props.colorScheme == 'dark' ? 'light' : 'dark'
        },
    });
}

export const navigateToScreen = debounce((screenComponentId, newScreenComponentName, screenProps, screenOptions)=>{
    Navigation.push(screenComponentId, {
        component:{
            name: newScreenComponentName,
            passProps:{...screenProps},
            options:{...screenOptions}
        }
    })
},1000,{leading: true,trailing: false})

export const onShare = debounce(async (dialogTitle, message, title) => {
    try {
      const result = await Share.share({
        message: message,
        title: title
      },{
        dialogTitle: dialogTitle
      });
    //   if (result.action === Share.sharedAction) {
    //     if (result.activityType) {
    //       // shared with activity type of result.activityType
    //     } else {
    //       // shared
    //     }
    //   } else if (result.action === Share.dismissedAction) {
    //     // dismissed
    //   }
    } catch (error) {
      // alert('Error sharing message' + error.message);
      if(__DEV__){console.log('Error sharing message', error.message)}
    }
  }, 1000, {leading: true,trailing: false});


  export const randomString = (length, chars = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ') => {
    length = Math.floor(length);
    let firstChar = 'ADEJMNUVXY'
    let result = firstChar[Math.round(Math.random() * (firstChar.length - 1))];
    for (let i = (length-1); i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return (length < 1) ? '' : result;
  }