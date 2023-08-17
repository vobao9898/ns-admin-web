import React from 'react';
import { Modal, Select } from 'antd';
import moment from 'moment';
import { MerchantService } from 'services/merchant';
import debounce from 'lodash.debounce';
const { confirm } = Modal;

const Column = ({ state, modalFormRef, currentPrincipal }) => {
  const listState = state && state.map((item) => ({ label: item?.name, value: item?.stateId }));

  return [
    {
      name: 'currentEmail',
      formItem: {
        type: 'hidden',
      },
    },
    {
      name: 'currentSsn',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'First Name',
      name: 'firstName',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Last Name',
      name: 'lastName',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Title/Position',
      name: 'title',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Ownership',
      name: 'ownerShip',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'number',
      },
    },
    {
      name: 'codeHomePhone',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Home Phone',
      name: 'homePhone',
      tableItem: {
        sorter: false,
      },
      formItem: {
        col: 4,
        colTablet: 6,
        rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', valuee: 12 }],
        mask: {
          mask: '[9{1,3}][-9{1,3}][-9{1,4}]',
        },
        addonBefore: (form, onFirstChange) => {
          return (
            <Select
              className="code-select custom-select-phone-number"
              style={{ width: 100, textAlign: 'center' }}
              defaultValue={form.getFieldValue('codeHomePhone') || '+1'}
              onChange={(value) => {
                onFirstChange();
                form.setFieldsValue({ codeHomePhone: value });
              }}
            >
              <Select.Option value={'+1'}>
                <span className="inline-flex items-center">+1</span>
              </Select.Option>
              <Select.Option value={'+84'}>
                <span className="inline-flex items-center">+84</span>
              </Select.Option>
            </Select>
          );
        },
      },
    },
    {
      name: 'codeMobilePhone',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Mobile Phone',
      name: 'mobilePhone',
      tableItem: {
        sorter: false,
      },
      formItem: {
        col: 4,
        colTablet: 6,
        rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', valuee: 12 }],
        mask: {
          mask: '[9{1,3}][-9{1,3}][-9{1,4}]',
        },
        addonBefore: (form, onFirstChange) => (
          <Select
            className="code-select custom-select-phone-number"
            style={{ width: 100, textAlign: 'center' }}
            defaultValue={form.getFieldValue('codeMobilePhone') || '+1'}
            onChange={(value) => {
              onFirstChange();
              form.setFieldsValue({ codeMobilePhone: value });
            }}
          >
            <Select.Option value={'+1'}>
              <span className="inline-flex items-center">+1</span>
            </Select.Option>
            <Select.Option value={'+84'}>
              <span className="inline-flex items-center">+84</span>
            </Select.Option>
          </Select>
        ),
      },
    },
    {
      title: 'Email Address',
      name: 'email',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [
          { type: 'required' },
          { type: 'email' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              async validator(rule, value) {
                const email = getFieldValue('email');
                const currentEmail = getFieldValue('currentEmail');
                const regexEmail =
                  /^(([^<>()[\]\\.,;:$%^&*\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (
                  !regexEmail.test(email?.trim()) ||
                  (!currentEmail && email === currentPrincipal?.email) ||
                  email === currentEmail
                )
                  return;

                const data = await MerchantService.getPrincipalByKey({
                  key: 'email',
                  value: email,
                });

                if (!data) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Email is exist. Please enter another email'));
              },
            }),
          },
        ],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Address',
      name: ['addressPrincipal', 'address'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'City',
      name: ['addressPrincipal', 'city'],
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'State',
      name: ['addressPrincipal', 'state'],
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'select',
        list: listState,
        placeholder: 'State',
      },
    },
    {
      title: 'Zip Code',
      name: ['addressPrincipal', 'zip'],
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'only_number',
        onChange: debounce(async (e, form, reRender, onFirstChange) => {
          const dataForm = form.getFieldValue();
          const data = await MerchantService.getZipCode({
            zipcode: e?.target?.value,
          });

          if (!data) return;
          const businessAddress = {
            ...dataForm?.addressPrincipal,
            zip: data?.zipCode,
            city: data?.city,
            state: data?.stateId,
            stateName: data?.stateName,
          };
          const dataS = {
            ...dataForm,
            addressPrincipal: businessAddress,
          };
          if (data) {
            confirm({
              title: 'Are you want to replace?',
              content: (
                <div>
                  <div>Business Address: {businessAddress?.address}</div>
                  <div>City: {businessAddress?.city}</div>
                  <div>State: {businessAddress?.stateName}</div>
                  <div>Zip code: {businessAddress?.zip}</div>
                </div>
              ),
              onOk() {
                form?.setFieldsValue(dataS);
                const isItem = true;
                modalFormRef?.current?.handleEdit({ ...dataS, id: currentPrincipal?.principalId }, isItem);
                onFirstChange();
              },
              onCancel() {},
            });
          }
        }, 500),
      },
    },
    {
      title: 'Year at this Address',
      name: 'yearAtThisAddress',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'number',
      },
    },
    {
      title: 'Social Security Number',
      name: 'ssn',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              async validator(rule, value) {
                let ssn = getFieldValue('ssn');
                let currentSsn = getFieldValue('currentSsn');

                ssn = ssn ? ssn.replaceAll('-', '') : ssn;
                currentSsn = currentSsn ? currentSsn.replaceAll('-', '') : currentSsn;

                if (!ssn || (!currentSsn && ssn === currentPrincipal?.ssn) || ssn === currentSsn) return;

                const data = await MerchantService.getPrincipalByKey({
                  key: 'ssn',
                  value: ssn,
                });

                if (!data) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Social Security Number is exist. Please enter another social security number'),
                );
              },
            }),
          },
        ],
        mask: {
          mask: '[9{1,3}][-9{1,2}][-9{1,4}]',
        },
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Date of birth',
      name: 'birthDate',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        type: 'date',
        col: 4,
        colTablet: 6,
        disabledDate: (current, form) => current > moment(),
      },
    },
    {
      title: 'Email Address',
      name: 'EmailAddress',
      tableItem: {
        sorter: false,
      },
    },
    {
      title: 'Driver License Number',
      name: 'driverLicense',
      tableItem: {
        sorter: false,
      },
      formItem: {
        type: 'text',
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                if (/^[A-Za-z0-9]*$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Driver License Number Invalid!'));
              },
            }),
          },
        ],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'State Issued',
      name: 'stateIssued',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'select',
        list: listState,
        placeholder: 'State Issued',
      },
    },
    {
      formItem: {
        type: 'hidden',
        col: 3,
        colTablet: 6,
      },
    },
    {
      title: 'Driver License Picture',
      name: 'imageUrl',
      tableItem: {
        sorter: false,
      },
      formItem: {
        type: 'upload',
        col: 3,
        action: 'File',
        onlyImage: true,
        accept: 'image/*,.pdf',
        allowUploadPdf: true,
        rules: [{ type: 'required' }],
      },
    },
  ];
};
export default Column;
