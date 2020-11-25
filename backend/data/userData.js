function getUserData (nbUsers) {
    let numberOfAdmin = 1;
    let numberOfCDM = 2;
    let matricule = 0;
    const listOfUsers = []

    for (let iter = 0 ; iter < nbUsers ; iter++){
        
        if (numberOfAdmin > 0) {
            user = {
                name: 'user'+ matricule,
                matricule: 'matricule' + matricule,
                email: 'user' + matricule + '@mail.com',
                password: '123456',
                arrival: '12/12/2012',
                leaving: '',
                seniority: '',
                isCDM: false,
                isAdmin: true
            };
            numberOfAdmin--;
        } else if (numberOfCDM) {
            user = {
                name: 'user'+ matricule,
                matricule: 'matricule' + matricule,
                email: 'user' + matricule + '@mail.com',
                password: '123456',
                arrival: '12/12/2012',
                leaving: '',
                seniority: '',
                isCDM: true,
                isAdmin: false
            };
            numberOfCDM--;
        } else {
            user = {
                name: 'user'+ matricule,
                matricule: 'matricule' + matricule,
                email: 'user' + matricule + '@mail.com',
                password: '123456',
                arrival: '12/12/2012',
                leaving: '',
                seniority: '',
                isCDM: false,
                isAdmin: false
            };
        };
        listOfUsers.push(user);
        matricule++;
    }

    return listOfUsers;
}

module.exports = getUserData;