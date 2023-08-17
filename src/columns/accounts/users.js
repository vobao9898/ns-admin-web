import React from 'react';
import { Select } from 'antd';
import moment from 'moment';
// import us from 'assets/images/us.png';
// import canada from 'assets/images/canada.png';
// import vietnam from 'assets/images/vietnam.png';

const ColumnUsers = ({ state = [] }) => {
  return [
    {
      title: 'Personal Information',
      formItem: {
        type: 'title',
        render: () => <h4 className="font-semibold text-blue-500 text-xl">Personal Information</h4>,
      },
    },
    {
      title: 'First Name',
      name: 'firstName',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Last Name',
      name: 'lastName',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
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
        col: 4,
        colTablet: 6,
        isEdit: true,
        mask: {
          mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
        },
        rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', value: 12 }],
        addonBefore: (form) => (
          <Select
            className="code-select"
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
        col: 4,
        colTablet: 6,
        isEdit: true,
      },
    },
    {
      title: 'City',
      name: 'city',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'State',
      name: 'stateId',
      formItem: {
        type: 'select',
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        api: {
          link: (getFieldValue) => '/State',
          format: (item) => ({ label: item?.name, value: item?.stateId }),
        },
      },
    },
    {
      title: 'Email',
      name: 'email',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        isEdit: true,
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
    {
      title: 'Birthday',
      name: 'birthDate',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'date',
        col: 4,
        colTablet: 6,
        isEdit: true,
        disabledDate: (current) => current && current > moment().endOf('day'),
      },
    },
    {
      title: 'Role',
      name: 'waRoleId',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'select',
        list: [
          { label: 'Administrator', value: '1' },
          { label: 'Manager', value: '2' },
          { label: 'Staff Lv1', value: '3' },
          { label: 'Staff Lv2', value: '4' },
        ],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Avatar',
      name: 'fileId',
      formItem: {
        type: 'upload',
        col: 3,
        onlyImage: true,
        action: 'File',
      },
    },
    {
      title: 'Account Information',
      formItem: {
        type: 'title',
        render: () => <h4 className="font-semibold text-blue-500 text-xl">Account Information</h4>,
      },
    },
    {
      title: 'User Name',
      name: 'userName',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Password',
      name: 'password',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'password',
        col: 4,
        colTablet: 6,
      },
    },
    {
      name: 'confirmPassword',
      title: 'Confirm New Password',
      formItem: {
        col: 4,
        colTablet: 6,
        type: 'password',
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Two passwords that you enter is inconsistent!'));
              },
            }),
          },
        ],
      },
    },
  ];
};

export default ColumnUsers;
