import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { pxxAvailabilitiesReducer, pxxListReducer, pxxAllListReducer, pxxTACEReducer, pxxUpdateReducer, pxxMyToEditReducer, pxxImportLineReducer, pxxUploadFileReducer, updatePxxReducer } from './reducers/pxxReducers';
import { userLoginReducer, userListReducer, userDeleteReducer, userDetailsReducer, userUpdateReducer, userRegisterReducer, userRedirectAzReducer, userUpdateProfileReducer, userToCreateReducer, userCreateReducer } from './reducers/userReducers';
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
    consultantGetCDMReducer,
    consultantsAllLeadersReducer,
    consultantsMassImportReducer,
    consultantUploadWkReducer,
    consultantUpdateWkReducer,
    consultantDelegateUpdateReducer
 } from './reducers/consultantReducers';
//import {  } from './reducers/pxxReducers';
import { skillCreateReducer, skillDelteReducer, skillListReducer } from './reducers/skillReducers'
import { dealAllListReducer, dealCreateReducer, dealDeleteReducer, dealEditeReducer, dealOldReducer, dealsImportMassReducer, dealUpdateReducer } from './reducers/dealReducer';
import { accessFrontUpdateReducer, accessListReducer } from './reducers/accessReducers';
import { clientAllReducer, clientCreateReducer, clientUpdateReducer, clientDeleteReducer } from './reducers/clientReducers';
import { createTaceReducer } from './reducers/taceReducer';
import { contactsListReducer, sendOneEmailReducer } from './reducers/emailReducers';

export const reducer = combineReducers({
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    userRedirectAz: userRedirectAzReducer,
    userList: userListReducer,
    userDetails: userDetailsReducer,
    userUpdate: userUpdateReducer,
    userDelete: userDeleteReducer,
    userUpdateProfil: userUpdateProfileReducer,
    userToCreate: userToCreateReducer,
    userCreate: userCreateReducer,
    consultantUpdateComment: consultantUpdateCommentReducer,
    consultantsMyAdminList: consultantsMyAdminListReducer,
    consultantsMyList: consultantsMyListReducer,
    consultantMy: consultantMyReducer,
    consultantMyUpdate: consultantMyUpdateReducer,
    consultantCreate: consultantCreateReducer,
    consultantDelete: consultantDeleteReducer,
    consultantCDMList: consultantCDMListReducer,
    consultantDelegateUpdate: consultantDelegateUpdateReducer,
    consultantPracticeList: consultantPracticeListReducer,
    //consultantAllAccess: consultantAllAccessReducer,
    consultantSkills: consultantSkillsReducer,
    consultantAllSkills: consultantAllSkillsReducer,
    consultantAllStaffs: consultantAllStaffsReducer,
    consultantAddSkill: consultantAddSkillReducer,
    consultantDeleteSkill: consultantDeleteSkillReducer,
    consultantUpdateSkill: consultantUpdateSkillReducer,
    consultantGetCdm: consultantGetCDMReducer,
    consultantsAllLeaders: consultantsAllLeadersReducer,
    consultantsMassImport: consultantsMassImportReducer,
    consultantUploadWk: consultantUploadWkReducer,
    consultantUpdateWk: consultantUpdateWkReducer,
    pxxList: pxxListReducer,
    pxxAllList: pxxAllListReducer,
    pxxMyToEdit: pxxMyToEditReducer,
    pxxUpdate: pxxUpdateReducer,
    pxxTACE: pxxTACEReducer,
    pxxAvailabilities: pxxAvailabilitiesReducer,
    updatePxx: updatePxxReducer,
    //pxxImportMass: pxxImportMassReducer,
    pxxImportLine: pxxImportLineReducer,
    pxxUploadFile: pxxUploadFileReducer,
    skillList: skillListReducer,
    skillDelete: skillDelteReducer,
    skillCreate: skillCreateReducer,
    dealCreate: dealCreateReducer,
    dealAllList: dealAllListReducer,
    dealDelete: dealDeleteReducer,
    dealEdit: dealEditeReducer,
    dealUpdate: dealUpdateReducer,
    dealOld: dealOldReducer,
    dealsImportMass: dealsImportMassReducer,
    accessList: accessListReducer,
    accessFrontUpdate: accessFrontUpdateReducer,
    clientAll: clientAllReducer,
    clientCreate: clientCreateReducer,
    clientUpdate: clientUpdateReducer,
    clientDelete: clientDeleteReducer,
    createTace: createTaceReducer,
    contactsList: contactsListReducer,
    sendOneEmail: sendOneEmailReducer
});

// space for store on local
const userItemsFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    userLogin: {userInfo: userItemsFromStorage}
};

export const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;