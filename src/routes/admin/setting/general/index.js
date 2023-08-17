import { Form, Message } from 'components';
import { Title, Button } from 'layouts/components';
import React, { useEffect, useState } from 'react';
import { Form as FormAnt, Spin } from 'antd';
import SettingService from 'services/setting';

const GeneralSetting = (props) => {
  const [passForm] = FormAnt.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState();

  const get = async () => {
    const res = await SettingService.getGeneral();
    if (res.codeNumber === 200) {
      if (res.data) {
        setData(res.data);
      } else {
        setData({});
      }
    }
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
      title: 'Master pincode',
      name: 'masterPincode',
      formItem: {
        disabled: () => !isEdit,
        typePassword: true,
        mask: {
          mask: '[9{1,4}]',
        },
        rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', value: 4 }],
        col: 6,
      },
    },
  ];

  const editHandle = async () => {
    const value = await passForm.validateFields();
    setIsLoading(true);
    const values = {
      ...data,
      masterPincode: value?.masterPincode,
    };
    const res = await SettingService.putGeneral(values);
    if (res?.data) {
      setIsEdit(false);
      Message.success({ text: res?.message });
      get();
    }
    setIsEdit(false);
    setIsLoading(false);
  };

  return (
    <Spin spinning={isLoading}>
      <Title title="Settings" breadcrumbs={bread} />
      <div className="p-4 shadow rounded-2xl bg-gray-50">
        <div className="font-bold text-lg mb-4 text-blue-500">Staff log in</div>
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
