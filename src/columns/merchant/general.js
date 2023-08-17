import React from 'react';
import { Modal, Select } from 'antd';
import { MerchantService } from 'services/merchant';
import debounce from 'lodash.debounce';
const { confirm } = Modal;
// import us from 'assets/images/us.png';
// import canada from 'assets/images/canada.png';
// import vietnam from 'assets/images/vietnam.png';

const Column = ({ state, setData, modalFormRef, setIsLoading }) => {
  const listState = state && state?.map((item) => ({ label: item?.name, value: item?.stateId }));

  return [
    {
      title: 'Legal Business Name',
      name: 'legalBusinessName',
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
      name: 'doBusinessName',
      tableItem: {
        sorter: false,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 3,
        colTablet: 6,
      },
    },
    // {
    //   title: 'Merchant type',
    //   name: 'type',
    //   tableItem: {
    //     sorter: false,
    //   },
    //   formItem: {
    //     rules: [{ type: 'required' }, { type: 'select' }],
    //     col: 3,
    //     colTablet: 6,
    //     type: 'select',
    //     list: [
    //       { value: 0, label: 'Salon POS' },
    //       { value: 1, label: 'Retailer' },
    //       { value: 2, label: 'Table management' },
    //     ],
    //     placeholder: 'Merchant type',
    //   },
    // },
    {
      title: 'Federal Tax ID',
      name: 'tax',
      tableItem: {
        sorter: false,
      },
      formItem: {
        col: 3,
        colTablet: 6,
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(_, value) {
                if (value[0] === '-' || value[value?.length - 1] === '-' || value.indexOf('--') > -1) {
                  return Promise.reject(new Error('Please enter a valid tax id!'));
                }
                return Promise.resolve();
              },
            }),
          },
        ],
        // type: 'only_number',
        mask: {
          mask: '[9{}][-{1}][9{}]' + '[9{}][-{1}][9{}]',
        },
      },
    },
    {
      title: 'Business Address',
      name: 'address',
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
      name: 'city',
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
      name: 'stateId',
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
      name: 'zip',
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
            zipcode: e.target.value,
          });
          const businessAddress = {
            ...dataForm,
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
                let dataAllS = dataAll;
                if (dataForm?.SameAs) {
                  dataAllS = {
                    ...dataAll,
                    Address: dataAll?.address,
                    Zip: dataAll?.zip,
                    City: dataAll?.city,
                    StateId: dataAll?.stateId,
                    StateName: dataAll?.stateName,
                  };
                }
                form?.setFieldsValue(dataAllS);
                const isItem = true;
                modalFormRef?.current?.handleEdit({ ...dataAllS, id: '1' }, isItem);
                onFirstChange();
              },
              onCancel() {},
            });
          }
          onFirstChange();
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
          const { address, stateId, city, zip } = form.getFieldsValue();
          if (value) {
            form.setFieldsValue({
              Address: address,
              State: stateId,
              City: city,
              Zip: zip,
            });
          }
        },
      },
    },
    {
      title: 'DBA Address',
      name: 'Address',
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
      name: 'City',
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
      name: 'State',
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
      name: 'Zip',
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
          const businessAddress = {
            ...dataForm,
            Zip: data?.zipCode,
            City: data?.city,
            State: data?.stateId,
            StateName: data?.stateName,
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
                  <div>State: {businessAddress?.StateName}</div>
                  <div>Zip code: {businessAddress?.Zip}</div>
                </div>
              ),
              onOk() {
                form?.setFieldsValue(dataAll);
                const isItem = true;
                modalFormRef?.current?.handleEdit({ ...dataAll, id: '1' }, isItem);
              },
              onCancel() {},
            });
          }
          onFirstChange();
        }, 500),
      },
    },
    {
      title: 'Email Contact',
      name: 'emailContact',
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
      name: 'phoneBusiness',
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
      name: 'phoneContact',
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
      title: 'Review Link',
      name: 'reviewLink',
      formItem: {
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Send Review Link Option',
      name: 'sendReviewLinkOption',
      formItem: {
        type: 'select',
        col: 4,
        colTablet: 6,
        list: [
          { label: 'Automatic', value: 'auto' },
          { label: 'Off', value: 'off' },
          { label: 'Manual', value: 'manual' },
        ],
      },
    },
    {
      title: 'Latitude',
      name: 'latitude',
      formItem: {
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(_, value) {
                if (Number(value)) return Promise.resolve();
                return Promise.reject(new Error('Please enter only number!'));
              },
            }),
          },
        ],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Longitude',
      name: 'longitude',
      formItem: {
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(_, value) {
                if (Number(value)) return Promise.resolve();
                return Promise.reject(new Error('Please enter only number!'));
              },
            }),
          },
        ],
        col: 4,
        colTablet: 6,
      },
    },
  ];
};
export default Column;
