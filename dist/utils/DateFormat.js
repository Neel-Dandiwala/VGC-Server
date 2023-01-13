"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWeeksToDate = exports.formatDate = void 0;
const formatDate = (date) => {
    var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
};
exports.formatDate = formatDate;
const addWeeksToDate = (dateObj, numberOfWeeks) => {
    dateObj.setDate(dateObj.getDate() + numberOfWeeks * 7);
    return dateObj;
};
exports.addWeeksToDate = addWeeksToDate;
//# sourceMappingURL=DateFormat.js.map