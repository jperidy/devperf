const Consultant = require('../models/consultantModel');
const User = require('../models/userModel');

const myAccessConsultants = async (data, req) => {
    //console.log(req.user);
    let consultantsId = [];
    switch (data) {
        case 'my':
            consultantsId = [req.user.consultantProfil._id];
            break;
        case 'team':
            consultantsId = await Consultant.find({ cdmId: req.user.consultantProfil._id }).select('_id');
            //consultantsId.push({_id: req.user.consultantProfil._id}); // add your profil
            //console.log(consultantsId)
            break;
        case 'department':
            consultantsId = await Consultant.find({ practice: req.user.consultantProfil.practice }).select('_id');
            break;
        case 'domain': // to implement
            consultantsId = await Consultant.find({}).select('_id');
            break;
        case 'all':
            consultantsId = await Consultant.find({}).select('_id');
            break;
        default:
            break;
    }
    return consultantsId;
}

const myAccessUsers = async (data, req) => {
    let usersId = [];
    //console.log('data', data);
    switch (data) {
        case 'my':
            usersId = [req.user._id];
            break;
        case 'team':
            const myConsultants = await Consultant.find({ cdmId: req.user.consultantProfil._id }).select('_id');
            usersId = await User.find({consultantProfil: {$in: myConsultants.map(x => x._id)}}).select('_id');
            //usersId = await User.find({ cdmId: req.user.consultantProfil._id }).select('_id');
            usersId.push({_id: req.user._id}); // add your profil
            //console.log(usersId);
            break;
        case 'department':
            const departmentConsultants = await Consultant.find({ practice: req.user.consultantProfil.practice }).select('_id');
            usersId = await User.find({consultantProfil: {$in: departmentConsultants.map(x => x._id)}}).select('_id');
            break;
        case 'domain': // to implement
            const domainConsultants = await Consultant.find({}).select('_id');
            usersId = await User.find({consultantProfil: {$in: domainConsultants.map(x => x._id)}}).select('_id');
            break;
        case 'all':
            //const allConsultants = await Consultant.find({}).select('_id');
            usersId = await User.find().select('_id');
            //console.log(usersId.length);
            break;
        default:
            break;
    }
    return usersId;
}


module.exports = { 
    myAccessConsultants,
    myAccessUsers
}