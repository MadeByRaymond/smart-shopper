import {Appearance} from 'react-native';

import { COLOR_SCHEME, THEME } from './types';
import {theme} from '../../components/uiComponents'

export const setColorScheme = (type = 'system') =>{
    return {
        type: COLOR_SCHEME,
        payload: {
            colorScheme :  type == 'system' ? Appearance.getColorScheme() : type
        }
    }
}

export const setTheme = (activeTheme = Object.keys(theme)[0]) => {
    return {
        type: THEME,
        payload: {
            theme: theme[activeTheme],
            themeColorName: activeTheme 
        }
    }
}