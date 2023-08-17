import React from 'react';
import moment from 'moment';
import classNames from 'classnames';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatNumberFromCurrency = (currency) => {
  return Number(`${currency}`.replace(/[^0-9.-]+/g, ''));
};

const ColumnsGiftCard = () => {
  return [
    {
      title: 'Serial',
      name: 'serialNumber',
      tableItem: {
        sorter: true,
        render: (text, item) => {
          return <p className={classNames({ 'font-bold': item?.isTotalTransactions })}>{item.serialNumber}</p>;
        },
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
      name: 'totalAmount',
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

export default ColumnsGiftCard;
