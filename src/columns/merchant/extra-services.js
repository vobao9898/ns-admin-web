import { Select } from 'antd';
import React from 'react';
import { maskNumber } from 'utils';

const Column = ({ t, handleEdit, handleDelete, extrasList, isEdit }) => {
  return [
    {
      title: '',
      formItem: {
        render: (form, values, generateForm, index) => {
          const list =
            extrasList &&
            extrasList
              ?.filter((item) => item?.isDeleted !== 1)
              ?.map((item) => ({ label: item?.name, value: item?.extraId }));
          return (
            <>
              {generateForm(
                {
                  title: '123',
                  name: 'extras',
                  formItem: {
                    type: 'addable',
                    textAdd: 'Add Extra',
                    isTable: false,
                    onAdd: (value, form) => {
                      const all = form.getFieldValue('extras');
                      if (all[all?.length - 1]?.isDisabled === undefined) {
                        all[all?.length - 1] = { description: '', isDisabled: 0 };
                      }
                      form.setFieldsValue({ number: (value?.length || 1) + 1 });
                      form.setFieldsValue({ extras: all });
                    },
                    column: [
                      {
                        title: 'Extra Name',
                        name: 'name',
                        formItem: {
                          rules: [{ type: 'required' }],
                        },
                      },
                      {
                        title: 'Description',
                        name: 'description',
                        formItem: {
                          type: 'textarea',
                        },
                      },
                      {
                        title: 'Duration (Min)',
                        name: 'duration',
                        formItem: {
                          rules: [{ type: 'required' }],
                          type: 'only_number',
                          addonBefore: (form) => (
                            <p className="text-center" style={{ width: 40 }}>
                              Min
                            </p>
                          ),
                          placeholder: '0',
                        },
                      },
                      {
                        title: 'Price ($)',
                        name: 'price',
                        formItem: {
                          rules: [{ type: 'required' }],
                          mask: maskNumber,
                          placeholder: '0.00',
                          addonBefore: (form) => (
                            <p className="text-center" style={{ width: 40 }}>
                              $
                            </p>
                          ),
                        },
                      },
                      {
                        title: 'Surcharged',
                        name: 'supplyFee',
                        formItem: {
                          mask: maskNumber,
                          addonBefore: (form) => (
                            <p className="text-center" style={{ width: 40 }}>
                              $
                            </p>
                          ),
                          placeholder: '0.00',
                        },
                      },
                      {
                        title: 'Status',
                        name: 'isDisabled',
                        formItem: {
                          rules: [{ type: 'required' }],
                          type: 'select',
                          list: [
                            { value: 0, label: 'Active' },
                            { value: 1, label: 'Inactive' },
                          ],
                        },
                      },
                    ],
                  },
                },
                index + '1',
              )}
              <h4 className="font-semibold">Select Extra Existing</h4>
              <Select
                style={{ width: '100%' }}
                placeholder={'Select...'}
                onSelect={(values) => {
                  const [extra] = extrasList && extrasList.filter((item) => item.extraId === values);
                  const newExtra = {
                    description: extra?.description,
                    duration: extra?.duration,
                    isDisabled: extra?.isDisabled,
                    name: extra?.name,
                    price: extra?.price,
                    supplyFee: extra?.supplyFee,
                  };
                  let all = form.getFieldValue('extras');
                  if (all === undefined) all = [];
                  // khong truyen extraId
                  form.setFieldsValue({ extras: [...all, isEdit ? newExtra : extra] });
                }}
              >
                {list &&
                  list.map((item, index) => (
                    <Select.Option key={index} value={item?.value}>
                      {item?.label}
                    </Select.Option>
                  ))}
              </Select>
            </>
          );
        },
      },
    },
  ];
};

export default Column;
