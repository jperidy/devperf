import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { pxxListReducer, pxxUpdateReducer } from './reducers/pxxReducers';
import { userLoginReducer, userUpdateCommentReducer } from './reducers/userReducers';
import { consultantMyReducer, consultantsMyListReducer, consultantMyUpdateReducer } from './reducers/consultantReducers';
import { pxxMyToEditReducer } from './reducers/pxxReducers';

export const reducer = combineReducers({
    userLogin: userLoginReducer,
    userUpdateComment: userUpdateCommentReducer,
    consultantsMyList: consultantsMyListReducer,
    consultantMy: consultantMyReducer,
    consultantMyUpdate: consultantMyUpdateReducer,
    pxxList: pxxListReducer,
    pxxMyToEdit: pxxMyToEditReducer,
    pxxUpdate: pxxUpdateReducer
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