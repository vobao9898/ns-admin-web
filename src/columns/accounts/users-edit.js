import React from 'react';
import moment from 'moment';
import { Select } from 'antd';
// import us from 'assets/images/us.png';
// import canada from 'assets/images/canada.png';
// import vietnam from 'assets/images/vietnam.png';

const ColumnUsersEdit = () => {
  return [
    {
      title: 'Contact Information',
      formItem: {
        render: () => <h4 className="font-semibold text-xl text-blue-500">Contact Information</h4>,
      },
    },
    {
      name: 'code',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Phone number',
      name: 'phone',
      tableItem: {},
      formItem: {
        col: 6,
        colTablet: 12,
        rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', value: 12 }],
        mask: {
          mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
        },
        addonBefore: (form) => (
          <Select
            className="phone-code"
            style={{ width: 100, textAlign: 'center' }}
            defaultValue={form.getFieldValue('code') || '+1'}
            onChange={(value) => form.setFieldsValue({ code: value })}
          >
            <Select.Option value={'+1'}>
              <span className="inline-flex items-center">
                {/* <img className="h-4 mr-1" src={us} alt="US" /> */}
                +1
              </span>
            </Select.Option>
            <Select.Option value={'+84'}>
              <span className="inline-flex items-center">
                {/* <img className="h-4 mr-1" src={vietnam} alt="Vietnam" /> */}
                +84
              </span>
            </Select.Option>
          </Select>
        ),
      },
    },
    {
      title: 'Address',
      name: 'address',
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
        colTablet: 6,
      },
    },
    {
      title: 'Email',
      name: 'email',
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
        colTablet: 6,
      },
    },
    {
      title: 'Basic Information',
      formItem: {
        render: () => <h4 className="font-semibold text-xl text-blue-500">Basic Information</h4>,
      },
    },
    {
      title: 'Birthday',
      name: 'birthDate',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'date',
        col: 6,
        colTablet: 6,
        disabledDate: (current) => current && current > moment().endOf('day'),
      },
    },
    {
      title: 'Gender',
      name: 'gender',
      formItem: {
        type: 'select',
        placeholder: 'Select Gender',
        list: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ],
        col: 4,
        colTablet: 6,
      },
    },
  ];
};

export default ColumnUsersEdit;
