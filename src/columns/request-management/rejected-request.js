import React from 'react';
import moment from 'moment';
import { Modal, Select } from 'antd';
import { MerchantService } from 'services/merchant';
import debounce from 'lodash.debounce';
const { confirm } = Modal;

const ColumnRejectedRequest = ({ state = [], setReject, reject }) => {
  return [
    {
      title: 'ID',
      name: 'merchantId',
      tableItem: {
        sorter: false,
        render: (text, item) => item && <div>{item.merchantId}</div>,
      },
    },
    {
      title: 'Rejected Date',
      name: 'approvedDate',
      tableItem: {
        sorter: false,
        render: (text) => moment(text).format('L'),
      },
    },
    {
      title: 'DBA',
      name: 'dba',
      tableItem: {
        sorter: false,
        render: (text, item) => item?.general?.doBusinessName,
      },
    },
    {
      title: 'Owner',
      name: 'owner',
      tableItem: {
        sorter: false,
        render: (text, item) => (item?.principals[0]?.firstName || '') + ' ' + (item?.principals[0]?.lastName || ''),
      },
    },
    {
      title: 'Email',
      name: 'email',
      tableItem: {
        sorter: false,
        render: (text, item) => text && item.email,
      },
    },
    {
      title: 'Store Phone',
      name: 'phone',
      tableItem: {
        sorter: false,
      },
    },
    {
      title: 'Contact Phone',
      name: '',
      tableItem: {
        sorter: false,
        render: (text, item) => item?.general?.phoneContact,
      },
    },
    {
      title: 'Rejected By',
      name: 'rejectedBy',
      tableItem: {
        sorter: false,
        render: (text, item) => item?.adminUser?.first_name + ' ' + item?.adminUser?.last_name,
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
      name: 'legalBusinessName',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Doing Business As (DBA)',
      name: 'doBusinessName',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Federal Tax ID',
      name: 'tax',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'only_number',
      },
    },
    {
      title: 'Business Address (no P.O. Boxes)',
      name: 'address',
      formItem: {
        rules: [{ type: 'required' }],
        col: 12,
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
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
        type: 'select',
        list: state,
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
        placeholder: 'Enter Zip code (timezone will collect based on this filed)',
        onChange: debounce(async (e, form, reRender, onFirstChange) => {
          const dataForm = form.getFieldValue();
          const data = await MerchantService.getZipCode({
            zipcode: e?.target?.value,
          });
          const businessAddress = {
            ...dataForm,
            zip: data?.zipCode,
            city: data?.city,
            stateId: data?.stateId,
            stateName: data?.stateName
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
                  ...reject,
                  general: dataAll,

                }
                setReject(dataS);
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
      name: 'Address',
      formItem: {
        rules: [{ type: 'required' }],
        col: 12,
      },
    },
    {
      title: 'City',
      name: 'City',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'State',
      name: 'State',
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
      name: 'Zip',
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
            ...dataForm,
            dbaAddress: {
              Zip: data?.zipCode,
              City: data?.city,
              State: data?.stateId,
              stateName: data?.stateName
            }
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
                  <div>Business Address: {businessAddress?.Address}</div>
                  <div>City: {businessAddress?.City}</div>
                  <div>State: {businessAddress?.stateName}</div>
                  <div>Zip code: {businessAddress?.Zip}</div>
                </div>
              ),
              onOk() {
                const dataS = {
                  ...reject,
                  general: dataAll,

                }
                setReject(dataS);
                onFirstChange();
              },
              onCancel() {},
            });
          }
        }, 500),
      },
    },
    {
      title: 'Contact Email Address',
      name: 'emailContact',
      formItem: {
        rules: [{ type: 'required' }, { type: 'email' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      name: 'codePhoneBusiness',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Business Phone Number',
      name: 'phoneBusiness',
      formItem: {
        mask: {
          mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
        },
        addonBefore: (form, onFirstChange) => (
          <Select
            className="code-select"
            style={{ width: 100, textAlign: 'center' }}
            defaultValue={form.getFieldValue('codePhoneBusiness')}
            onChange={(codePhoneBusiness) => {
              onFirstChange();
              return form.setFieldsValue({ codePhoneBusiness });
            }}
          >
            <Select.Option value="+1">
              <span className={'inline-flex items-center'}>
                {/* <img className={'h-4 mr-1'} src={us} alt="US" /> */}
                +1
              </span>
            </Select.Option>
            {/* <Select.Option value=" +1">
              <span className={'inline-flex items-center'}>
                <img className={'h-4 mr-1'} src={canada} alt="Canada" />
                +1
              </span>
            </Select.Option> */}
            <Select.Option value="+84">
              <span className={'inline-flex items-center'}>
                {/* <img className={'h-4 mr-1'} src={vietnam} alt="Vietnam" /> */}
                +84
              </span>
            </Select.Option>
          </Select>
        ),
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
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
      title: 'Title/Position',
      name: 'title',
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      name: 'codePhoneContact',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Contact Phone Number',
      name: 'phoneContact',
      formItem: {
        addonBefore: (form, onFirstChange) => (
          <Select
            className="code-select"
            style={{ width: 100, textAlign: 'center' }}
            defaultValue={form.getFieldValue('codePhoneContact')}
            onChange={(codePhoneContact) => {
              onFirstChange();
              return form.setFieldsValue({ codePhoneContact });
            }}
          >
            <Select.Option value="+1">
              <span className={'inline-flex items-center'}>
                {/* <img className={'h-4 mr-1'} src={us} alt="US" /> */}
                +1
              </span>
            </Select.Option>
            {/* <Select.Option value=" +1">
              <span className={'inline-flex items-center'}>
                <img className={'h-4 mr-1'} src={canada} alt="Canada" />
                +1
              </span>
            </Select.Option> */}
            <Select.Option value="+84">
              <span className={'inline-flex items-center'}>
                {/* <img className={'h-4 mr-1'} src={vietnam} alt="Vietnam" /> */}
                +84
              </span>
            </Select.Option>
          </Select>
        ),
        mask: {
          mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
        },
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
  ];
};

export default ColumnRejectedRequest;
