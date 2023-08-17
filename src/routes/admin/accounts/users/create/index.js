import { Form } from 'components';
import React from 'react';
import { useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import { ColumnUsers } from 'columns/accounts';
import { Title, Button } from 'layouts/components';
import { Spin, Form as FormAnt } from 'antd';

import '../index.less';
import AccountService from 'services/accounts';

const CreateUser = () => {
  const navigate = useNavigate();
  const [form] = FormAnt.useForm();

  const handleCreate = async () => {
    form.validateFields().then(async (value) => {
      const res = await AccountService.createUser(value);
      if (res.codeStatus === 4) return false;
      if (res) navigate(routerLinks('Users'));
    });
  };

  const renderButton = () => {
    return (
      <div className="flex !items-start w-full">
        <Button name="CANCEL" type="cancel" onClick={() => navigate(routerLinks('Users'))} moreClass="mr-5" />
        <Button name="SAVE" type="ok" onClick={() => handleCreate()} />
      </div>
    );
  };

  const bread = [
    {
      name: 'Accounts',
    },
    {
      name: 'Admin',
      path: 'Users',
    },
    {
      name: 'New User',
    },
  ];

  return (
    <Spin spinning={false}>
      <Title title="New User" breadcrumbs={bread} />
      <div className="p-4 shadow rounded-xl bg-gray-50">
        <Form columns={ColumnUsers({})} extendButton={renderButton} form={form} />
      </div>
    </Spin>
  );
};

export default CreateUser;
