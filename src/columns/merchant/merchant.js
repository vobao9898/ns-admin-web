import moment from 'moment';

const Column = () => {
  return [
    {
      title: 'ID',
      name: 'merchantId',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'MID',
      name: 'merchantCode',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'DBA',
      name: 'businessName',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Merchant Type',
      name: 'type',
      tableItem: {},
    },
    {
      title: 'Owner',
      name: 'owner',
      tableItem: {
        sorter: false,
        render: (text, item) =>
          item?.principals?.length > 0 && item?.principals[0]?.firstName + ' ' + item?.principals[0]?.lastName,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Email',
      name: 'email',
      tableItem: {},
    },
    {
      title: 'Store Phone',
      name: 'phone',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Contact Phone',
      name: 'cellPhone',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Status',
      name: 'isDisabled',
      tableItem: {
        sorter: {
          multiple: 2,
        },
        render: (text) => (text === 0 ? 'Active' : 'Inactive'),
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Expire Date',
      name: 'expiredDate',
      tableItem: {
        sorter: {
          multiple: 1,
        },
        defaultSortOrder: 'ascend',
        render: (text) => moment(text).format('MM/DD/YYYY hh:mm A'),
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
  ];
};
export default Column;
