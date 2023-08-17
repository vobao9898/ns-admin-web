import moment from 'moment';

const Column = () => {
  return [
    {
      title: 'ID',
      name: 'code',
      tableItem: {
        sorter: false,
        render: (text, item) => '#' + text,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Date',
      name: 'createdDate',
      tableItem: {
        sorter: false,
        render: (text, item) => moment(text).format('MM/DD/YYYY'),
      },
      formItem: {
        rules: [{ type: 'required' }],
        type: 'date',
      },
    },
    {
      title: 'Time',
      name: 'time',
      tableItem: {
        sorter: false,
        render: (text, item) => moment(item?.createdDate).format('hh:mm A'),
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Customer',
      name: 'customer',
      tableItem: {
        sorter: false,
        render: (text, item) => item?.user?.firstName + ' ' + item?.user?.lastName,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Status',
      name: 'status',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Total',
      name: 'total',
      tableItem: {
        sorter: false,
        render: (text, item) => '$' + text,
      },
    },
  ];
};
export default Column;
