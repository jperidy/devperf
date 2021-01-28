function getAccessData() {

    const accessData = [
        {
            profil: 'admin',
            level: 0,
            navbar:{
                staffingrequest:[{mode: 'write', data:'all'}],
                editmypxx:[{mode: 'write', data:'all'}],
                editmyprofil:[{mode: 'write', data:'all'}],
                manageconsultant:[{mode: 'write', data:'all'}],
                manageuser:[{mode: 'write', data:'all'}],
                manageskills:[{mode: 'write', data:'all'}],
                managedeals:[{mode: 'write', data:'all'}],
                logout:[{mode: 'write', data:'all'}]
            },
            dashboards:{
                tace:[{mode: 'write', data:'all'}],
                consodispo:[{mode: 'write', data:'all'}]
            },
            pxx:{
                days:[{mode: 'write', data:'all'}],
                comment:[{mode: 'write', data:'all'}],
                staffings:[{mode: 'write', data:'all'}],
                gotoprofil:[{mode: 'write', data:'all'}]
            },
            api:[
                { name: 'getUsers', data: 'all' },
                { name: 'getAllConsultants', data: 'all' },
                { name: 'getUserById', data: 'all' },
                { name: 'updateUser', data: 'all' },
                { name: 'deleteUser', data: 'all' },
                { name: 'crudConsultant', data: 'all' },
                { name: 'getAllCDMData', data: 'all'},
                { name: 'getConsultantStaffings', data: 'all'},
                { name: 'getAllDeals', data: 'all' },
                
            ]
        },
        {
            profil: 'coordinator',
            level: 1,
            navbar:{
                staffingrequest:[{mode: 'write', data:'department'}],
                editmypxx:[{mode: 'write', data:'department'}],
                editmyprofil:[{mode: 'write', data:'department'}],
                manageconsultant:[{mode: 'write', data:'department'}],
                manageuser:[{mode: 'write', data:'department'}],
                manageskills:[{mode: 'write', data:'department'}],
                managedeals:[{mode: 'write', data:'department'}],
                logout:[{mode: 'write', data:'department'}]
            },
            dashboards:{
                tace:[{mode: 'write', data:'department'}],
                consodispo:[{mode: 'write', data:'department'}]
            },
            pxx:{
                days:[{mode: 'write', data:'department'}],
                comment:[{mode: 'write', data:'department'}],
                staffings:[{mode: 'write', data:'department'}],
                gotoprofil:[{mode: 'write', data:'department'}]
            },
            api:[
                { name: 'getUsers', data: 'department' },
                { name: 'getAllConsultants', data: 'department' },
                { name: 'getUserById', data: 'department' },
                { name: 'updateUser', data: 'department' },
                { name: 'updateUser', data: 'department' },
                { name: 'crudConsultant', data: 'department' },
                { name: 'getAllCDMData', data: 'department'},
                { name: 'getConsultantStaffings', data: 'department'},
                { name: 'getAllDeals', data: 'department' },
            ]
        },
        {
            profil: 'cdm',
            level: 2,
            navbar:{
                staffingrequest:[{mode: 'write', data:'team'}],
                editmypxx:[{mode: 'write', data:'team'}],
                editmyprofil:[{mode: 'write', data:'team'}],
                manageconsultant:[{mode: 'write', data:'team'}],
                manageuser:[{mode: 'no', data:'team'}],
                manageskills:[{mode: 'read', data:'team'}],
                managedeals:[{mode: 'read', data:'team'}],
                logout:[{mode: 'write', data:'team'}]
            },
            dashboards:{
                tace:[{mode: 'read', data:'department'}],
                consodispo:[{mode: 'read', data:'department'}]
            },
            pxx:{
                days:[{mode: 'write', data:'team'}],
                comment:[{mode: 'write', data:'team'}],
                staffings:[{mode: 'write', data:'team'}],
                gotoprofil:[{mode: 'write', data:'team'}]
            },
            api:[
                { name: 'getUsers', data: 'team' },
                { name: 'getAllConsultants', data: 'team' },
                { name: 'getUserById', data: 'team' },
                { name: 'updateUser', data: 'team' },
                { name: 'updateUser', data: 'team' },
                { name: 'crudConsultant', data: 'team' },
                { name: 'getAllCDMData', data: 'team'},
                { name: 'getConsultantStaffings', data: 'department'},
                { name: 'getAllDeals', data: 'team' },
            ]
        },
        {
            profil: 'manager',
            level: 3,
            navbar:{
                staffingrequest:[{mode: 'write', data:'department'}],
                editmypxx:[{mode: 'no', data:'department'}],
                editmyprofil:[{mode: 'write', data:'department'}],
                manageconsultant:[{mode: 'no', data:'department'}],
                manageuser:[{mode: 'no', data:'department'}],
                manageskills:[{mode: 'no', data:'department'}],
                managedeals:[{mode: 'no', data:'department'}],
                logout:[{mode: 'write', data:'department'}]
            },
            dashboards:{
                tace:[{mode: 'read', data:'department'}],
                consodispo:[{mode: 'read', data:'department'}]
            },
            pxx:{
                days:[{mode: 'write', data:'my'}],
                comment:[{mode: 'write', data:'my'}],
                staffings:[{mode: 'write', data:'my'}],
                gotoprofil:[{mode: 'write', data:'my'}]
            },
            api:[
                { name: 'getUsers', data: 'my' },
                { name: 'getAllConsultants', data: 'my' },
                { name: 'getUserById', data: 'my' },
                { name: 'updateUser', data: 'my' },
                { name: 'updateUser', data: 'my' },
                { name: 'crudConsultant', data: 'my' },
                { name: 'getAllCDMData', data: 'my'},
                { name: 'getConsultantStaffings', data: 'department'},
                { name: 'getAllDeals', data: 'department' },
            ]
        },
        {
            profil: 'consultant',
            level: 4,
            navbar:{
                staffingrequest:[{mode: 'write', data:'my'}],
                editmypxx:[{mode: 'no', data:'my'}],
                editmyprofil:[{mode: 'write', data:'my'}],
                manageconsultant:[{mode: 'no', data:'my'}],
                manageuser:[{mode: 'no', data:'my'}],
                manageskills:[{mode: 'no', data:'my'}],
                managedeals:[{mode: 'no', data:'my'}],
                logout:[{mode: 'write', data:'my'}]
            },
            dashboards:{
                tace:[{mode: 'read', data:'my'}],
                consodispo:[{mode: 'read', data:'my'}]
            },
            pxx:{
                days:[{mode: 'write', data:'my'}],
                comment:[{mode: 'write', data:'my'}],
                staffings:[{mode: 'write', data:'my'}],
                gotoprofil:[{mode: 'write', data:'my'}]
            },
            api: [
                { name: 'getUsers', data: 'my' },
                { name: 'getAllConsultants', data: 'my' },
                { name: 'getUserById', data: 'my' },
                { name: 'updateUser', data: 'my' },
                { name: 'updateUser', data: 'my' },
                { name: 'crudConsultant', data: 'my' },
                { name: 'getAllCDMData', data: 'my'},
                { name: 'getConsultantStaffings', data: 'my'},
                { name: 'getAllDeals', data: 'my' },
            ]
        }
    ];

    return accessData;
}

module.exports = {getAccessData};