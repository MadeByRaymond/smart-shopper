import {COLOR_SCHEME, THEME} from "../actions/types";

import {theme} from '../../components/uiComponents'

  const initialState = {
    colorScheme : 'light',
    theme: theme[Object.keys(theme)[0]],
    themeColorName: Object.keys(theme)[0]
  }

  const reducer = (state = initialState, action) =>{
      switch (action.type) {
          case COLOR_SCHEME:
            return {
              ...state,
              colorScheme: action.payload.colorScheme
            }
          break;

          case THEME:
            return {
              ...state,
              theme: action.payload.theme,
              themeColorName: action.payload.themeColorName
            }
          break;

          default:
            return state;
          break;
      }
  }

  export default reducer;