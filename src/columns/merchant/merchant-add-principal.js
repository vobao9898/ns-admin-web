import React from 'react';
import { Select, Modal } from 'antd';
import { MerchantService } from 'services/merchant';
import getCodeAndPhone from 'utils/getCodAndPhone';
import debounce from 'lodash.debounce';
import moment from 'moment';

const ColumnMerchantAddPrincipal = ({ stateData, modalFormAddPricipalRef, currentPrincipal }) => {
  const { confirm } = Modal;

  const listState = stateData && stateData.map((item) => ({ label: item?.name, value: item?.stateId }));
  return [
    {
      title: 'First Name',
      name: 'firstName',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 3,
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
        col: 3,
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
        col: 3,
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
        col: 3,
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
      name: 'codeMobilePhone',
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
        col: 3,
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
      title: 'Mobile Phone',
      name: 'mobilePhone',
      tableItem: {
        sorter: false,
      },
      formItem: {
        col: 3,
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
        rules: [{ type: 'required' }, { type: 'email' }],
        col: 3,
        colTablet: 6,
        onBlur: async (e, form, onFirstChange) => {
          const email = form.getFieldValue('email');
          const currentEmail = form.getFieldValue('currentEmail');
          const regexEmail =
            /^(([^<>()[\]\\.,;:$%^&*\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          if (
            !regexEmail.test(email.trim()) ||
            (!currentEmail && email === currentPrincipal?.email) ||
            email === currentEmail
          )
            return;

          const data = await MerchantService.getPrincipalByKey({
            key: 'email',
            value: email,
          });
          if (!data) return;

          confirm({
            title: 'Email is exist. Are you want to replace?',
            onOk() {
              [data.codeHomePhone, data.homePhone] = getCodeAndPhone(data?.homePhone);
              [data.codeMobilePhone, data.mobilePhone] = getCodeAndPhone(data?.mobilePhone);
              modalFormAddPricipalRef.current.handleEdit({
                ...data,
                id: data?.principalId,
                principalId: data?.principalId,
                addressPrincipal: {
                  address: data?.address,
                  city: data?.city,
                  state: data?.stateId,
                  zip: data?.zip,
                },
                driverLicense: data?.driverNumber,
                yearAtThisAddress: data?.yearAddress,
                imageUrl: data?.imageUrl || '',
                birthDate: moment(data?.birthDate),
                currentEmail: email,
                currentSsn: data?.ssn,
              });
              onFirstChange();
            },
            onCancel() {
              form.setFieldsValue({ ...currentPrincipal, birthDate: moment(currentPrincipal?.birthDate) });
            },
          });
        },
      },
    },
    {
      title: 'Address',
      name: ['addressPrincipal', 'address'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 3,
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
        col: 3,
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
        col: 3,
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
        col: 3,
        colTablet: 6,
        type: 'only_number',
        onChange: debounce(async (e, form, reRender, onFirstChange) => {
          const dataForm = form.getFieldValue();
          const data = await MerchantService.getZipCode({
            zipcode: e?.target?.value,
          });
          const addressPrincipal = {
            ...dataForm?.addressPrincipal,
            zip: data?.zipCode,
            city: data?.city,
            state: data?.stateId,
            stateName: data?.stateName,
          };
          const dataAll = {
            ...dataForm,
            addressPrincipal,
          };
          if (data) {
            confirm({
              title: 'Are you want to replace?',
              content: (
                <div>
                  <div>Business Address: {addressPrincipal?.address}</div>
                  <div>City: {addressPrincipal?.city}</div>
                  <div>State: {addressPrincipal?.stateName}</div>
                  <div>Zip code: {addressPrincipal?.zip}</div>
                </div>
              ),
              onOk() {
                form?.setFieldsValue(dataAll);
                console.log(dataAll);
                const isItem = true;
                modalFormAddPricipalRef?.current?.handleEdit({ ...dataAll }, isItem);
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
        col: 3,
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
        rules: [{ type: 'required' }],
        mask: {
          mask: '[*{1,3}][-*{1,2}][-*{1,4}]',
        },
        col: 3,
        colTablet: 6,
        onBlur: async (e, form, onFirstChange) => {
          const ssn = e.target.value;
          const currentSsn = form.getFieldValue('currentSsn');
          if (!ssn || (!currentSsn && ssn === currentPrincipal?.ssn) || ssn === currentSsn) return;

          const data = await MerchantService.getPrincipalByKey({
            key: 'ssn',
            value: ssn,
          });
          if (!data) return;

          confirm({
            title: 'Social Security Number is exist. Are you want to replace?',
            onOk() {
              [data.codeHomePhone, data.homePhone] = getCodeAndPhone(data?.homePhone);
              [data.codeMobilePhone, data.mobilePhone] = getCodeAndPhone(data?.mobilePhone);

              modalFormAddPricipalRef.current.handleEdit({
                ...data,
                id: data?.id,
                principalId: data?.id,
                addressPrincipal: {
                  address: data?.address,
                  city: data?.city,
                  state: data?.stateId,
                  zip: data?.zip,
                },
                driverLicense: data?.driverNumber,
                yearAtThisAddress: data?.yearAddress,
                imageUrl: data?.imageUrl || '',
                birthDate: moment(data?.birthDate),
                currentEmail: data?.email,
                currentSsn: data?.ssn,
              });
              onFirstChange();
            },
            onCancel() {
              form.setFieldsValue({ ...currentPrincipal, birthDate: moment(currentPrincipal?.birthDate) });
            },
          });
        },
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
        col: 3,
        colTablet: 6,
        disabledDate: (current, form) => current > moment(),
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
        col: 3,
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
        col: 3,
        colTablet: 6,
        type: 'select',
        list: listState,
        placeholder: 'State Issued',
      },
    },
    {
      title: 'Driver License Picture',
      name: 'imageUrl',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        type: 'upload',
        col: 3,
        colTable: 3,
        onlyImage: true,
        accept: 'image/*,.pdf',
        action: 'File',
        allowUploadPdf: true,
      },
    },
  ];
};
export default ColumnMerchantAddPrincipal;
