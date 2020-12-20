import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { pxxListReducer, pxxTACEReducer, pxxUpdateReducer } from './reducers/pxxReducers';
import { userLoginReducer, userListReducer, userDeleteReducer, userDetailsReducer, userUpdateReducer, userRegisterReducer } from './reducers/userReducers';
import { 
    consultantMyReducer, 
    consultantsMyListReducer, 
    consultantMyUpdateReducer, 
    consultantsMyAdminListReducer,
    consultantCreateReducer,
    consultantCDMListReducer,
    consultantPracticeListReducer,
    consultantDeleteReducer,
    consultantUpdateCommentReducer,
    consultantAllPracticeReducer
 } from './reducers/consultantReducers';
import { pxxMyToEditReducer } from './reducers/pxxReducers';

export const reducer = combineReducers({
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    userList: userListReducer,
    userDetails: userDetailsReducer,
    userUpdate: userUpdateReducer,
    userDelete: userDeleteReducer,
    consultantUpdateComment: consultantUpdateCommentReducer,
    consultantsMyAdminList: consultantsMyAdminListReducer,
    consultantsMyList: consultantsMyListReducer,
    consultantMy: consultantMyReducer,
    consultantMyUpdate: consultantMyUpdateReducer,
    consultantCreate: consultantCreateReducer,
    consultantDelete: consultantDeleteReducer,
    consultantCDMList: consultantCDMListReducer,
    consultantPracticeList: consultantPracticeListReducer,
    consultantAllPractice: consultantAllPracticeReducer,
    pxxList: pxxListReducer,
    pxxMyToEdit: pxxMyToEditReducer,
    pxxUpdate: pxxUpdateReducer,
    pxxTACE: pxxTACEReducer
});

// space for store on local
const userItemsFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    userLogin: {userInfo: userItemsFromStorage}
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;