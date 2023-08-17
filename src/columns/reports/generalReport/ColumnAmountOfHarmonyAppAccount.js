import moment from 'moment';
import React from 'react';
const Column = () => {
  return [
    {
      title: 'Date',
      name: 'createDate',
      tableItem: {
        render: (text) => {
          if (text.indexOf('Total') > -1) {
            return <p className="font-bold">{text}</p>;
          }
          return moment(text).format('MM/DD/YYYY hh:mm A');
        },
      },
    },
    {
      title: 'New Harmony App Accounts',
      name: 'New-Harmony-App-Accounts',
      tableItem: {
      },
    },
  ];
};

export default Column;
