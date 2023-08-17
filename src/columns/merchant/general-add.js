import React from 'react';
import { Modal, Select } from 'antd';
import { MerchantService } from 'services/merchant';
import debounce from 'lodash.debounce';
const { confirm } = Modal;

const Column = ({ state, general, setGeneral }) => {
  const listState = state && state?.map((item) => ({ label: item?.name, value: item?.stateId }));

  return [
    {
      title: 'Legal Business Name',
      name: 'businessName',
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
      title: 'Doing Business As',
      name: 'doingBusiness',
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
      title: 'Merchant type',
      name: 'type',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }, { type: 'select' }],
        col: 3,
        colTablet: 6,
        type: 'select',
        list: [
          { value: 0, label: 'Salon POS' },
          { value: 1, label: 'Retailer' },
          { value: 2, label: 'Staff One' },
          { value: 3, label: 'Restaurant' },
        ],
        placeholder: 'Merchant type',
      },
    },
    {
      title: 'Federal Tax ID',
      name: 'tax',
      tableItem: {
        sorter: false,
      },
      formItem: {
        col: 3,
        colTablet: 6,
        rules: [{ type: 'required' }],
        type: 'only_number',
      },
    },
    {
      title: 'Business Address (no P.O. Boxes)',
      name: ['businessAddress', 'address'],
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 12,
      },
    },
    {
      title: 'City',
      name: ['businessAddress', 'city'],
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
      name: ['businessAddress', 'state'],
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
      title: 'Zip code',
      name: ['businessAddress', 'zip'],
      tableItem: {
        sorter: false,
      },
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
            ...dataForm?.businessAddress,
            zip: data?.zipCode,
            city: data?.city,
            state: data?.stateId,
            stateName: data?.stateName,
          };
          const dataAll = {
            ...dataForm,
            businessAddress,
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
                let dataAllS = dataAll;
                if (dataAll?.SameAs) {
                  dataAllS = {
                    ...dataAll,
                    dbaAddress: dataAll?.businessAddress,
                  };
                }
                setGeneral(dataAllS);
                onFirstChange();
              },
              onCancel() {},
            });
          }
        }, 500),
      },
    },
    {
      title: '',
      name: 'SameAs',
      formItem: {
        type: 'checkbox',
        label: 'Same as Business Address',
        onChange: (value, form) => {
          const { businessAddress } = form.getFieldsValue();
          if (value) {
            form.setFieldsValue({ dbaAddress: businessAddress });
          }
        },
      },
    },
    {
      title: 'DBA Address',
      name: ['dbaAddress', 'address'],
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 12,
      },
    },
    {
      title: 'City',
      name: ['dbaAddress', 'city'],
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
      name: ['dbaAddress', 'state'],
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }, { type: 'select' }],
        col: 4,
        colTablet: 6,
        type: 'select',
        list: listState,
        placeholder: 'State',
      },
    },
    {
      title: 'Zip code',
      name: ['dbaAddress', 'zip'],
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
          const dbaAddress = {
            ...dataForm?.dbaAddress,
            zip: data?.zipCode,
            city: data?.city,
            state: data?.stateId,
            stateName: data?.stateName,
          };
          const dataAll = {
            ...dataForm,
            dbaAddress,
          };
          if (data) {
            confirm({
              title: 'Are you want to replace?',
              content: (
                <div>
                  <div>Business Address: {dbaAddress?.address}</div>
                  <div>City: {dbaAddress?.city}</div>
                  <div>State: {dbaAddress?.stateName}</div>
                  <div>Zip code: {dbaAddress?.zip}</div>
                </div>
              ),
              onOk() {
                setGeneral(dataAll);
                onFirstChange();
              },
              onCancel() {},
            });
          }
        }, 500),
      },
    },
    {
      title: 'Email Contact',
      name: 'email',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }, { type: 'email' }],
        col: 4,
        colTablet: 6,
        type: 'email',
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
      name: 'businessPhone',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', valuee: 12 }],
        col: 4,
        colTablet: 6,
        mask: {
          mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
        },
        addonBefore: (form, onFirstChange) => (
          <Select
            className="code-select"
            style={{ width: 100, textAlign: 'center' }}
            defaultValue={form.getFieldValue('codePhoneBusiness') || '+1'}
            onChange={(value) => {
              onFirstChange();
              form.setFieldsValue({ codePhoneBusiness: value });
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
      name: 'codePhoneContact',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Contact Phone Number',
      name: 'contactPhone',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', valuee: 12 }],
        col: 4,
        colTablet: 6,
        mask: {
          mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
        },
        addonBefore: (form, onFirstChange) => (
          <Select
            className="code-select"
            style={{ width: 100, textAlign: 'center' }}
            defaultValue={form.getFieldValue('codePhoneContact') || '+1'}
            onChange={(value) => {
              onFirstChange();
              form.setFieldsValue({ codePhoneContact: value });
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
      name: 'position',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
  ];
};
export default Column;
