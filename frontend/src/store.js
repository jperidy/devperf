import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { pxxAvailabilitiesReducer, pxxListReducer, pxxAllListReducer, pxxTACEReducer, pxxUpdateReducer } from './reducers/pxxReducers';
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
    consultantAllSkillsReducer,
    consultantAddSkillReducer,
    consultantDeleteSkillReducer,
    consultantUpdateSkillReducer,
    consultantAllStaffsReducer,
    consultantSkillsReducer,
    consultantGetCDMReducer
 } from './reducers/consultantReducers';
import { pxxMyToEditReducer } from './reducers/pxxReducers';
import { skillCreateReducer, skillDelteReducer, skillListReducer } from './reducers/skillReducers'
import { dealAllListReducer, dealCreateReducer, dealDeleteReducer, dealEditeReducer, dealUpdateReducer } from './reducers/dealReducer';
import { accessListReducer } from './reducers/accessReducers';

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
    //consultantAllAccess: consultantAllAccessReducer,
    consultantSkills: consultantSkillsReducer,
    consultantAllSkills: consultantAllSkillsReducer,
    consultantAllStaffs: consultantAllStaffsReducer,
    consultantAddSkill: consultantAddSkillReducer,
    consultantDeleteSkill: consultantDeleteSkillReducer,
    consultantUpdateSkill: consultantUpdateSkillReducer,
    consultantGetCdm: consultantGetCDMReducer,
    pxxList: pxxListReducer,
    pxxAllList: pxxAllListReducer,
    pxxMyToEdit: pxxMyToEditReducer,
    pxxUpdate: pxxUpdateReducer,
    pxxTACE: pxxTACEReducer,
    pxxAvailabilities: pxxAvailabilitiesReducer,
    skillList: skillListReducer,
    skillDelete: skillDelteReducer,
    skillCreate: skillCreateReducer,
    dealCreate: dealCreateReducer,
    dealAllList: dealAllListReducer,
    dealDelete: dealDeleteReducer,
    dealEdit: dealEditeReducer,
    dealUpdate: dealUpdateReducer,
    accessList: accessListReducer
});

// space for store on local
const userItemsFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    userLogin: {userInfo: userItemsFromStorage}
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;