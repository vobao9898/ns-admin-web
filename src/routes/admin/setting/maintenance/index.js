import { Spin, Switch, Modal } from 'antd';
import { Message } from 'components';
import { Title } from 'layouts/components';
import React, { useState } from 'react';
import SettingService from 'services/setting';
const { confirm } = Modal;
const Maintenance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const bread = [
    {
      name: 'Settings',
    },
    {
      name: 'Maintenance',
    },
  ];

  const loadData = async () => {
    const res = await SettingService.getMaintenance();
    if (res?.data?.value) {
      const value = res?.data?.value.toString().toLowerCase();
      if (value === 'false') {
        setData(false);
      } else {
        setData(true);
      }
    }
  };

  const handleUpdate = async (value) => {
    const data = { turnOn: value };
    const res = await SettingService.putMaintenance(data);
    if (res?.codeNumber === 200) {
      Message.success({ text: res?.Message });
      loadData();
    } else {
      Message.success({ text: res?.Message });
    }
  };

  const handleClick = (checked) => {
    confirm({
      title: 'Are you sure you want to switch?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        setData(checked);
        handleUpdate(checked);
      },
    });
  };

  useState(() => {
    setIsLoading(false);
    loadData();
  }, []);

  return (
    <Spin spinning={isLoading}>
      <Title title="Settings" breadcrumbs={bread} />
      <div className="p-4 shadow rounded-2xl bg-gray-50">
        <div className="font-bold text-lg mb-4 text-blue-500">Maintenance</div>
        <div className="flex">
          <div className="mr-2 flex items-center">Maintenance mode on Portal:</div>
          <Switch checked={data} onChange={handleClick} />
        </div>
      </div>
    </Spin>
  );
};

export default Maintenance;
