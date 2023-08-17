import { Radio, Spin } from 'antd';
import { ColumnsMarketPlace } from 'columns/market-place';
import { HookDataTable, HookModalForm } from 'hooks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MarketPlaceService } from 'services/market-place';
import { routerLinks } from 'utils';
import { Title, Button } from 'layouts/components';

import './index.less';

const MarketPlace = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('-1');
  const [isLoading, setIsLoading] = useState(false);

  const [showCreate, CreateModal] = HookModalForm({
    title: () => 'New Brand',
    Post: MarketPlaceService.createMarket,
    columns: ColumnsMarketPlace({}),
    isLoading,
    setIsLoading,
    widthModal: 700,
    handleChange: () => handleChange(),
  });

  const [handleChange, MarketPlaceTable, paramsTable] = HookDataTable({
    id: () => status,
    columns: ColumnsMarketPlace({}),
    Get: async (params, status) => {
      setStatus(params?.isDisabled || '-1');
      return await MarketPlaceService.getMarketPlaces(params, status);
    },
    searchPlaceholder: 'Search...',
    rightHeader: <Button name="New Brand" type="ok" onClick={() => showCreate({ isDisabled: 'active' })} />,
    subHeader: () => (
      <div className="flex items-center mb-5 pl-2">
        <p className="mr-5 text-black font-medium">Status:</p>
        <Radio.Group
          value={status}
          buttonStyle="solid"
          onChange={(e) => {
            handleChange({ ...paramsTable, isDisabled: e.target.value });
          }}
        >
          <Radio.Button value="-1">All</Radio.Button>
          <Radio.Button value="0">Active</Radio.Button>
          <Radio.Button value="1">Inactive</Radio.Button>
        </Radio.Group>
        <Button
          name="Reset"
          type="ok"
          onClick={() => {
            handleChange({ ...paramsTable, isDisabled: '-1' });
          }}
          moreClass="ml-5"
        />
      </div>
    ),
    onRow: (item) => {
      return {
        onClick: () =>
          navigate(routerLinks('Market Place') + `/${item.marketPlaceId}`, {
            state: {
              isDisabled: status,
              marketPlace: item,
            },
          }),
      };
    },
    isLoading,
    setIsLoading,
  });

  const bread = [
    {
      name: 'Market Place',
    },
  ];

  return (
    <Spin spinning={false}>
      <Title title="Market Place" breadcrumbs={bread} />
      <div className="px-4 py-5 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">{MarketPlaceTable()}</div>
      {CreateModal()}
    </Spin>
  );
};

export default MarketPlace;
