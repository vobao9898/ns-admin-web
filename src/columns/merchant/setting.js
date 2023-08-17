import { maskNumber } from 'utils';

const Column = ({ merchant }) => {
  return [
    {
      name: 'type',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Transactions Fee',
      name: 'transactionsFee',
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
        mask: maskNumber,
      },
    },
    {
      title: 'Merchant Code',
      name: 'merchantCode',
      formItem: {
        rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', value: 20 }],
        col: 6,
        // type: 'only_number',
      },
    },
    {
      title: 'Discount Rate',
      name: 'discountRate',
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
        mask: maskNumber,
      },
    },
    {
      title: 'Point Rate',
      name: 'pointRate',
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
      },
    },

    {
      title: 'Turn Amount',
      name: 'turnAmount',
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
        mask: maskNumber,
      },
    },
    {
      title: 'Apply Cash Discount Program',
      name: 'isCashDiscount',
      formItem: {
        type: 'checkbox',
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Top Store',
      name: 'isTop',
      formItem: {
        type: 'checkbox',
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Test Merchant',
      name: 'isTest',
      formItem: {
        type: 'checkbox',
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Cash discount percent',
      name: 'cashDiscountPercent',
      formItem: {
        col: 4,
        colTablet: 6,
        mask: maskNumber,
      },
    },
  ];
};
export default Column;
