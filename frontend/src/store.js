import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { pxxListReducer } from './reducers/pxxReducers';
import { userLoginReducer } from './reducers/userReducers';
import { consultantsMyListReducer } from './reducers/consultantReducers';
import { pxxMyToEditReducer } from './reducers/pxxReducers';

export const reducer = combineReducers({
    userLogin: userLoginReducer,
    pxxList: pxxListReducer,
    pxxMyToEdit: pxxMyToEditReducer,
    consultantsMyList: consultantsMyListReducer
}
);

// space for store on local
const userItemsFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    userLogin: {userInfo: userItemsFromStorage}
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;