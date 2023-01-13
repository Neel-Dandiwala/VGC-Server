
export const formatDate = (date: string) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export const addWeeksToDate = (dateObj: Date,numberOfWeeks: number) => {
    dateObj.setDate(dateObj.getDate()+ numberOfWeeks * 7);
    return dateObj;
  }