import moment from 'moment';
import React from 'react';

const Column = () => {
  return [
    {
      title: 'Date/time',
      name: 'createDate',
      tableItem: {
        sorter: true,
        render: (text) => {
          text = text + 'Z';
          return moment(text).format('MM/DD/YYYY hh:mm A');
        },
      },
    },
    {
      title: 'Transaction Id',
      name: 'paymentTransactionId',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Activity',
      name: 'activity',
      tableItem: {
        sorter: false,
      },
    },
    {
      title: 'Payment Method',
      name: 'PaymentMethod',
      tableItem: {
        sorter: false,
        render: (text, item) => <p className=" capitalize">{item?.paymentData?.method}</p>,
      },
    },
    {
      title: 'Card Type',
      name: 'cardType',
      tableItem: {
        sorter: false,
        render: (text, item) => <p className=" capitalize">{item?.paymentData?.card_type}</p>,
      },
    },
    {
      title: 'Amount',
      name: 'amount',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Ip',
      name: 'ip',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Validation State',
      name: 'validationState',
      tableItem: {
        sorter: false,
        render: (text, item) => <p className=" capitalize">{item?.paymentData?.validation_status}</p>,
      },
    },
    {
      title: 'Transaction State',
      name: 'transactionState',
      tableItem: {
        sorter: false,
        render: (teext, item) => <p className=" capitalize">{item?.paymentData?.transaction_status}</p>,
      },
    },
  ];
};
export default Column;
