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
      title: 'Apple store',
      name: 'appleStore',
      tableItem: {
      },
    },
    {
      title: 'Android store',
      name: 'androidStore',
      tableItem: {
      },
    },
  ];
};

export default Column;
