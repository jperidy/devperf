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
            isCDM: consultantCdmProfil[incr].isCDM
        };
        listOfUser.push(userCDM);
    }

    // userCDM and ADMIN
    if (listOfUser) {
        listOfUser[0].isAdmin = true;
    }

    //console.log('listOfUser', listOfUser)

    return listOfUser;
}

module.exports = { getUserData };