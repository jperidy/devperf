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

export const DEAL_OLD_REQUEST = 'DEAL_OLD_REQUEST';
export const DEAL_OLD_SUCCESS = 'DEAL_OLD_SUCCESS';
export const DEAL_OLD_FAIL = 'DEAL_OLD_FAIL';
export const DEAL_OLD_RESET = 'DEAL_OLD_RESET';

export const DEAL_MASS_IMPORT_REQUEST = 'DEAL_MASS_IMPORT_REQUEST';
export const DEAL_MASS_IMPORT_SUCCESS = 'DEAL_MASS_IMPORT_SUCCESS';
export const DEAL_MASS_IMPORT_FAIL = 'DEAL_MASS_IMPORT_FAIL';
export const DEAL_MASS_IMPORT_RESET = 'DEAL_MASS_IMPORT_RESET';

export const REQUEST_STATUS = [
    {name: 'Identify Leader', staff: true, priority: 10},
    {name: 'Identify Staff', staff: true, priority: 7},
    {name: 'Staff to validate by leader', staff: false, priority: 5},
    {name: 'Staff validated by leader', staff: false, priority: 0},
    {name: 'Staff validated by client', staff: false, priority: 0},
    {name: 'You can staff elsewhere', staff: false, priority: 0},
    {name: 'Close', staff: false, priority: 0}
];

export const TYPE_BUSINESS = [
    {name: 'New business', priority: 10},
    {name: 'New position', priority: 5},
    {name: 'Replacement', priority: 1}
];

export const DEAL_STATUS = [
    {name: 'Lead', priority: 0, display: 'onTrack'},
    {name: 'Proposal to send', priority: 5, display: 'onTrack'},
    {name: 'Proposal sent', priority: 5, display: 'onTrack'},
    {name: 'Won', priority: 10, display: 'win'},
    {name: 'Abandoned', priority: 0, display: 'lost'},
    {name: 'Lost', priority: 0, display: 'lots'},
];

export const DEAL_PROBABILITY = [
    {name: 10, priority: 1},
    {name: 30, priority: 3},
    {name: 50, priority: 5},
    {name: 70, priority: 7},
    {name: 100, priority: 10},
];