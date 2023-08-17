import React, { useState } from 'react';
import { Tabs } from 'antd';
import { Title } from 'layouts/components';
import GiftCard from './gift-card';
import NailSoftGiftCard from './nail-soft-gift-card';

const GiftCardSold = () => {
  const [activeTab, setActiveTab] = useState('giftCard');

  const tabs = [
    {
      key: 'giftCard',
      title: 'Gift Card',
      content: <GiftCard />,
    },
    {
      title: 'NailSoft GC',
      key: 'nailSoftGiftCard',
      content: <NailSoftGiftCard />,
    },
  ];

  const bread = [
    {
      name: 'Reports',
    },
    {
      name: 'Gift Card Transactions',
    },
  ];

  const handleChangeTabs = (key) => {
    localStorage.setItem('toggleState', JSON.stringify(key));
    setActiveTab(key);
  };

  return (
    <div className="grid">
      <Title title="Gift Card Transactions" breadcrumbs={bread} />
      <div className="mb-5 p-4 shadow rounded-xl bg-gray-50">
        <Tabs activeKey={activeTab} onChange={handleChangeTabs}>
          {tabs.map((item) => (
            <Tabs.TabPane tab={item?.title} key={item?.key}>
              {item?.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default GiftCardSold;
