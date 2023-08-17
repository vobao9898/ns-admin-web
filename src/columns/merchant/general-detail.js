const Column = () => {
  return [
    {
      title: 'Legal Business Name',
      name: 'general',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 3,
        colTablet: 6,
        condition: (gene, form) => {
          return 'general.firstName';
        },
      },
    },
    {
      title: 'Doing Business As',
      name: 'dba',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 3,
        colTablet: 6,
      },
    },
    {
      title: 'Merchant type',
      name: 'merchantType',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }, { type: 'select' }],
        col: 3,
        colTablet: 6,
        type: 'select',
        list: [
          { value: 0, label: 'Salon POS' },
          { value: 2, label: 'Retailer' },
          { value: 3, label: 'Table management' },
        ],
        placeholder: 'Merchant type',
      },
    },
    {
      title: 'Federal Tax ID',
      name: 'FederalTaxID',
      tableItem: {
        sorter: false,
      },
      formItem: {
        col: 3,
        colTablet: 6,
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Business Address',
      name: 'businessAddress',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 12,
      },
    },
    {
      title: 'City',
      name: 'city',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'State',
      name: 'state',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'select',
        list: [
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
        ],
        placeholder: 'State',
      },
    },
    {
      title: 'Zip code',
      name: 'zipCode',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: '',
      name: 'SameAs',
      formItem: {
        type: 'checkbox',
        label: 'Same as Business Address',
        onChange: (value, form) => {
          const { businessAddress, state, city, zipCode } = form.getFieldsValue();
          if (value) {
            form.setFieldsValue({
              businessAddress1: businessAddress,
              state1: state,
              city1: city,
              zipCode1: zipCode,
            });
          }
        },
      },
    },
    {
      title: 'DBA Address',
      name: 'businessAddress1',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 12,
      },
    },
    {
      title: 'City',
      name: 'city1',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'State',
      name: 'state1',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }, { type: 'select' }],
        col: 4,
        colTablet: 6,
        type: 'select',
        list: [
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
        ],
        placeholder: 'State',
      },
    },
    {
      title: 'Zip code',
      name: 'zipCode1',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Email Contact',
      name: 'EmailContact',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }, { type: 'email' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Business Phone Number',
      name: 'BusinessPhoneNumber',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        mask: {
          alias: 'numeric',
          prefix: '+',
          digitsOptional: true,
        },
      },
    },
    {
      title: 'Contact Phone Number',
      name: 'ContactPhoneNumber',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        mask: {
          alias: 'numeric',
          prefix: '+',
          digitsOptional: true,
        },
      },
    },
    {
      title: 'First Name',
      name: 'FirstName',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Last Name',
      name: 'LastName',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Title/Position',
      name: 'position',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
  ];
};
export default Column;
