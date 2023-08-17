import moment from 'moment';
import React from 'react';
const ColumnsMerchantBatchSettlementDetail = () => {
  return [
    {
      title: 'Transaction ID',
      name: 'transactionId',
      tableItem: {
        sorter: true,
        render: (text, item) =>
          item?.transactionId !== -1 ? item?.paymentData?.transaction_id : <strong>Total:</strong>,
      },
    },
    {
      title: 'Date/Time',
      name: 'createdDate',
      tableItem: {
        sorter: true,
        render: (text, item) => (item?.transactionId !== -1 ? moment(text).format('MM/DD/YYYY hh:mm A') : null),
      },
    },
    {
      title: 'Invoice Number',
      name: 'checkoutId',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Status',
      name: 'status',
      tableItem: {
        sorter: true,
        render: (text, item) => (item?.transactionId !== -1 ? <p className="uppercase">{text}</p> : null),
      },
    },
    {
      title: 'Payment',
      name: 'payment',
      tableItem: {
        sorter: true,
        render: (text, item) =>
          item?.transactionId !== -1 ? (
            <p>
              <span className="font-semibold mr-2">Other</span>
              <span>{item?.paymentData?.card_number}</span>
            </p>
          ) : null,
      },
    },
    {
      title: 'Total',
      name: 'amount',
      tableItem: {
        sorter: true,
        render: (text, item) => (item?.transactionId !== -1 ? <p>${text}</p> : <strong>${text}</strong>),
      },
    },
  ];
};

export default ColumnsMerchantBatchSettlementDetail;
