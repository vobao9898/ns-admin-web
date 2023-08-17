const Column = ({ packages, packageId }) => {
  const packagesSelect = [];
  if (packages && packages?.length) {
    packages.forEach((item) => {
      if (item?.isDisabled === 0) {
        packagesSelect.push({
          value: item?.packageId,
          label: item?.packageName,
        });
      }
    });
  }
  return [
    {
      title: 'Subscription Plan',
      name: 'packageId',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'radio',
        col: 12,
        list: packagesSelect,
      },
    },
    {
      title: 'Subscription Plan',
      name: 'planName',
      tableItem: {
        sorter: false,
      },
    },
    {
      title: 'Pricing Model',
      name: 'pricingType',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        type: 'radio',
        col: 12,
        list: [
          { value: 'monthly', label: 'Paid Monthly' },
          { value: 'annually', label: 'Paid Annually' },
        ],
      },
    },
    {
      title: 'Next Payment Date',
      name: 'expiredDate',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        type: 'date',
        col: 6,
      },
    },
    {
      title: 'Addition staff ',
      name: 'additionStaff',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'only_number',
        disabled: () => {
          if (packageId && packageId === 3) {
            return false;
          }
          return true;
        },
        mask: {
          mask: '[9{1,9}]',
        },
        col: 6,
      },
    },
  ];
};
export default Column;
