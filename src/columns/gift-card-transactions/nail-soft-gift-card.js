import moment from 'moment';
import React from 'react';
import classNames from 'classnames';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatNumberFromCurrency = (currency) => {
  return Number(`${currency}`.replace(/[^0-9.-]+/g, ''));
};

const Column = () => {
  return [
    {
      title: 'User name',
      name: 'userName',
      tableItem: {
        sorter: true,
        render: (text, item) => {
          return (
            <p className={classNames({ 'font-bold': item?.isTotalTransactions })}>
              {item?.isTotalTransactions ? item.serialNumber : item.userName}
            </p>
          );
        },
      },
    },
    {
      title: 'Phone number',
      name: 'phone',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Card number',
      name: 'cardNumber',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Date/Time',
      name: 'dateTime',
      tableItem: {
        sorter: true,
        render: (text, item) => {
          return item && item.dateTime ? moment(item.dateTime).format('MM/DD/YYYY hh:mm A') : '';
        },
      },
    },
    {
      title: 'Merchant',
      name: 'merchant',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Methods',
      name: 'methods',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Value',
      name: 'value',
      tableItem: {
        sorter: true,
        render: (text, item) => {
          return item && item.value ? <p>{formatter.format(formatNumberFromCurrency(item?.value))}</p> : '';
        },
      },
    },
    {
      title: 'Total Amount',
      name: 'amount',
      tableItem: {
        sorter: true,
        render: (text, item) => {
          return (
            <p className={classNames({ 'font-bold': item?.isTotalTransactions })}>
              {formatter.format(formatNumberFromCurrency(item?.totalAmount))}
            </p>
          );
        },
      },
    },
  ];
};
export default Column;
