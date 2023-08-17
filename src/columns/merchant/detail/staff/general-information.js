import React from 'react';
import { Select, Modal } from 'antd';
import { MerchantService } from 'services/merchant';
import debounce from 'lodash.debounce';
const { confirm } = Modal;
const Column = ({ listState, pinExists = [], merchantId, setGeneral }) => {
  return [
    {
      title: 'First Name',
      name: 'firstName',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'Last Name',
      name: 'lastName',
      formItem: {
        // rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'Display Name',
      name: 'displayName',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'Address',
      name: ['address', 'street'],
      formItem: {
        // rules: [{ type: 'required' }],
      },
    },
    {
      title: 'City',
      name: ['address', 'city'],
      formItem: {
        // rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'State',
      name: ['address', 'state'],
      formItem: {
        // rules: [{ type: 'required' }],
        col: 4,
        list: listState,
        type: 'select',
      },
    },
    {
      title: 'Zip code',
      name: ['address', 'zip'],
      formItem: {
        // rules: [{ type: 'required' }],
        col: 4,
        type: 'only_number',
        onChange: debounce(async (e, form, reRender, onFirstChange) => {
          const dataForm = form.getFieldValue();
          const data = await MerchantService.getZipCode({
            zipcode: e?.target?.value,
          });
          const address = {
            ...dataForm?.address,
            zip: data?.zipCode,
            city: data?.city,
            state: data?.stateId,
            stateName: data?.stateName,
          };
          const dataAll = {
            ...dataForm,
            address,
          };
          if (data) {
            confirm({
              title: 'Are you want to replace?',
              content: (
                <div>
                  <div>Business Address: {address?.address}</div>
                  <div>City: {address?.city}</div>
                  <div>State: {address?.stateName}</div>
                  <div>Zip code: {address?.zip}</div>
                </div>
              ),
              onOk() {
                setGeneral(dataAll);
              },
              onCancel() {},
            });
          }
        }, 500),
      },
    },
    {
      title: '',
      name: 'codePhone',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Phone',
      name: 'phone',
      formItem: {
        rules: [
          { type: 'min', value: 4 },
          { type: 'max', valuee: 12 },
        ],
        col: 6,
        mask: {
          mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
        },
        addonBefore: (form, onFirstChange) => (
          <Select
            className="code-select"
            style={{ width: 100, textAlign: 'center' }}
            defaultValue={form.getFieldValue('codePhone') || '+1'}
            onChange={(value) => {
              onFirstChange();
              return form.setFieldsValue({ codePhone: value });
            }}
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
      title: 'Contact Email',
      name: 'email',
      formItem: {
        rules: [{ type: 'email' }],
        type: 'email',
        col: 6,
      },
    },
    {
      title: 'Pin',
      name: 'pin',
      formItem: {
        typePassword: true,
        mask: {
          mask: '[9{1,4}]',
        },
        rules: [
          { type: 'required' },
          { type: 'min', value: 4 },
          { type: 'max', value: 4 },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                if (value?.length === 4 && pinExists.indexOf(value) > -1) {
                  return Promise.reject(new Error('Pincode is exists.'));
                }
                return Promise.resolve();
              },
            }),
          },
        ],
        col: 6,
      },
    },
    {
      title: 'Confirm Pin',
      name: 'ConfirmPin',
      formItem: {
        typePassword: true,
        mask: {
          mask: '[9{1,4}]',
        },
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('pin') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Pin do not match'));
              },
            }),
          },
        ],
        col: 6,
      },
    },
    {
      name: 'isActive',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'checkbox',
        label: 'Visible on App',
      },
    },
    {
      title: 'Role',
      name: 'roleName',
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
        type: 'select',
        list: [
          { value: 'Admin', label: 'Admin' },
          { value: 'Staff', label: 'Staff' },
          { value: 'Manager', label: 'Manager' },
        ],
      },
    },
    {
      title: 'Status',
      name: 'isDisabled',
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
        type: 'select',
        list: [
          { value: 0, label: 'Active' },
          { value: 1, label: 'Inactive' },
        ],
        placeholder: 'Status',
      },
    },
    {
      title: 'Image',
      name: 'imageUrl',
      formItem: {
        type: 'upload',
        col: 3,
        onlyImage: true,
        action: 'File',
      },
    },
    {
      title: 'Services (Assign services this staff can be perform)',
      formItem: {
        render: () => (
          <h4 className="font-semibold text-xl text-blue-500">Services (Assign services this staff can be perform)</h4>
        ),
      },
    },
  ];
};

export default Column;
