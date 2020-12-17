const bcrypt = require('bcryptjs');

function getUserData(consultants) {
    //const numberOfUser = 3;
    const listOfUser = [];

    //console.log('consultants', consultants);
    const consultantCdmProfil = consultants.filter( x => x.isCDM === true);
    //console.log('consultantCdmProfil', consultantCdmProfil);

    for (let incr = 0 ; incr < consultantCdmProfil.length ; incr++) {
         
        let userCDM = {
            name: consultantCdmProfil[incr].name,
            email: consultantCdmProfil[incr].email,
            password : bcrypt.hashSync('123456', 10),
            consultantProfil: consultantCdmProfil[incr]._id,
            isCDM: consultantCdmProfil[incr].isCDM,
            adminLevel: 2
        };
        listOfUser.push(userCDM);
    }

    // userCDM and ADMIN
    if (listOfUser && listOfUser.length >= 3) {
        listOfUser[0].adminLevel = 0; // Super Admin
        listOfUser[1].adminLevel = 1; // Practice Admin
        listOfUser[2].adminLevel = 2; // Cdm Admin
    }

    //console.log('listOfUser', listOfUser)

    return listOfUser;
}

module.exports = { getUserData };