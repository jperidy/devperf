export const DEAL_CREATE_REQUEST = 'DEAL_CREATE_REQUEST';
export const DEAL_CREATE_SUCCESS = 'DEAL_CREATE_SUCCESS';
export const DEAL_CREATE_FAIL = 'DEAL_CREATE_FAIL';
export const DEAL_CREATE_RESET = 'DEAL_CREATE_RESET';

export const DEAL_UPDATE_REQUEST = 'DEAL_UPDATE_REQUEST';
export const DEAL_UPDATE_SUCCESS = 'DEAL_UPDATE_SUCCESS';
export const DEAL_UPDATE_FAIL = 'DEAL_UPDATE_FAIL';
export const DEAL_UPDATE_RESET = 'DEAL_UPDATE_RESET';

export const DEAL_ALL_LIST_REQUEST = 'DEAL_ALL_LIST_REQUEST';
export const DEAL_ALL_LIST_SUCCESS = 'DEAL_ALL_LIST_SUCCESS';
export const DEAL_ALL_LIST_FAIL = 'DEAL_ALL_LIST_FAIL';
export const DEAL_ALL_LIST_RESET = 'DEAL_ALL_LIST_RESET';

export const DEAL_DELETE_REQUEST = 'DEAL_DELETE_REQUEST';
export const DEAL_DELETE_SUCCESS = 'DEAL_DELETE_SUCCESS';
export const DEAL_DELETE_FAIL = 'DEAL_DELETE_FAIL';
export const DEAL_DELETE_RESET = 'DEAL_DELETE_RESET';

export const DEAL_EDIT_REQUEST = 'DEAL_EDIT_REQUEST';
export const DEAL_EDIT_SUCCESS = 'DEAL_EDIT_SUCCESS';
export const DEAL_EDIT_FAIL = 'DEAL_EDIT_FAIL';
export const DEAL_EDIT_RESET = 'DEAL_EDIT_RESET';

export const REQUEST_STATUS = [
    {name: 'Identify Leader', staff: true},
    {name: 'Identify Staff', staff: true},
    {name: 'Staff validated by leader', staff: false},
    {name: 'Staff validated by client', staff: false},
    {name: 'You can staff elsewhere', staff: true}
];

export const TYPE_BUSINESS = [
    {name: 'New business'},
    {name: 'New position'},
    {name: 'Replacement'}
];

export const DEAL_STATUS = [
    {name: 'Lead'},
    {name: 'Proposal to send'},
    {name: 'Proposal sent'},
    {name: 'Won'},
    {name: 'Abandoned'},
];

export const DEAL_PROBABILITY = [
    {name: 10},
    {name: 30},
    {name: 50},
    {name: 70},
    {name: 100},
];