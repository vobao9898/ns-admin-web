import { Form, Message } from 'components';
import { Title, Button } from 'layouts/components';
import React, { useEffect, useState } from 'react';
import { Form as FormAnt, Select, Spin } from 'antd';
import settingService from 'services/setting';

const GeneralSetting = (props) => {
  const [passForm] = FormAnt.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState();

  const get = async () => {
    setIsLoading(true);
    const res = await settingService.getTwilio();
    if (res.codeNumber === 200) {
      const value = { ...res?.data };
      [value.codePhone, value.phone] = handlePhone(res?.data?.phoneSender);
      if (res.data) {
        setData(value);
      } else {
        setData({});
      }
    }
    setIsLoading(false);
  };

  const handlePhone = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length === 0) return ['', phoneNumber];
    let [code, phone] = getInfoPhone(phoneNumber);
    phone = getPhoneOnlyNumber(phone);
    return [code, phone];
  };

  const getInfoPhone = (phone) => {
    let code = '';
    if (phone.indexOf('+1') > -1 && phone.indexOf(' +1') === -1) {
      code = '+1';
      phone = phone.replace('+1', '');
    }
    if (phone.indexOf(' +1') > -1) {
      code = ' +1';
      phone = phone.replace(' +1', '');
    }
    if (phone.indexOf('+84') > -1) {
      code = '+84';
      phone = phone.replace('+84', '');
    }
    return [code, phone];
  };

  const getPhoneOnlyNumber = (phone) => {
    let result = '';
    phone = '' + phone;
    phone = phone.replaceAll('-', '');
    phone = phone.replaceAll('(', '');
    phone = phone.replaceAll(')', '');
    phone = phone.replaceAll(' ', '');
    const str1 = phone.substring(0, 3);
    const str2 = phone.substring(3, 6);
    const str3 = phone.substring(6, phone.length);
    result = result + str1;
    if (phone.length > 3) {
      result = result + ' ' + str2;
    }
    if (phone.length > 6) {
      result = result + '-' + str3;
    }
    return result;
  };

  useEffect(() => {
    get();
  }, []);

  const bread = [
    {
      name: 'Settings',
    },
    {
      name: 'General',
    },
  ];
  const colPincode = [
    {
      title: 'Phone',
      name: 'phone',
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
        disabled: () => !isEdit,
        addonBefore: (form, onFirstChange) => (
          <Select
            disabled={!isEdit}
            className="code-select"
            style={{ width: 100, textAlign: 'center' }}
            defaultValue={form.getFieldValue('codePhone') || '+1'}
            onChange={(value) => {
              onFirstChange();
              form.setFieldsValue({ codePhone: value });
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
  ];

  const editHandle = async () => {
    passForm
      .validateFields()
      .then(async (values) => {
        setIsLoading(true);
        const value = {
          ...data,
          phoneSender: `${values?.codePhone ? values?.codePhone : '+1'} ${values?.phone}`,
        };
        const res = await settingService.putTwilio(value);
        if (res?.data) {
          setIsEdit(false);
          Message.success({ text: res?.message });
          get();
        }
        setIsEdit(false);
        setIsLoading(false);
      })
      .catch((errorInfo) => console.log('FAILED', errorInfo));
  };

  return (
    <Spin spinning={isLoading}>
      <Title title="Settings" breadcrumbs={bread} />
      <div className="p-4 shadow rounded-2xl bg-gray-50">
        <div className="font-bold text-lg mb-4 text-blue-500">Phone sender</div>
        <Form values={data} form={passForm} columns={[...colPincode]} />
        <div>
          {isEdit ? (
            <div>
              <Button
                name="Cancel"
                type="cancel"
                onClick={() => {
                  get();
                  setIsEdit(false);
                }}
                moreClass="mr-5"
              />
              <Button name="Save" type="ok" onClick={() => editHandle()} moreClass="mr-5" />
            </div>
          ) : (
            <Button name="Edit" type="ok" onClick={() => setIsEdit(true)} moreClass="mr-5" />
          )}
        </div>
      </div>
    </Spin>
  );
};

export default GeneralSetting;
