import React from 'react';
import { Select, Modal } from 'antd';
import moment from 'moment';
import { MerchantService } from 'services/merchant';
import getCodeAndPhone from 'utils/getCodAndPhone';
import debounce from 'lodash.debounce';
const { confirm } = Modal;
const isDisableField = (values, index) => {
  const i = index.split('_')[1];
  return Boolean(values && values.principals && values.principals[i] && values.principals[i].principalId);
};

const ColumnPrincipalAdd = ({ state, principals, setPrincipals }) => {
  const listState = state && state.map((item) => ({ label: item?.name, value: item?.stateId }));

  return [
    {
      title: '',
      name: 'principals',
      formItem: {
        type: 'addable',
        textAdd: 'ADD PRINCIPAL',
        isTable: false,
        onAdd: (value, form) => {
          form.setFieldsValue({
            principals: form.getFieldValue('principals'),
            numberOfPrincipal: (value?.length || 1) + 1,
          });
        },
        onDelete: (n, form) => {},
        column: [
          {
            formItem: {
              render: (a, b, c, index) => (
                <h4 className={'text-xl font-bold mb-2'}>Principal {parseInt(index.split('_')[1]) + 1}</h4>
              ),
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
            tableItem: {
              sorter: false,
            },
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
            name: 'position',
            tableItem: {
              sorter: false,
            },
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
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            formItem: {
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
            title: 'Home Phone',
            tableItem: {
              sorter: false,
            },
            formItem: {
              render: (form, values, generateForm, index) => {
                const i = index.split('_')[1];
                return (
                  <>
                    {generateForm(
                      {
                        title: 'Home Phone',
                        name: [i, 'homePhone'],
                        formItem: {
                          col: 4,
                          colTablet: 6,
                          rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', valuee: 12 }],
                          mask: {
                            mask: '[9{1,3}][-9{1,3}][-9{1,4}]',
                          },
                          disabled: () => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : values;
                            return isDisableField(data, index);
                          },
                          addonBefore: (form, onFirstChange) => (
                            <Select
                              className="code-select"
                              style={{ width: 100, textAlign: 'center' }}
                              disabled={isDisableField(form.getFieldsValue(), index)}
                              defaultValue={form.getFieldValue(['principals', i, 'codeHomePhone']) || '+1'}
                              onChange={(value) => {
                                const all = form.getFieldValue();
                                if (all?.principals[i]) {
                                  all.principals[i].codeHomePhone = value;
                                }
                                onFirstChange();
                                form.setFieldsValue({ principals: all?.principals });
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
                      index + '1',
                    )}
                  </>
                );
              },
            },
          },
          {
            formItem: {
              render: (form, values, generateForm, index) => {
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
          {
            title: 'Mobile Phone',
            tableItem: {
              sorter: false,
            },
            formItem: {
              render: (form, values, generateForm, index) => {
                const i = index.split('_')[1];
                return (
                  <>
                    {generateForm(
                      {
                        title: 'Mobile Phone',
                        name: [i, 'mobilePhone'],
                        formItem: {
                          col: 4,
                          colTablet: 6,
                          rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', valuee: 12 }],
                          mask: {
                            mask: '[9{1,3}][-9{1,3}][-9{1,4}]',
                          },
                          disabled: () => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : values;
                            return isDisableField(data, index);
                          },
                          addonBefore: (form, onFirstChange) => (
                            <Select
                              className="code-select"
                              style={{ width: 100, textAlign: 'center' }}
                              defaultValue={form.getFieldValue(['principals', i, 'codeMobilePhone']) || '+1'}
                              disabled={isDisableField(form.getFieldsValue(), index)}
                              onChange={(value) => {
                                const all = form.getFieldValue();
                                all.principals[i].codeMobilePhone = value;
                                onFirstChange();
                                form.setFieldsValue({ principals: all?.principals });
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
                      index + '1',
                    )}
                  </>
                );
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

                              let newPrincipals = principals;

                              const formPrincipals = form.getFieldValue('principals');

                              if (formPrincipals && formPrincipals[i]) {
                                formPrincipals[i] = data;

                                newPrincipals = {
                                  ...newPrincipals,
                                  principals: formPrincipals,
                                };

                                setPrincipals({ ...newPrincipals });
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
            title: 'Address',
            formItem: {
              col: 4,
              colTablet: 6,

              render: (form, values, generateForm, index) => {
                const i = index.split('_')[1];
                return (
                  <>
                    {generateForm(
                      {
                        title: 'Address',
                        name: [i, 'addressPrincipal', 'address'],
                        formItem: {
                          disabled: () => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : values;
                            return isDisableField(data, index);
                          },
                          rules: [{ type: 'required' }],
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
            title: 'City',
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
                        title: 'City',
                        name: [i, 'addressPrincipal', 'city'],
                        formItem: {
                          disabled: () => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : values;
                            return isDisableField(data, index);
                          },
                          rules: [{ type: 'required' }],
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
            title: 'State',
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
                        title: 'State',
                        name: [i, 'addressPrincipal', 'state'],
                        formItem: {
                          rules: [{ type: 'required' }],
                          type: 'select',
                          list: listState,
                          placeholder: 'State',
                          disabled: () => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : values;
                            return isDisableField(data, index);
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
            title: 'Zip Code',
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
                        title: 'Zip Code',
                        name: [i, 'addressPrincipal', 'zip'],
                        formItem: {
                          rules: [{ type: 'required' }],
                          type: 'only_number',
                          disabled: () => {
                            const formData = form.getFieldsValue();
                            const data = formData && formData.principals ? formData : values;
                            return isDisableField(data, index);
                          },
                          onChange: debounce(async (e, form, reRender, onFirstChange) => {
                            const dataForm = form.getFieldValue();
                            const data = await MerchantService.getZipCode({
                              zipcode: e?.target?.value,
                            });
                            const newPrincipals = principals;
                            if (!data) return;
                            const businessAddress = {
                              ...dataForm?.principals[i]?.addressPrincipal,
                              zip: data?.zipCode,
                              city: data?.city,
                              state: data?.stateId,
                              stateName: data?.stateName,
                            };
                            const dataS = {
                              ...dataForm?.principals[i],
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
                                  newPrincipals.principals[i] = dataS;
                                  setPrincipals({ ...newPrincipals });
                                },
                                onCancel() {},
                              });
                            }
                          }, 500),
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
            title: 'Year at this Address',
            name: 'yearAtThisAddress',
            tableItem: {
              sorter: false,
            },
            formItem: {
              rules: [{ type: 'required' }],
              col: 4,
              colTablet: 6,
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
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

                              let newPrincipals = principals;

                              const formPrincipals = form.getFieldValue('principals');

                              if (formPrincipals && formPrincipals[i]) {
                                formPrincipals[i] = data;

                                newPrincipals = {
                                  ...newPrincipals,
                                  principals: formPrincipals,
                                };

                                setPrincipals({ ...newPrincipals });
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
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
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
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
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
              disabled: (values, form, index) => {
                const formData = form.getFieldsValue();
                const data = formData && formData.principals ? formData : values;
                return isDisableField(data, index);
              },
            },
          },
          {
            title: '',
            formItem: {
              col: 12,
              type: 'hidden',
            },
          },
        ],
      },
    },
  ];
};
export default ColumnPrincipalAdd;
