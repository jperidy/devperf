const Pxx = require('../models/pxxModel');
const Month = require('../models/monthModel');
const Consultant = require('../models/consultantModel');
//const axios = require('axios');
const { createMonth } = require('./monthPxxController');
const { createPxx } = require('./pxxControllers');

const controlAndCreateMonth = async () => {
    
    const currentDate = new Date(Date.now());
    currentDate.setUTCHours(12,0,0,0);
    currentDate.setUTCDate(1);
    
    const numberOfMonth = 12;
    const endDate = new Date(Date.now());
    endDate.setUTCMonth(endDate.getUTCMonth() + numberOfMonth);
    endDate.setUTCDate(1);

    for (let month = currentDate ; month <= endDate; month.setUTCMonth(month.getUTCMonth() + 1)) {
        
        const searchMonth = month.toISOString().substring(0,10);
        
        const monthExist = await Month.findOne({firstDay: searchMonth});

        if(!monthExist) {
            createdMonth = await createMonth(searchMonth);
            console.log(`${new Date(Date.now()).toISOString()} creation of month: ${searchMonth} with controlAndCreateMonth`);
        }

        if (monthExist && monthExist.length > 1) {
            console.error(`${new Date(Date.now()).toISOString()} warning several references for month: ${searchMonth}`);
        }
    }
}

const controleAndCreatePxx = async () => {
    
    const numberOfMonth = 12;
    
    const currentDate = new Date(Date.now());
    currentDate.setUTCHours(12,0,0,0);
    //currentDate.setUTCMonth(currentDate.getUTCMonth() + numberOfMonth)
    currentDate.setUTCDate(1);
    
    const endDate = new Date(Date.now());
    endDate.setUTCMonth(endDate.getUTCMonth() + numberOfMonth);
    endDate.setUTCDate(1);
    
    const consultants = await Consultant.find({
        $or: [
            {
                arrival: { $lte: endDate },
                leaving: { $gte: currentDate }
            },
            {
                arrival: { $lte: endDate },
                leaving: null
            }
        ]
    });
    //consultants.map( x => console.log(x.name));    
    const margin = -2; // if forgot to create
    const stampDate = new Date(Date.now());
    stampDate.setUTCHours(12, 0, 0, 0);
    stampDate.setUTCMonth(stampDate.getUTCMonth() + margin)
    stampDate.setUTCDate(1);

    for (let month = stampDate; month <= endDate; month.setUTCMonth(month.getUTCMonth() + 1)) {

        let searchMonth = await Month.findOne({ firstDay: month.toISOString().substring(0, 10) }).select('_id days');

        if (!searchMonth) {
            searchMonth = await createMonth(month.toISOString().substring(0, 10));
        }

        for (let incr = 0; incr < consultants.length; incr++) {

            const consultant = consultants[incr];

            const pxxData = await Pxx.findOne({ name: consultant._id, month: searchMonth._id }).populate('month', 'name firstDay');

            if (!pxxData) {
                await createPxx(consultant, searchMonth, 0.79);
            }
        }
    }
    console.log(new Date(Date.now()).toISOString() + ': ControleAndCreatePxx running every 10 minutes >>> end');
}

module.exports = { controlAndCreateMonth, controleAndCreatePxx };