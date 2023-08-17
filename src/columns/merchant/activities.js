import moment from 'moment';

const Column = () => {
  return [
    {
      title: 'Date/Time',
      name: 'createDate',
      tableItem: {
        sorter: false,
        render: (text) => {
          text = text + 'Z';
          return moment(text).format('MM/DD/YYYY hh:mm A');
        },
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Activity',
      name: 'action',
      tableItem: {
        sorter: false,
      },
    },
  ];
};
export default Column;
