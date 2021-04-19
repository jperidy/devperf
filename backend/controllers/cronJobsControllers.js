const Pxx = require('../models/pxxModel');
const Month = require('../models/monthModel');
const Consultant = require('../models/consultantModel');
const path = require('path');
const fs = require('fs');
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

const controleAndCreatePxx = async (tace = 0) => {
    
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
                //await createPxx(consultant, searchMonth, 0.79);
                await createPxx(consultant, searchMonth, tace);
            }
        }
    }
    console.log(new Date(Date.now()).toISOString() + ': ControleAndCreatePxx running every 10 minutes >>> end');
}

const deleteOldFiles = async () => {

    // Add here any directories you want to clean with scheduled job
    const directories = [
        path.resolve() + '/uploads/consultants',
        path.resolve() + '/uploads/pxx',
    ]
    //const directoryConsultantsPath = path.resolve() + '/uploads/consultants';

    for (let incr = 0 ; incr < directories.length ; incr++) {
        const directory = directories[incr];
        fs.readdir(directory, (err, files) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            files.map( file => {
                const lasModified = fs.statSync(directory + '/' + file).mtime;
                const currentDate = new Date(Date.now());
                currentDate.setUTCHours(currentDate.getUTCHours()-1);
                
                if (new Date(lasModified) < currentDate){
                    fs.unlink(directory + '/' + file, (err) => {
                        if (err) {
                            console.error('Error removing file ' + file + 'from ' + directory);
                        } else {
                            console.log(file + ' has been removed from: ' + directory);
                        }
                    });
                }
                //console.log(file, new Date(lasModified) < currentDate);
                //console.log(file, fs.statSync(directoryConsultantsPath + '/' + file).mtime, typeof fs.statSync(directoryConsultantsPath + '/' + file).mtime);
            })
        })

    }
}

module.exports = { controlAndCreateMonth, controleAndCreatePxx, deleteOldFiles };