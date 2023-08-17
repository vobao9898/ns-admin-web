import React from 'react';
import moment from 'moment';
import { Select, Modal } from 'antd';
import { MerchantService } from 'services/merchant';
import getCodeAndPhone from 'utils/getCodAndPhone';
import debounce from 'lodash.debounce';
const { confirm } = Modal;
const isDisableField = (values, index) => {
  const i = index.split('_')[1];
  return Boolean(values && values.principals && values.principals[i] && values.principals[i].principalId);
};

const ColumnPendingRequest = ({ form, state = [], setFileId, setPending, pending }) => {
  return [
    {
      title: 'ID',
      name: 'merchantId',
      tableItem: {
        render: (text, item) => item && <div>{item?.merchantId}</div>,
      },
    },
    {
      title: 'Submitted Date',
      name: 'createdDate',
      tableItem: {
        render: (text) => moment(text).format('L'),
      },
    },
    {
      title: 'DBA',
      name: 'businessName',
      tableItem: {},
    },
    {
      title: 'Owner',
      name: 'owner',
      tableItem: {
        render: (text, item) =>
          item?.principals?.length === 0 ? '' : item?.principals[0]?.firstName + ' ' + item?.principals[0]?.lastName,
      },
    },
    {
      title: 'Email',
      name: 'email',
      tableItem: {
        render: (text, item) => text && item?.email,
      },
    },
    {
      title: 'Store Phone',
      name: 'phoneBusiness',
      tableItem: {
        render: (text, item) => item?.general?.phoneBusiness,
      },
    },
    {
      title: 'Contact Phone',
      name: 'phoneContact',
      tableItem: {
        render: (text, item) => item?.general?.phoneContact,
      },
    },
    {
      title: 'Status',
      name: 'status',
      tableItem: {
        sorter: true,
        render: (text, item) => <p className="capitalize">{item?.status === 0 ? 'Pending' : 'Handling'}</p>,
      },
    },
    // Form
    {
      title: 'General Information',
      formItem: {
        render: () => <h4 className="font-semibold text-xl text-blue-500">General Information</h4>,
        col: 12,
      },
    },
    {
      title: 'Legal Business Name',
      name: ['generalInfo', 'legalBusinessName'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Doing Business As (DBA)',
      name: ['generalInfo', 'doBusinessName'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Merchant type',
      name: 'type',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'select',
        list: [
          { label: 'Salon POS', value: 'SalonPOS' },
          { label: 'Retailer', value: 'Retailer' },
          { label: 'Table Management', value: 'Restaurant' },
        ],
      },
    },
    {
      title: 'Federal Tax ID',
      name: ['generalInfo', 'tax'],
      formItem: {
        rules: [{ type: 'required' }],
        type: 'only_number',
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Business Address (no P.O. Boxes)',
      name: ['generalInfo', 'businessAddress', 'address'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 12,
      },
    },
    {
      title: 'City',
      name: ['generalInfo', 'businessAddress', 'city'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'State',
      name: ['generalInfo', 'businessAddress', 'stateId'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'select',
        list: state,
      },
    },
    {
      title: 'Zip Code',
      name: ['generalInfo', 'businessAddress', 'zip'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'only_number',
        placeholder: 'Enter Zip code (timezone will collect based on this filed)',
        onChange: debounce(async (e, form, reRender, onFirstChange) => {
          const dataForm = form.getFieldValue();
          const data = await MerchantService.getZipCode({
            zipcode: e?.target?.value,
          });
          const businessAddress = {
            ...dataForm?.generalInfo,
            zip: data?.zipCode,
            city: data?.city,
            stateId: data?.stateId,
            stateName: data?.stateName,
          };
          const dataAll = {
            ...dataForm,
            ...businessAddress,
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
                const dataS = {
                  ...pending,
                  general: dataAll,
                };
                setPending(dataS);
                onFirstChange();
              },
              onCancel() {},
            });
          }
        }, 500),
      },
    },
    {
      title: 'DBA Address',
      name: ['generalInfo', 'dbaAddress', 'Address'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 12,
      },
    },
    {
      title: 'City',
      name: ['generalInfo', 'dbaAddress', 'City'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'State',
      name: ['generalInfo', 'dbaAddress', 'State'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'select',
        list: state,
      },
    },
    {
      title: 'Zip Code',
      name: ['generalInfo', 'dbaAddress', 'Zip'],
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
          const businessAddress = {
            ...dataForm?.generalInfo,
            dbaAddress: {
              ...dataForm?.generalInfo.dbaAddress,
              Zip: data?.zipCode,
              City: data?.city,
              State: data?.stateId,
              stateName: data?.stateName,
            },
          };
          const dataAll = {
            ...dataForm,
            ...businessAddress,
          };
          if (data) {
            confirm({
              title: 'Are you want to replace?',
              content: (
                <div>
                  <div>Business Address: {businessAddress?.address}</div>
                  <div>City: {data?.city}</div>
                  <div>State: {data?.stateName}</div>
                  <div>Zip code: {data?.zipCode}</div>
                </div>
              ),
              onOk() {
                const dataS = {
                  ...pending,
                  general: dataAll,
                };
                setPending(dataS);
                onFirstChange();
              },
              onCancel() {},
            });
          }
        }, 500),
      },
    },
    {
      name: ['generalInfo', 'codePhoneBusiness'],
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Business Phone Number',
      name: ['generalInfo', 'phoneBusiness'],
      formItem: {
        mask: {
          mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
        },
        addonBefore: (form) => (
          <Select
            className="code-select"
            style={{ width: 100, textAlign: 'center' }}
            defaultValue={form.getFieldValue(['generalInfo', 'codePhoneBusiness']) || '+1'}
            onChange={(codePhoneBusiness) => {
              const generalInfo = form.getFieldValue('generalInfo');
              generalInfo.codePhoneBusiness = codePhoneBusiness;
              form.setFieldsValue({ generalInfo });
            }}
          >
            <Select.Option value="+1">
              <span className={'inline-flex items-center'}>+1</span>
            </Select.Option>
            <Select.Option value="+84">
              <span className={'inline-flex items-center'}>+84</span>
            </Select.Option>
          </Select>
        ),
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Contact Email Address',
      name: ['generalInfo', 'emailContact'],
      formItem: {
        rules: [{ type: 'required' }, { type: 'email' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'First Name',
      name: ['generalInfo', 'firstName'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Last Name',
      name: ['generalInfo', 'lastName'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Title/Position',
      name: ['generalInfo', 'title'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      name: ['generalInfo', 'codePhoneContact'],
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Contact Phone Number',
      name: ['generalInfo', 'phoneContact'],
      formItem: {
        mask: {
          mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
        },
        addonBefore: (form) => (
          <Select
            className="code-select"
            style={{ width: 100, textAlign: 'center' }}
            defaultValue={form.getFieldValue(['generalInfo', 'codePhoneContact']) || '+1'}
            onChange={(codePhoneContact) => {
              const generalInfo = form.getFieldValue('generalInfo');
              generalInfo.codePhoneContact = codePhoneContact;
              form.setFieldsValue({ codePhoneContact });
            }}
          >
            <Select.Option value="+1">
              <span className={'inline-flex items-center'}>+1</span>
            </Select.Option>
            <Select.Option value="+84">
              <span className={'inline-flex items-center'}>+84</span>
            </Select.Option>
          </Select>
        ),
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    // Bank Info
    {
      title: 'Bank Information',
      formItem: {
        render: () => <h4 className="font-semibold text-xl text-blue-500">Bank Information</h4>,
        col: 12,
      },
    },
    {
      title: 'Account Holder Name',
      name: ['bankInfo', 'accountHolderName'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Bank Name',
      name: ['bankInfo', 'name'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Routing Number (ABA)',
      name: ['bankInfo', 'routingNumber'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'only_number',
      },
    },
    {
      title: 'Account Number (DDA)',
      name: ['bankInfo', 'accountNumber'],
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'only_number',
      },
    },
    {
      title: '',
      formItem: {
        type: 'hidden',
        col: 8,
      },
    },
    {
      title: 'Void Check',
      name: ['bankInfo', 'imageUrl'],
      formItem: {
        type: 'upload',
        rules: [{ type: 'required' }],
        col: 6,
        onlyImage: true,
        accept: 'image/*,.pdf',
        action: 'File',
        allowUploadPdf: true,
      },
    },
    {
      name: 'principals',
      formItem: {
        type: 'addable',
        textAdd: 'Add Principal',
        onAdd: (value, form) => form.setFieldsValue({ principalNum: (value?.length || 1) + 1 }),
        isTable: false,
        column: [
          {
            formItem: {
              render: (form, value, generateForm, index) => {
                const i = index.split('_')[1];
                return <h4 className="font-semibold text-blue-500 text-xl">Principal {+i + 1}</h4>;
              },
            },
          },
          {
            title: '',
            name: 'principalId',
            formItem: {
              type: 'hidden',
            },
          },
          {
            title: '',
            name: 'fileId',
            formItem: {
              type: 'hidden',
            },
          },
          {
            title: 'First Name',
            name: 'firstName',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'Last Name',
            name: 'lastName',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'Title/Position',
            name: 'title',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'Ownership (%)',
            name: 'ownerShip',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              type: 'only_number',
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'Home Phone',
            name: 'homePhone',
            formItem: {
              col: 4,
              colTablet: 6,
              render: (form, values, generateForm, index) => {
                const i = index.split('_')[1];
                return (
                  <>
                    {generateForm(
                      {
                        title: 'Home Phone',
                        name: [i, 'homePhone'],
                        formItem: {
                          rules: [{ type: 'required' }],
                          mask: {
                            mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
                          },
                          disabled: () => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : values;
                            return isDisableField(data, index);
                          },
                          addonBefore: (form) => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : values;
                            return (
                              <Select
                                className="code-select"
                                disabled={isDisableField(data, index)}
                                style={{ width: 100, textAlign: 'center' }}
                                defaultValue={form.getFieldValue(['principals', i, 'codeHomePhone']) || '+1'}
                                onChange={(codeHomePhone) => {
                                  const all = form.getFieldValue();
                                  if (all?.principals[i]) {
                                    all.principals[i].codeHomePhone = codeHomePhone;
                                  }
                                  form.setFieldsValue({ principals: all?.principals });
                                }}
                              >
                                <Select.Option value="+1">
                                  <span className={'inline-flex items-center'}>+1</span>
                                </Select.Option>
                                <Select.Option value="+84">
                                  <span className={'inline-flex items-center'}>+84</span>
                                </Select.Option>
                              </Select>
                            );
                          },
                        },
                      },
                      index + '1',
                    )}
                  </>
                );
              },
            },
          },
          {
            title: 'Mobile Phone',
            name: 'mobilePhone',
            formItem: {
              col: 4,
              colTablet: 6,
              render: (form, value, generateForm, index) => {
                const i = index.split('_')[1];
                return (
                  <>
                    {generateForm(
                      {
                        title: 'Mobile Phone',
                        name: [i, 'mobilePhone'],
                        formItem: {
                          rules: [{ type: 'required' }],
                          mask: {
                            mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
                          },
                          disabled: () => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : value;
                            return isDisableField(data, index);
                          },
                          addonBefore: (form) => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : value;
                            return (
                              <Select
                                className="code-select"
                                style={{ width: 100, textAlign: 'center' }}
                                disabled={isDisableField(data, index)}
                                defaultValue={form.getFieldValue(['principals', i, 'codeMobilePhone']) || '+1'}
                                onChange={(codeMobilePhone) => {
                                  form.setFieldsValue({ codeMobilePhone });
                                  const all = form.getFieldValue();
                                  if (all?.principals[i]) {
                                    all.principals[i].codeMobilePhone = codeMobilePhone;
                                  }
                                  form.setFieldsValue({ principals: all?.principals });
                                }}
                              >
                                <Select.Option value="+1">
                                  <span className={'inline-flex items-center'}>+1</span>
                                </Select.Option>
                                <Select.Option value="+84">
                                  <span className={'inline-flex items-center'}>+84</span>
                                </Select.Option>
                              </Select>
                            );
                          },
                        },
                      },
                      index + '1',
                    )}
                  </>
                );
              },
            },
          },
          {
            title: 'Address',
            name: 'address',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'City',
            name: 'city',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'State',
            name: 'stateId',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              type: 'select',
              list: state,
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'Zip Code',
            name: 'zip',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              type: 'only_number',
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'Year at this Address',
            name: 'yearAddress',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              type: 'only_number',
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'Date of Birth (mm/dd/yyyy)',
            name: 'birthDate',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              type: 'date',
              colTablet: 6,
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'Email Address',
            name: 'email',
            tableItem: {
              sorter: false,
            },
            formItem: {
              col: 4,
              colTablet: 6,
              render: (form, values, generateForm, index) => {
                const i = index.split('_')[1];
                return (
                  <>
                    {generateForm(
                      {
                        title: 'Email Address',
                        name: [i, 'email'],
                        formItem: {
                          rules: [{ type: 'required' }, { type: 'email' }],
                          disabled: () => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : values;
                            return isDisableField(data, index);
                          },
                          type: 'text',
                          onBlur: async (e, form) => {
                            const email = e.target.value;
                            const regexEmail =
                              /^(([^<>()[\]\\.,;:$%^&*\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if (!!email && regexEmail.test(email.trim())) {
                              const data = await MerchantService.getPrincipalByKey({
                                key: 'email',
                                value: email,
                              });

                              if (!data) return;

                              [data.codeHomePhone, data.homePhone] = getCodeAndPhone(data?.homePhone);
                              [data.codeMobilePhone, data.mobilePhone] = getCodeAndPhone(data?.mobilePhone);
                              data.birthDate = moment(data?.birthDate);
                              data.position = data?.title;
                              data.addressPrincipal = {
                                address: data?.address,
                                city: data?.city,
                                state: data?.stateId,
                                zip: data?.zip,
                              };
                              data.yearAtThisAddress = data?.yearAddress;
                              data.driverLicense = data?.driverNumber;
                              const values = form.getFieldsValue();
                              if (values && values.principals) {
                                const newPrincipals = values.principals;
                                newPrincipals[i] = data;
                                form.setFieldsValue({ principals: newPrincipals });
                              }
                            }
                          },
                        },
                      },
                      index + '1',
                    )}
                  </>
                );
              },
            },
          },
          {
            title: 'Driver License Number',
            name: 'driverNumber',
            formItem: {
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
              type: 'text',
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'State Issued',
            name: 'stateIssued',
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              type: 'select',
              list: state,
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: 'Social Security Number',
            name: 'ssn',
            tableItem: {
              sorter: false,
            },
            formItem: {
              col: 4,
              colTablet: 6,
              render: (form, values, generateForm, index) => {
                const i = index.split('_')[1];
                return (
                  <>
                    {generateForm(
                      {
                        title: 'Social Security Number',
                        name: [i, 'ssn'],
                        formItem: {
                          disabled: () => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : values;
                            return isDisableField(data, index);
                          },
                          rules: [{ type: 'required' }],
                          mask: {
                            mask: '[9{1,3}][-9{1,2}][-9{1,4}]',
                          },
                          onBlur: async (e, form) => {
                            const ssn = e.target.value;
                            if (ssn) {
                              const data = await MerchantService.getPrincipalByKey({
                                key: 'ssn',
                                value: ssn.replaceAll('-', ''),
                              });

                              if (!data) return;

                              [data.codeHomePhone, data.homePhone] = getCodeAndPhone(data?.homePhone);
                              [data.codeMobilePhone, data.mobilePhone] = getCodeAndPhone(data?.mobilePhone);
                              data.birthDate = moment(data?.birthDate);
                              data.position = data?.title;
                              data.addressPrincipal = {
                                address: data?.address,
                                city: data?.city,
                                state: data?.stateId,
                                zip: data?.zip,
                              };
                              data.yearAtThisAddress = data?.yearAddress;
                              data.driverLicense = data?.driverNumber;

                              const values = form.getFieldsValue();
                              if (values && values.principals) {
                                const newPrincipals = values.principals;
                                newPrincipals[i] = data;
                                form.setFieldsValue({ principals: newPrincipals });
                              }
                            }
                          },
                        },
                      },
                      index + '1',
                    )}
                  </>
                );
              },
            },
          },
          {
            title: 'Driver License Picture',
            name: 'imageUrl',
            formItem: {
              rules: [{ type: 'required' }],
              type: 'upload',
              col: 6,
              onlyImage: true,
              accept: 'image/*,.pdf',
              action: 'File',
              allowUploadPdf: true,
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            formItem: {
              type: 'hidden',
              render: (form, values, generateForm, index) => {
                const i = index.split('_')[1];
                return (
                  <>
                    {generateForm(
                      {
                        name: [i, 'codeHomePhone'],
                        formItem: {
                          type: 'hidden',
                        },
                      },
                      index + '1',
                    )}
                  </>
                );
              },
            },
          },
          {
            formItem: {
              type: 'hidden',
              render: (form, vlaues, generateForm, index) => {
                const i = index.split('_')[1];
                return (
                  <>
                    {generateForm(
                      {
                        name: [i, 'codeMobilePhone'],
                        formItem: {
                          type: 'hidden',
                        },
                      },
                      index + '1',
                    )}
                  </>
                );
              },
            },
          },
        ],
      },
    },
  ];
};

const ColumnPrincipals = ({ form, state = [] }) => {
  return [];
};

export { ColumnPendingRequest, ColumnPrincipals };
