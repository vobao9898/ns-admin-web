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
    const res = await SettingService.getSmtp();
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
      name: 'SMTP',
    },
  ];
  const colPincode = [
    {
      title: 'Host',
      name: 'host',
      formItem: {
        disabled: () => !isEdit,
        col: 4,
        colTablet: 6,
        rules: isEdit ? [{ type: 'required' }] : [],
      },
    },
    {
      title: 'USERNAME',
      name: 'userSmtp',
      formItem: {
        disabled: () => !isEdit,
        col: 4,
        colTablet: 6,
        rules: isEdit ? [{ type: 'required' }] : [],
      },
    },
    {
      title: 'PASSWORD',
      name: 'password',
      formItem: {
        disabled: () => !isEdit,
        type: 'password',
        col: 4,
        colTablet: 6,
        rules: isEdit ? [{ type: 'required' }] : [],
      },
    },
    {
      title: 'EMAIL',
      name: 'email',
      formItem: {
        disabled: () => !isEdit,
        col: 4,
        colTablet: 6,
        rules: isEdit
          ? [
              { type: 'required' },
              {
                type: 'email',
                message: 'The input is not valid Email',
              },
            ]
          : [],
      },
    },
    {
      title: 'PORT',
      name: 'port',
      formItem: {
        disabled: () => !isEdit,
        col: 4,
        colTablet: 6,
        rules: isEdit ? [{ type: 'required' }] : [],
      },
    },
  ];
  const editHandle = async () => {
    passForm
      .validateFields()
      .then(async (value) => {
        await setIsLoading(true);
        const res = await SettingService.putSmtp(value);
        if (res?.data) {
          setIsEdit(false);
          Message.success({ text: res?.message });
          get();
        }
        setIsEdit(false);
        await setIsLoading(false);
      })
      .catch((errorInfo) => console.log('FAILED', errorInfo));
  };

  return (
    <Spin spinning={isLoading}>
      <Title title="Settings" breadcrumbs={bread} />
      <div className="p-4 shadow rounded-2xl bg-gray-50">
        <div className="font-bold text-lg mb-4 text-blue-500">MAIL SERVER</div>
        <Form form={passForm} values={data} columns={[...colPincode]} />
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
