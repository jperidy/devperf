Date.prototype.addMonth = function (months) {
    this.setMonth(this.getMonth() + months);
    return this;
};

module.exports = Date;