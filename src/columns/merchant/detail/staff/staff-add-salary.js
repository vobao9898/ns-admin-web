import React from 'react';
import { maskNumber } from 'utils';

const StaffAddSalaryColumns = ({ values, setValues }) => {
  return [
    {
      title: 'Salary',
      name: 'a',
      formItem: {
        type: 'title',
        render: () => <h4 className="text-xl text-blue-500 font-semibold">Salary</h4>,
        col: 12,
      },
    },
    {
      // title: 'Salary Per Hour',
      name: 'isSalaryPerHour',
      formItem: {
        type: 'checkbox',
        label: 'Salary Per Hour',
        col: 6,
      },
    },
    {
      title: 'Salary Per Hour',
      name: 'salaryPerHour',
      formItem: {
        mask: maskNumber,
        placeholder: '0.00',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            $
          </p>
        ),
        col: 6,
      },
    },
    {
      // title: 'Salary Commission',
      name: 'isSalaryCommission',
      formItem: {
        type: 'checkbox',
        label: 'Incomes',
        col: 6,
      },
    },
    {
      name: 'salaryCommission',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'addable',
        textAdd: 'Add more',
        onAdd: (value, form) => {
          form.setFieldsValue({ numberOfTenants: (value?.length || 0) + 1 });
          const isSalaryCommission = form.getFieldValue('isSalaryCommission');
          if (!isSalaryCommission) {
            form.setFieldsValue({ salaryCommission: [] });
            // phat set them so form nua -> ko thi mang rong ma form lai > 0
          }
        },
        column: [
          {
            title: 'From',
            name: 'from',
            formItem: {
              mask: maskNumber,
              addonBefore: () => (
                <p className="text-center" style={{ width: 40 }}>
                  $
                </p>
              ),
              placeholder: '0',
              // rules: [{ type: 'required' }],
            },
          },
          {
            title: 'To',
            name: 'to',
            formItem: {
              mask: maskNumber,
              addonBefore: () => (
                <p className="text-center" style={{ width: 40 }}>
                  $
                </p>
              ),
              placeholder: '0',
              rules: [
                // { type: 'required' },
                {
                  type: 'custom',
                  validator: ({ getFieldValue }) => ({
                    validator({ fullField }, value) {
                      const name = fullField.split('.');
                      name[name.length - 1] = 'from';
                      const numberFrom = parseFloat(getFieldValue(name) || 0);
                      const numberTo = parseFloat(value || 0);
                      if (numberFrom) {
                        if (!numberTo || numberFrom > numberTo) {
                          return Promise.reject(new Error('The to number cannot be less than the from number'));
                        }
                        return Promise.resolve();
                      }
                      return Promise.resolve();
                    },
                  }),
                },
              ],
            },
          },
          {
            title: 'Salary percented (%)',
            name: 'commission',
            formItem: {
              mask: maskNumber,
              addonBefore: () => (
                <p className="text-center" style={{ width: 40 }}>
                  %
                </p>
              ),
              col: 6,
              placeholder: '0',
              // rules: [{ type: 'required' }],
            },
          },
        ],
      },
    },

    {
      title: 'Product Salary',
      name: 'a',
      formItem: {
        type: 'title',
        render: () => <h4 className="text-xl text-blue-500 font-semibold">Product Salary</h4>,
        col: 12,
      },
    },
    {
      // title: 'Product Commission',
      name: 'isProductCommission',
      formItem: {
        type: 'checkbox',
        label: 'Product Commission',
        col: 6,
        onChange: (value, form) => {
          const data = form.getFieldsValue();
          if (value) {
            setValues({
              ...data,
              isProductCommission: value,
            });
            return;
          }
          setValues({
            ...data,
            isProductCommission: value,
            productCommission: '0.00',
          });
        },
      },
    },
    {
      title: 'Product Commission',
      name: 'productCommission',
      formItem: {
        mask: maskNumber,
        disabled: () => {
          return !values.isProductCommission;
        },
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            %
          </p>
        ),
        placeholder: '0.00',
        col: 6,
      },
    },
    {
      title: 'Tip Fee',
      name: 'a',
      formItem: {
        type: 'title',
        render: () => <h4 className="text-xl text-blue-500 font-semibold">Tip Fee</h4>,
        col: 12,
      },
    },
    {
      // title: 'Salary Commission',
      name: 'isTipPercent',
      formItem: {
        type: 'checkbox',
        label: 'Tip Percent',
        col: 6,
        onChange: (value, form) => {
          const data = form.getFieldsValue();
          let valueStemp = data?.isTipFixed || false;
          if (value) {
            if (valueStemp) {
              valueStemp = false;
            }
          }
          if (value) {
            setValues({
              ...data,
              isTipPercent: value,
              isTipFixed: valueStemp,
              tipFixed: '0.00',
            });
          } else {
            setValues({
              ...data,
              isTipPercent: value,
              isTipFixed: valueStemp,
              tipFixed: '0.00',
              tipPercent: '0.00',
            });
          }
        },
      },
    },
    {
      title: 'Percent',
      name: 'tipPercent',
      formItem: {
        mask: maskNumber,
        disabled: () => !values?.isTipPercent,
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            %
          </p>
        ),
        placeholder: '0.00',
        col: 6,
      },
    },
    {
      // title: 'Salary Commission',
      name: 'isTipFixed',
      formItem: {
        type: 'checkbox',
        label: 'Tip Fixed Amount',
        col: 6,
        onChange: (value, form) => {
          const data = form.getFieldsValue();
          let valueStemp = data?.isTipPercent || false;
          if (value) {
            if (valueStemp) {
              valueStemp = false;
            }
          }
          if (value) {
            setValues({
              ...data,
              isTipFixed: value,
              isTipPercent: valueStemp,
              tipPercent: '0.00',
            });
          } else {
            setValues({
              ...data,
              isTipFixed: value,
              isTipPercent: valueStemp,
              tipPercent: '0.00',
              tipFixed: '0.00',
            });
          }
        },
      },
    },
    {
      title: 'Amount',
      name: 'tipFixed',
      formItem: {
        mask: maskNumber,
        disabled: () => !values.isTipFixed,
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            $
          </p>
        ),
        placeholder: '0.00',
        col: 6,
        onChange: (value, form) => {
          const isTipFixed = form.getFieldValue('isTipFixed');
          if (!isTipFixed) form.setFieldsValue({ tipFixed: '' });
        },
      },
    },
    {
      title: 'Payout by Cash',
      name: 'a',
      formItem: {
        type: 'title',
        render: () => <h4 className="text-xl text-blue-500 font-semibold">Payout by Cash</h4>,
        col: 12,
      },
    },
    {
      title: 'Percent',
      name: 'cashPercent',
      formItem: {
        mask: maskNumber,
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            %
          </p>
        ),
        col: 6,
        placeholder: '0.00',
      },
    },
  ];
};

export default StaffAddSalaryColumns;
