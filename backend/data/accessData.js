function getAccessData() {

    const accessData = [
        {
            profil: 'admin',
            level: 0,
            frontAccess:[
                {category: 'Menu bar', id: 'staffingRequest', label: 'Staffing request menu', mode:'yes', data: 'all'},//
                {category: 'Menu bar', id: 'editMyPxx', label: 'Edit Pxx menu', mode:'yes', data: 'all'},//
                {category: 'Menu bar', id: 'editMyProfil', label:'Edit my profil menu', mode:'yes', data: 'all'},//
                {category: 'Menu bar', id: 'manageConsultants', label: 'Manage consultants menu', mode:'yes', data: 'all'},//
                {category: 'Menu bar', id: 'manageUsers', label: 'Manage users menu', mode:'yes', data: 'all'},//
                {category: 'Menu bar', id: 'manageSkills', label: 'Manage skills menu', mode:'yes', data: 'all'},//
                {category: 'Menu bar', id: 'manageDeals', label: 'Manage deals menu', mode:'yes', data: 'all'},//
                {category: 'Dashboards screen', id: 'tace', label: 'View TACE', mode:'yes', data: 'all'},//
                {category: 'Dashboards screen', id: 'consoDispo', label: 'View conso-dispo', mode:'yes', data: 'all'},//
                //{category: 'PXX screen', id: 'editDays', label: 'Edit days', mode:'yes', data: 'all'},
                {category: 'PXX screen', id: 'editComment', label: 'Edit comment', mode:'yes', data: 'all'},//
                {category: 'PXX screen', id: 'viewStaffings', label: 'View others staffings', mode:'yes', data: 'all'},//
                //{category: 'PXX screen', id: 'profilRedirection', label: 'Can access profil details', mode:'yes', data: 'all'},
                {category: 'Menu bar', id: 'manageProfils', label: 'Manage Profils', mode:'yes', data: 'all'},

            ],
            api:[
                { name: 'getUsers', data: 'all' },
                { name: 'getAllConsultants', data: 'all' },
                { name: 'getUserById', data: 'all' },
                { name: 'updateUser', data: 'all' },
                { name: 'deleteUser', data: 'all' },
                { name: 'crudConsultant', data: 'all' },
                { name: 'getAllCDMData', data: 'all'},
                { name: 'getConsultantStaffings', data: 'all'},
                { name: 'getConsultantSkills', data: 'all'},
                { name: 'getAllDeals', data: 'all' },
                { name: 'getAllPracticesData', data: 'all' },
                { name: 'getAllSkills', data: 'all'},
                { name: 'crudSkill', data: 'all' },      
            ]
        },
        {
            profil: 'coordinator',
            level: 1,
            frontAccess:[
                {category: 'Menu bar', id: 'staffingRequest', label: 'Staffing request menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'editMyPxx', label: 'Edit Pxx menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'editMyProfil', label:'Edit my profil menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'manageConsultants', label: 'Manage consultants menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'manageUsers', label: 'Manage users menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'manageSkills', label: 'Manage skills menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'manageDeals', label: 'Manage deals menu', mode:'yes', data: 'department'},
                {category: 'Dashboards screen', id: 'tace', label: 'View TACE', mode:'yes', data: 'department'},
                {category: 'Dashboards screen', id: 'consoDispo', label: 'View conso-dispo', mode:'yes', data: 'department'},
                //{category: 'PXX screen', id: 'editDays', label: 'Edit days', mode:'yes', data: 'department'},
                {category: 'PXX screen', id: 'editComment', label: 'Edit comment', mode:'yes', data: 'department'},
                {category: 'PXX screen', id: 'viewStaffings', label: 'View others staffings', mode:'yes', data: 'department'},
                //{category: 'PXX screen', id: 'profilRedirection', label: 'Can access profil details', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'manageProfils', label: 'Manage Profils', mode:'no', data: 'all'},
            ],
            api:[
                { name: 'getUsers', data: 'department' },
                { name: 'getAllConsultants', data: 'department' },
                { name: 'getUserById', data: 'department' },
                { name: 'updateUser', data: 'department' },
                { name: 'updateUser', data: 'department' },
                { name: 'crudConsultant', data: 'department' },
                { name: 'getAllCDMData', data: 'department'},
                { name: 'getConsultantStaffings', data: 'department'},
                { name: 'getConsultantSkills', data: 'department'},
                { name: 'getAllDeals', data: 'department' },
                { name: 'getAllPracticesData', data: 'all' },
                { name: 'getAllSkills', data: 'all'},
                { name: 'crudSkill', data: 'all' },
            ]
        },
        {
            profil: 'cdm',
            level: 2,
            frontAccess:[
                {category: 'Menu bar', id: 'staffingRequest', label: 'Staffing request menu', mode:'yes', data: 'team'},
                {category: 'Menu bar', id: 'editMyPxx', label: 'Edit Pxx menu', mode:'yes', data: 'team'},
                {category: 'Menu bar', id: 'editMyProfil', label:'Edit my profil menu', mode:'yes', data: 'team'},
                {category: 'Menu bar', id: 'manageConsultants', label: 'Manage consultants menu', mode:'yes', data: 'team'},
                {category: 'Menu bar', id: 'manageUsers', label: 'Manage users menu', mode:'yes', data: 'team'},
                {category: 'Menu bar', id: 'manageSkills', label: 'Manage skills menu', mode:'yes', data: 'team'},
                {category: 'Menu bar', id: 'manageDeals', label: 'Manage deals menu', mode:'yes', data: 'team'},
                {category: 'Dashboards screen', id: 'tace', label: 'View TACE', mode:'yes', data: 'team'},
                {category: 'Dashboards screen', id: 'consoDispo', label: 'View conso-dispo', mode:'yes', data: 'team'},
                //{category: 'PXX screen', id: 'editDays', label: 'Edit days', mode:'yes', data: 'team'},
                {category: 'PXX screen', id: 'editComment', label: 'Edit comment', mode:'yes', data: 'team'},
                {category: 'PXX screen', id: 'viewStaffings', label: 'View others staffings', mode:'yes', data: 'team'},
                //{category: 'PXX screen', id: 'profilRedirection', label: 'Can access profil details', mode:'yes', data: 'team'},
                {category: 'Menu bar', id: 'manageProfils', label: 'Manage Profils', mode:'no', data: 'all'},
            ],
            api:[
                { name: 'getUsers', data: 'team' },
                { name: 'getAllConsultants', data: 'team' },
                { name: 'getUserById', data: 'team' },
                { name: 'updateUser', data: 'team' },
                { name: 'updateUser', data: 'team' },
                { name: 'crudConsultant', data: 'team' },
                { name: 'getAllCDMData', data: 'team'},
                { name: 'getConsultantStaffings', data: 'department'},
                { name: 'getConsultantSkills', data: 'department'},
                { name: 'getAllDeals', data: 'department' },
                { name: 'getAllPracticesData', data: 'all' },
                { name: 'getAllSkills', data: 'my'},
                { name: 'crudSkill', data: 'my' },
            ]
        },
        {
            profil: 'manager',
            level: 3,
            frontAccess:[
                {category: 'Menu bar', id: 'staffingRequest', label: 'Staffing request menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'editMyPxx', label: 'Edit Pxx menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'editMyProfil', label:'Edit my profil menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'manageConsultants', label: 'Manage consultants menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'manageUsers', label: 'Manage users menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'manageSkills', label: 'Manage skills menu', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'manageDeals', label: 'Manage deals menu', mode:'yes', data: 'department'},
                {category: 'Dashboards screen', id: 'tace', label: 'View TACE', mode:'yes', data: 'department'},
                {category: 'Dashboards screen', id: 'consoDispo', label: 'View conso-dispo', mode:'yes', data: 'department'},
                //{category: 'PXX screen', id: 'editDays', label: 'Edit days', mode:'yes', data: 'department'},
                {category: 'PXX screen', id: 'editComment', label: 'Edit comment', mode:'yes', data: 'department'},
                {category: 'PXX screen', id: 'viewStaffings', label: 'View others staffings', mode:'yes', data: 'department'},
                //{category: 'PXX screen', id: 'profilRedirection', label: 'Can access profil details', mode:'yes', data: 'department'},
                {category: 'Menu bar', id: 'manageProfils', label: 'Manage Profils', mode:'no', data: 'all'},
            ],
            api:[
                { name: 'getUsers', data: 'my' },
                { name: 'getAllConsultants', data: 'my' },
                { name: 'getUserById', data: 'my' },
                { name: 'updateUser', data: 'my' },
                { name: 'updateUser', data: 'my' },
                { name: 'crudConsultant', data: 'my' },
                { name: 'getAllCDMData', data: 'my'},
                { name: 'getConsultantStaffings', data: 'department'},
                { name: 'getConsultantSkills', data: 'department'},
                { name: 'getAllDeals', data: 'department' },
                { name: 'getAllPracticesData', data: 'all' },
                { name: 'getAllSkills', data: 'my'},
                { name: 'crudSkill', data: 'my' },
            ]
        },
        {
            profil: 'consultant',
            level: 4,
            frontAccess:[
                {category: 'Menu bar', id: 'staffingRequest', label: 'Staffing request menu', mode:'yes', data: 'my'},
                {category: 'Menu bar', id: 'editMyPxx', label: 'Edit Pxx menu', mode:'yes', data: 'my'},
                {category: 'Menu bar', id: 'editMyProfil', label:'Edit my profil menu', mode:'yes', data: 'my'},
                {category: 'Menu bar', id: 'manageConsultants', label: 'Manage consultants menu', mode:'yes', data: 'my'},
                {category: 'Menu bar', id: 'manageUsers', label: 'Manage users menu', mode:'yes', data: 'my'},
                {category: 'Menu bar', id: 'manageSkills', label: 'Manage skills menu', mode:'yes', data: 'my'},
                {category: 'Menu bar', id: 'manageDeals', label: 'Manage deals menu', mode:'yes', data: 'my'},
                {category: 'Dashboards screen', id: 'tace', label: 'View TACE', mode:'yes', data: 'my'},
                {category: 'Dashboards screen', id: 'consoDispo', label: 'View conso-dispo', mode:'yes', data: 'my'},
                //{category: 'PXX screen', id: 'editDays', label: 'Edit days', mode:'yes', data: 'my'},
                {category: 'PXX screen', id: 'editComment', label: 'Edit comment', mode:'yes', data: 'my'},
                {category: 'PXX screen', id: 'viewStaffings', label: 'View others staffings', mode:'yes', data: 'my'},
                //{category: 'PXX screen', id: 'profilRedirection', label: 'Can access profil details', mode:'yes', data: 'my'},
                {category: 'Menu bar', id: 'manageProfils', label: 'Manage Profils', mode:'no', data: 'all'},
            ],
            api: [
                { name: 'getUsers', data: 'my' },
                { name: 'getAllConsultants', data: 'my' },
                { name: 'getUserById', data: 'my' },
                { name: 'updateUser', data: 'my' },
                { name: 'updateUser', data: 'my' },
                { name: 'crudConsultant', data: 'my' },
                { name: 'getAllCDMData', data: 'my'},
                { name: 'getConsultantStaffings', data: 'my'},
                { name: 'getConsultantSkills', data: 'my'},
                { name: 'getAllDeals', data: 'my' },
                { name: 'getAllPracticesData', data: 'my' },
                { name: 'getAllSkills', data: 'my'},
                { name: 'crudSkill', data: 'my' },
            ]
        }
    ];

    return accessData;
}

module.exports = {getAccessData};