const Consultant = require('../models/consultantModel');

const myAccessConsultants = async (data, req) => {
    let consultantId = [];
    switch (data) {
        case 'my':
            consultantsId = [req.user.consultantProfil._id];
            break;
        case 'team':
            consultantsId = await Consultant.find({ cdmId: req.user.consultantProfil._id }).select('_id');
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


module.exports = { 
    myAccessConsultants, 
}