import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Jakarta');

exports.DateTime = class DateTime {
  getFormattedDate(date = dayjs(), formatType = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(date).tz().format(formatType);
  }

  getCurrentDateAndTime(formatType = 'YYYY-MM-DD HH:mm:ss') {
    return this.getTzDate().format(formatType);
  }

  getCurrentDate(formatType = 'YYYY-MM-DD') {
    return this.getTzDate().format(formatType);
  }

  getCurrentTimeStamp(formatType = 'HH:mm:ss') {
    return this.getTzDate().format(formatType);
  }

  getAdjustedDate(unit, value, date = null, formatType = 'YYYY-MM-DD') {
    return this.getTzDate(date).add(value, unit).format(formatType);
  }

  getAddDayDate(add, date = null) {
    return this.getAdjustedDate('day', add, date);
  }

  getSubtractDayDate(subtract, date = null) {
    return this.getAdjustedDate('day', -subtract, date);
  }

  getAddMonthDate(add, date = null) {
    return this.getAdjustedDate('month', add, date);
  }

  getSubtractMonthDate(subtract, date = null) {
    return this.getAdjustedDate('month', -subtract, date);
  }

  getCurrentMonth() {
    return this.getTzDate().format('MMM');
  }

  getCurrentMonthNumber() {
    return this.getTzDate().month();
  }

  getCurrentYear() {
    return this.getTzDate().year();
  }

  formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return this.getFormattedDate(date, format);
  }

  dateDiff(dateParams1, dateParams2) {
    const date1 = dayjs(dateParams1).startOf('day');
    const date2 = dayjs(dateParams2).startOf('day');
    return date1.diff(date2, 'day');
  }

  isDateInRange(dateParams1, dateParams2) {
    const dateNow = dayjs(this.getCurrentDateAndTime(), 'YYYY-MM-DD HH:mm:ss');
    const dayjsDate1 = dayjs(dateParams1, 'YYYY-MM-DD HH:mm:ss');
    const dayjsDate2 = dayjs(dateParams2, 'YYYY-MM-DD HH:mm:ss');
    if (dateNow.isAfter(dayjsDate1)) {
      if (dateNow.isBefore(dayjsDate2)) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  getTzDate(date = dayjs()) {
    return dayjs(date).tz();
  }
};
