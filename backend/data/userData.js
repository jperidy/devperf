const bcrypt = require('bcryptjs');
const access = [
    {
        profil: 'admin',
        _id: '60113d59e24e7317996ee0b2'
    },
    {
        profil: 'coordinator',
        _id: '60113d59e24e7317996ee0c1'
    },
    {
        profil: 'cdm',
        _id: '60113d59e24e7317996ee0d0'
    }
]

function getUserData(consultants) {
    const listOfUser = [];
    const consultantCdmProfil = consultants.filter( x => x.isCDM === true);

    for (let incr = 0 ; incr < consultantCdmProfil.length ; incr++) {
         
        let userCDM = {
            name: consultantCdmProfil[incr].name,
            email: consultantCdmProfil[incr].email,
            password : bcrypt.hashSync('123456', 10),
            consultantProfil: consultantCdmProfil[incr]._id,
            isCDM: consultantCdmProfil[incr].isCDM,
            profil: access.filter(x => x.profil === 'cdm')[0]._id,
            adminLevel: consultantCdmProfil[incr].name === ('cdmptc11000@mail.com' || 'cdmptc21000@mail.com') ? 0 : 2,
            status: consultantCdmProfil[incr].name === ('cdmptc11000' || 'cdmptc21000') ? 'Validated' : 'Waiting approval'
        };
        listOfUser.push(userCDM);
    }

    // userCDM and ADMIN
    if (listOfUser && listOfUser.length >= 3) {
        
        // Super Admin
        listOfUser[0].adminLevel = 0; 
        listOfUser[0].profil = access.filter( x => x.profil === 'admin')[0]._id;

        // Practice Admin
        listOfUser[1].adminLevel = 1;
        listOfUser[1].profil = access.filter( x => x.profil === 'coordinator')[0]._id;
        
        // Cdm Admin
        listOfUser[2].adminLevel = 2; 
        listOfUser[2].profil = access.filter( x => x.profil === 'cdm')[0]._id;

    }

    //console.log('listOfUser', listOfUser)

    return listOfUser;
}

module.exports = { getUserData };