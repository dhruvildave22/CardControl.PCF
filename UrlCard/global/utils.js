/* eslint-disable no-self-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-prototype-builtins */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable radix */
/* eslint-disable no-redeclare */
/* eslint-disable eqeqeq */
/* eslint-disable no-cond-assign */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-var */
/* eslint-disable no-param-reassign */
import _ from 'lodash';

const Utils = {
  textTruncate(str, length, ending) {
    if (length == null) {
      // eslint-disable-next-line no-param-reassign
      length = 100;
    }
    if (ending == null) {
      // eslint-disable-next-line no-param-reassign
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    }
    return str;
  },
  stringLowerCaseAndRemoveSpace(str) {
    return str.replace(/\s+/g, '-').toLowerCase();
  },
  currencyFormat(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c;
    var d = d == undefined ? '.' : d;
    var t = t == undefined ? ',' : t;
    const s = n < 0 ? '-' : '';
    const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return `$${s}${j ? i.substr(0, j) + t : ''}${i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`)}${c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''}`;
  },
  percentageFormat(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c;
    var d = d == undefined ? '.' : d;
    var t = t == undefined ? ',' : t;
    const s = n < 0 ? '-' : '';
    const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return `${s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '')}%`;
  },
  numberFormat(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c;
    var d = d == undefined ? '.' : d;
    var t = t == undefined ? ',' : t;
    const s = n < 0 ? '-' : '';
    const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
  },
  slugToText(str) {
    return str.replace(/-/g, ' ').toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
  dateToText(blogDate) {
    if (blogDate == null) {
      return ' ';
    }
    const date = new Date(blogDate);
    let day = date.getUTCDate();
    let month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    if (month < 10) {
      month = `0${month}`;
    } else {
      month = month;
    }
    if (day < 10) {
      day = `0${day}`;
    } else {
      day = day;
    }
    const full_date = `${month}/${day}/${year}`;
    return full_date;
  },
  removeDuplicates(originalArray, prop) {
    const newArray = [];
    const lookupObject = {};

    for (const i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (const i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  },
  isObjectEmpty(obj) {
    if (obj === null || typeof obj !== 'object') return true;

    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
  },
  getDropdownValue(object, key, valueKey) {
    const data = object;
    if (data[key]) {
      data[key] = data[key][valueKey];
    }s
    return data;
  },
  convertHMS(timeString) {
    const arr = timeString.split(':');
    const seconds = arr[0] * 3600 + arr[1] * 60 + (+arr[2]);
    return seconds;
  },
  getTotalSearchResult(item) {
    const itemObject = _.omit(item.match_count, ['content', 'header', 'id']);
    let sum = 0;
    for (const key in itemObject) {
      sum += itemObject[key];
    }
    // console.log('sum', sum);
    return sum;
  },
  timeSince(dateString) {
    const rightNow = new Date();
    const then = new Date(dateString);

    const diff = rightNow - then;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    // eslint-disable-next-line no-unused-vars
    const week = day * 7;

    if (isNaN(diff) || diff < 0) {
      return ''; // return blank string if unknown
    }

    if (diff < second * 2) {
      // within 2 seconds
      return 'right now';
    }

    if (diff < minute) {
      return `${Math.floor(diff / second)} seconds ago`;
    }

    if (diff < minute * 2) {
      return 'about 1 minute ago';
    }

    if (diff < hour) {
      return `${Math.floor(diff / minute)} minutes ago`;
    }

    if (diff < hour * 2) {
      return 'about 1 hour ago';
    }

    if (diff < day) { return `${Math.floor(diff / hour)} hours ago`; } if (diff > day && diff < day * 2) {
      return 'yesterday';
    }

    if (diff < day * 365) {
      return `${Math.floor(diff / day)} days ago`;
    }

    return 'over a year ago';
  },
};

export default Utils;
