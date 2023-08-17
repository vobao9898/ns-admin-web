const Column = () => {
  return [
    {
      title: 'Date/time',
      name: 'date',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Activity',
      name: 'activity',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: '',
      name: 'reason',
      formItem: {
        type: 'textarea',
        rules: [{ type: 'required' }],
        placeholder: 'Please enter your reason',
      },
    },
  ];
};
export default Column;
