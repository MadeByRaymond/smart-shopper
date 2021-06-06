import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import {allReducers as reducers} from './reducers';

// let composeEnhancers = compose;

// if(__DEV__){
//   composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// }

// const configStore = () =>{
//   return createStore(reducers, compose(applyMiddleware(thunk)))
// }


export default createStore(reducers, compose(applyMiddleware(thunk)));