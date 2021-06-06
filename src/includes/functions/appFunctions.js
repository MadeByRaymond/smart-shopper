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