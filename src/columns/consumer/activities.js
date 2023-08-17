import moment from "moment";

const Column = () => {
  return [
    {
      title: 'Date/time',
      name: 'createDate',
      tableItem: {
        sorter: false,
        render: (text) => {
          text = text + 'Z';
          return moment(text).format('MM/DD/YYYY hh:mm A');
        },
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
