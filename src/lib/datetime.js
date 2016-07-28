import moment from 'moment';

function prettifyTimestamp(s) {
  return moment(s).isValid() ? moment(s).format() : undefined;
}

export {prettifyTimestamp};
