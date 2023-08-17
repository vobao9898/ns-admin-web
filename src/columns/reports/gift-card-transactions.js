import moment from 'moment';
import React from 'react';
const ColumnsGiftCardTransaction = () => {
  return [
    {
      title: 'Date/Time',
      name: 'createDate',
      tableItem: {
        render: (text, item) => moment(item?.createDate).format('MM/DD/YYYY hh:mm A'),
      },
    },
    {
      title: 'Sender',
      name: 'senderUserName',
      tableItem: {},
    },
    {
      title: 'Receiver',
      name: 'receiveUserName',
      tableItem: {},
    },
    {
      title: 'Type',
      name: 'type',
      tableItem: {
        render: (text) => 'Gift Card',
        // web mau chi co Gift Card -> khong biet lay key gi
      },
    },
    {
      title: 'Status',
      name: 'status',
      tableItem: {
        render: (text) => <p className="capitalize">{text}</p>,
      },
    },
    {
      title: 'Amount',
      name: 'amount',
      tableItem: {
        render: (text) => <p>$ {text}</p>,
      },
    },
  ];
};

export default ColumnsGiftCardTransaction;
