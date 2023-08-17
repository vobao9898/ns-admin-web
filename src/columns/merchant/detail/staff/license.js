const Column = () => {
  return [
    {
      title: 'Driver License',
      name: 'driverLicense',
      tableItem: {
        sorter: false,
      },
      formItem: {
        col: 4,
        rules: [
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                if (/^[A-Za-z0-9]*$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Driver License Number Invalid!'));
              },
            }),
          },
        ],
      },
    },
    {
      title: 'Social Security Number',
      name: 'socialSecurityNumber',
      tableItem: {
        sorter: false,
      },
      formItem: {
        col: 4,
      },
    },
    {
      title: 'Professional License',
      name: 'professionalLicense',
      tableItem: {
        sorter: false,
      },
      formItem: {
        col: 4,
      },
    },
  ];
};

export default Column;
