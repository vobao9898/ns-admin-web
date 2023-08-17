const Column = () => {
  return [
    {
      title: 'Account Holder Name',
      name: 'accountHolderName',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'Bank Name',
      name: 'name',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'Routing Number',
      name: 'routingNumber',
      tableItem: {
        sorter: false,
      },
      formItem: {
        type: 'only_number',
        rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'Account Number',
      name: 'accountNumber',
      tableItem: {
        sorter: false,
      },
      formItem: {
        type: 'only_number',
        rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'Void Check',
      name: 'imageUrl',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        type: 'upload',
        col: 3,
        colTable: 3,
        onlyImage: true,
        accept: 'image/*,.pdf',
        action: 'File',
        allowUploadPdf: true,
      },
    },
  ];
};
export default Column;
