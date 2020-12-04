function calculDayByType(days, type) {
    const nbDays = (days.map((day) => {
        if (day.type === type) {
            return 1;
        } else {
            return 0;
        }
    })).reduce((acc, item) => acc + item);
    return nbDays;
};

module.exports = calculDayByType;