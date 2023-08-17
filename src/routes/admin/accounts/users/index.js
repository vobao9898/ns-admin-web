import { ColumnUsers, ColumnUserTable } from 'columns/accounts';
import { HookDataTable, HookModalForm } from 'hooks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import AccountService from 'services/accounts';
import { routerLinks } from 'utils';
import { Radio } from 'antd';
import { Title, Button } from 'layouts/components';

import './index.less';

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  let [status, setStatus] = useState('-1');

  const navigate = useNavigate();

  const changeStatus = (value) => {
    setStatus(value);
    status = value;
    onChange();
  };

  const leftHeader = (
    <div className="mb-2 mt-1 flex items-center">
      <p className="mr-5 text-black font-medium">Status</p>
      <Radio.Group value={status} buttonStyle="solid" onChange={(e) => changeStatus(e.target.value)} className="mr-5">
        <Radio.Button value="-1">All</Radio.Button>
        <Radio.Button value="0">Active</Radio.Button>
        <Radio.Button value="1">Inactive</Radio.Button>
      </Radio.Group>
      <Button name="Reset" type="ok" onClick={() => changeStatus('-1')} />
    </div>
  );

  const [handleShow, CreateModal] = HookModalForm({
    title: () => 'New Account',
    columns: ColumnUsers({}),
    widthModal: 900,
    isLoading,
    setIsLoading,
  });

  const [onChange, UserTable] = HookDataTable({
    id: () => status,
    columns: ColumnUserTable({ handleShow }),
    Get: AccountService.getUsers,
    isLoading,
    setIsLoading,
    rightHeader: <Button name="New User" type="ok" onClick={() => navigate(routerLinks('Users') + '/new')} />,
    leftHeader,
    onRow: (item) => {
      return {
        onClick: () => navigate(`${routerLinks('Users')}/${item.waUserId}`),
      };
    },
    searchPlaceholder: 'Search...',
  });

  const bread = [
    {
      name: 'Accounts',
    },
    {
      name: 'Admin',
    },
  ];

  return (
    <>
      {/* <Spin spinning={isLoading}> */}
      <Title title="Users" breadcrumbs={bread} />

      <div className="p-4 rounded-xl shadow bg-gray-50">{UserTable()}</div>
      {CreateModal()}
      {/* </Spin> */}
    </>
  );
};

export default Users;
