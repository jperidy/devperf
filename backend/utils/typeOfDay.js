function typeOfDay(day) {
    switch (day) {
        case 0:
            return 'weed-end';
        case 1:
            return 'working-day';
        case 2:
            return 'working-day';
        case 3:
            return 'working-day';
        case 4:
            return 'working-day';
        case 5:
            return 'working-day';
        case 6:
            return 'weekend';
        default:
            return 'working-day';
    }
}

module.exports = typeOfDay;