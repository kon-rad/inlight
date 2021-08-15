function formatDate(date) {
  // var d = new Date(date),
  //   month = '' + (d.getMonth() + 1),
  //   day = '' + d.getDate(),
  //   year = d.getFullYear();

  // if (month.length < 2) month = '0' + month;
  // if (day.length < 2) day = '0' + day;

  // return [year, month, day].join('-');
  return new Date(date).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
  }); // 8/19/2020, 9:29:51 AM. (date and time in a specific timezone)
}
export default formatDate;
