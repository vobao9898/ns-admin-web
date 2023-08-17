const Column = () => {
  return [
    {
      title: 'Name',
      name: 'firstName',
      tableItem: {
        sorter: true,
        render: (text, item) => (item ? item.firstName + ' ' + item.lastName : ''),
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Title/Position',
      name: 'title',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Mobile Phone',
      name: 'mobilePhone',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Email',
      name: 'email',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Address',
      name: 'address',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Merchants',
      name: 'merchants',
      tableItem: {
        sorter: true,
      },
    },
  ];
};
export default Column;
