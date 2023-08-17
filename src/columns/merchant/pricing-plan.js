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
      title: 'Try NailSoft Merchant free for 3 months , no credit card required',
      name: 'packagePricing',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        type: 'radio',
        value: !packageId ? 0 : packageId,
        col: 12,
        list: packagesSelect,
      },
    },
    {
      title: 'Addition staff ',
      name: 'additionStaff',
      formItem: {
        rules: [{ type: packageId === 28 ? 'required' : '' }],
        type: 'only_number',
        disabled: () => {
          if (packageId && packageId === 28) {
            return false;
          } else {
            return true;
          }
        },
        mask: {
          mask: '[9{1,9}]',
        },
        col: 3,
      },
    },
  ];
};
export default Column;
