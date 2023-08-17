import React from 'react';

const ColumnSalary = ({ salary }) => {
  return [
    {
      title: 'Salary',
      formItem: {
        render: () => <h4 className="font-semibold text-xl teext-blue-500">Salary</h4>,
        col: 4,
      },
    },
    {
      title: '',
      name: 'isSalaryPerHour',
      formItem: {
        type: 'checkbox',
        label: 'Salary Per Hour',
        col: 4,
        colTablet: 4,
      },
    },
    {
      title: '',
      formItem: {
        col: 4,
        type: 'hidden',
      },
    },
    {
      title: 'Salary Per Hour',
      name: 'perHour',
      formItem: {
        col: 4,
        colTablet: 4,
        mask: {
          mask: '[9{}][.][9{2}]',
        },
        placeholder: '0.00',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            $
          </p>
        ),
      },
    },
    {
      title: 'From',
      name: 'salaryFrom',
      formItem: {
        col: 4,
        colTablet: 4,
        mask: {
          mask: '[9{}][.][9{}]',
        },
        placeholder: '0',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            $
          </p>
        ),
        onChange: (value, form) => {
          form.setFieldsValue({ salaryTo: '' });
        },
      },
    },
    {
      title: 'To',
      name: 'salaryTo',
      formItem: {
        rules: [
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                const fromValue = getFieldValue('salaryFrom');
                if (fromValue) {
                  if (!value) {
                    return Promise.reject(new Error('From value can not be higher than To value'));
                  }

                  if (value && +value >= +fromValue) {
                    return Promise.resolve();
                  } else return Promise.reject(new Error('From value can not be higher than To value'));
                }
              },
            }),
          },
        ],
        col: 4,
        mask: {
          mask: '[9{}][.][9{}]',
        },
        placeholder: '0',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            $
          </p>
        ),
      },
    },
    {
      title: 'Salary percented(%)',
      name: 'salaryPercent',
      formItem: {
        col: 4,
        mask: {
          mask: '[9{}][.][9{}]',
        },
        placeholder: '0',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            %
          </p>
        ),
      },
    },
    {
      title: 'Product Salary',
      formItem: {
        render: () => <h4 className="text-xl text-blue-500 font-semibold">Product Salary</h4>,
        col: 12,
      },
    },
    {
      title: '',
      name: 'productSalaryComission',
      formItem: {
        col: 4,
        mask: {
          mask: '[9{}][.][9{2}]',
        },
        // isdisabled: true,
        placeholder: '0',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            %
          </p>
        ),
      },
    },
    {
      title: 'Tip Fee',
      formItem: {
        type: 'title',
        col: 12,
        render: () => <h4 className="text-xl text-blue-500 font-semibold">Tip Fee</h4>,
      },
    },
    {
      title: 'Percent',
      name: 'percent',
      formItem: {
        col: 4,
        mask: {
          mask: '[9{}][.][9{2}]',
        },
        placeholder: '0',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            %
          </p>
        ),
      },
    },
    {
      title: 'Amount',
      name: 'fixedAmount',
      formItem: {
        col: 4,
        mask: {
          mask: '[9{}][.][9{2}]',
        },
        placeholder: '0.00',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            $
          </p>
        ),
      },
    },
    {
      title: 'Payout with Cash',
      formItem: {
        render: () => <h4 className="text-xl text-blue-500 font-semibold">Payout with Cash</h4>,
        col: 12,
      },
    },
    {
      title: 'Percent(%)',
      name: 'cashPercent',
      formItem: {
        col: 4,
        mask: {
          mask: '[9{}][.][9{2}]',
        },
        placeholder: '0.00',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            %
          </p>
        ),
      },
    },
  ];
};

export default ColumnSalary;
