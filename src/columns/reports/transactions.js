import moment from 'moment';
import React from 'react';
import classNames from 'classnames';
import RefundIcon from 'assets/images/refund-icon.png';

const ColumnTransactions = ({ onRefund, isLoading, setIsLoading }) => {
  const handleRefund = (id) => {
    setIsLoading(true);
    onRefund(id);
  };

  const checkCanRefund = (item) => {
    if (item && item.isRefund === false && item.status === 'Success' && item.title === 'Add money to NailSoft') {
      return true;
    }
    return false;
  };

  return [
    {
      title: 'Date/Time',
      name: 'createDate',
      tableItem: {
        render: (text) => {
          if (text.indexOf('Total') > -1) {
            return <p className="font-bold">{text}</p>;
          }
          return moment(text).format('MM/DD/YYYY hh:mm A');
        },
        sorter: true,
      },
    },
    {
      title: 'ID',
      name: 'paymentTransactionId',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Invoice Number',
      name: 'invoiceNumber',
      tableItem: {
        sorter: false,
      },
    },
    {
      title: 'MID',
      name: 'merchantCode',
      tableItem: {},
    },
    {
      title: 'Method',
      name: 'title',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Original Account',
      name: 'name_on_card',
      tableItem: {
        render: (text, item) => (
          <div className="w-36">
            <p>{item.paymentData?.name_on_card}</p>
          </div>
        ),
      },
    },
    {
      title: 'Card/Last 4 Digit',
      name: 'card_type',
      tableItem: {
        render: (text, item) => {
          if (!item?.paymentData?.card_type) {
            return '';
          }
          return (
            <div>
              <p>{item?.paymentData?.card_type}</p>
              <p>**** **** **** {item?.paymentData?.card_number}</p>
            </div>
          );
        },
      },
    },
    {
      title: 'Merchant Account',
      name: 'merchantAccount',
      tableItem: {
        render: (text, item) => item?.receiver?.name,
      },
    },
    {
      title: 'Amount',
      name: 'amount',
      tableItem: {
        sorter: true,
        render: (text) => {
          text = '' + text;
          if (text.indexOf('Total') > -1) {
            text = text.replace('Total', '');
            return <p className="font-bold">${text}</p>;
          }
          return <p>${text}</p>;
        },
      },
    },
    {
      title: 'IP',
      name: 'ip',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Status',
      name: 'status',
      tableItem: {
        sorter: true,
        render: (text) => <p className="capitalize">{text}</p>,
      },
    },
    {
      title: 'Refund',
      name: 'refund',
      tableItem: {
        sorter: false,
        render: (text, item) => {
          if (!item) return '';

          if (!(item && item.paymentTransactionId)) {
            return '';
          }

          return (
            <button
              onClick={() => {
                handleRefund(item.paymentTransactionId);
              }}
              disabled={isLoading || checkCanRefund(item) === false}
              className={classNames(
                'flex flex-row items-center px-4 py-0.5 text-sm font-medium rounded-md border duration-150 text-white bg-blue-500 border-blue-500',
                { 'opacity-50 cursor-not-allowed': checkCanRefund(item) === false },
              )}
            >
              <img width={'auto'} height={12} className="w-auto h-[12px] mr-1.5" src={RefundIcon} />
              <span className="text-[12px] leading-[20px]">Refund</span>
            </button>
          );
        },
      },
    },
  ];
};

export default ColumnTransactions;
