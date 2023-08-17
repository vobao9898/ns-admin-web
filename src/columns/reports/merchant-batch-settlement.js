import moment from 'moment';
import React from 'react';
const ColumnsMerchantBatchSettlement = () => {
  return [
    {
      title: 'Date/Time',
      name: 'settlementDate',
      tableItem: {
        width: 200,
        sorter: true,
        render: (text, item) =>
          item?.settlementId !== -1 ? (
            <p className="min-w-[170px]">{moment(text).format('MM/DD/YYYY hh:mm A')}</p>
          ) : (
            <strong>{text}</strong>
          ),
      },
    },
    {
      title: 'Merchant DBA',
      name: 'doBusinessName',
      tableItem: {
        width: 300,
        sorter: true,
        render: (text) => <p className="min-w-[120px]">{text}</p>,
      },
    },
    {
      title: 'Merchant ID',
      name: 'merchantId',
      tableItem: {
        width: 100,
        sorter: true,
        render: (text) => <p className="min-w-[100px]">{text}</p>,
      },
    },
    {
      title: 'Terminal',
      name: 'serialNumber',
      tableItem: {
        width: 200,
        sorter: true,
        render: (text) => text && <p className="min-w-[120px]">#{text}</p>,
      },
    },
    {
      title: 'NailSoftPay',
      name: 'paymentByHarmony',
      tableItem: {
        width: 100,
        sorter: true,
        render: (text, item) =>
          item?.settlementId !== -1 ? (
            <p className="min-w-[100px]">${text}</p>
          ) : (
            <p className="min-w-[100px]">
              <strong>${text}</strong>
            </p>
          ),
      },
    },
    {
      title: 'Credit Card',
      name: 'paymentByCreditCard',
      tableItem: {
        width: 100,
        sorter: true,
        render: (text, item) =>
          item?.settlementId !== -1 ? (
            <p className="min-w-[100px]">${text}</p>
          ) : (
            <p className="min-w-[100px]">
              <strong>${text}</strong>
            </p>
          ),
      },
    },
    {
      title: 'Cash',
      name: 'paymentByCash',
      tableItem: {
        width: 100,
        sorter: true,
        render: (text, item) =>
          item?.settlementId !== -1 ? (
            <p className="min-w-[100px]">${text}</p>
          ) : (
            <p className="min-w-[100px]">
              <strong>${text}</strong>
            </p>
          ),
      },
    },
    {
      title: 'Gift Card',
      name: 'paymentByGiftcard',
      tableItem: {
        width: 100,
        sorter: true,
        render: (text, item) =>
          item?.settlementId !== -1 ? (
            <p className="min-w-[100px]">${text}</p>
          ) : (
            <p className="min-w-[100px]">
              <strong>${text}</strong>
            </p>
          ),
      },
    },
    {
      title: 'Other',
      name: 'otherPayment',
      tableItem: {
        width: 100,
        sorter: true,
        render: (text, item) =>
          item?.settlementId !== -1 ? (
            <p className="min-w-[100px]">${text}</p>
          ) : (
            <p className="min-w-[100px]">
              <strong>${text}</strong>
            </p>
          ),
      },
    },
    {
      title: 'Discount',
      name: 'discount',
      tableItem: {
        width: 100,
        sorter: true,
        render: (text, item) =>
          item?.settlementId !== -1 ? (
            <p className="min-w-[100px]">${text}</p>
          ) : (
            <p className="min-w-[100px]">
              <strong>${text}</strong>
            </p>
          ),
      },
    },
    {
      title: 'Total',
      name: 'total',
      tableItem: {
        width: 100,
        sorter: true,
        render: (text, item) =>
          item?.settlementId !== -1 ? (
            <p className="min-w-[100px]">${text}</p>
          ) : (
            <p className="min-w-[100px]">
              <strong>${text}</strong>
            </p>
          ),
      },
    },
  ];
};

export default ColumnsMerchantBatchSettlement;
