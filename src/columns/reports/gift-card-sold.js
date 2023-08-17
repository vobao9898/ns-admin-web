import moment from 'moment';
import React from 'react';
const ColumnsGiftCardSold = () => {
  return [
    {
      title: 'Date/Time',
      name: 'date',
      tableItem: {
        sorter: true,
        render: (text) => {
          if (text?.indexOf('Total') > -1) {
            return <p className="font-bold">{text}</p>;
          }
          return moment(text).format('MM/DD/YYYY hh:mm A');
        },
      },
    },
    {
      title: 'Merchant Account',
      name: 'merchant',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Quantity Sold',
      name: 'quantity',
      tableItem: {
        sorter: true,
        render: (text) => {
          text = '' + text;
          if (text?.indexOf('Total') > -1) {
            text = text.replace('Total Quantity: ', '');
            return <p className="font-bold">{text}</p>;
          }
          return text;
        },
      },
    },
    {
      title: 'Total Amount',
      name: 'amount',
      tableItem: {
        sorter: true,
        render: (text) => {
          if (text?.indexOf('Total') > -1) {
            text = text.replace('Total Amount: ', '');
            return <p className="font-bold">{text}</p>;
          }
          return <p>${text}</p>;
        },
      },
    },
  ];
};

export default ColumnsGiftCardSold;
