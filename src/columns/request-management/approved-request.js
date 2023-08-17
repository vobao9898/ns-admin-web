import React from 'react';
import moment from 'moment';

const ColumnApproveRequest = ({ t, formatDate }) => {
  return [
    {
      title: t('ID'),
      name: 'merchantId',
      tableItem: {
        render: (text, item) => item && <div>{item.merchantId}</div>,
      },
    },
    {
      title: t('Approved Date'),
      name: 'approvedDate',
      tableItem: {
        render: (text) => moment(text).format('L'),
      },
    },
    {
      title: t('MID'),
      name: 'merchantCode',
      tableItem: {
        render: (text) => <p className="max-w-[120px]">{text}</p>,
      },
    },
    {
      title: t('DBA'),
      name: 'dba',
      tableItem: {
        render: (text, item) => item?.general?.doBusinessName,
      },
    },
    {
      title: t('Owner'),
      name: 'owner',
      tableItem: {
        render: (text, item) => (item?.principals[0]?.firstName || '') + ' ' + (item?.principals[0]?.lastName || ''),
      },
    },
    {
      title: t('Email'),
      name: 'email',
      tableItem: {},
    },
    {
      title: t('Store Phone'),
      name: 'phone',
      tableItem: {},
    },
    {
      title: t('Contact Phone'),
      name: 'cellPhone',
      tableItem: {},
    },
    {
      title: t('Approved By'),
      name: 'approvedBy',
      tableItem: {
        render: (text, item) => item?.adminUser?.first_name + item?.adminUser?.last_name,
      },
    },
  ];
};

export default ColumnApproveRequest;
