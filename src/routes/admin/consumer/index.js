import React, { useState, Fragment } from 'react';
import { Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { Title, Button } from 'layouts/components';

import { useAuth } from 'globalContext';
import { ColumnConsumer } from 'columns/consumer';
import HookDataTable from 'hooks/data-table';
import { UserService } from 'services/user';
import { useLocation, useNavigate } from 'react-router';
import { getQueryStringParams, routerLinks } from 'utils';

const Customer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerify, setIsVerify] = useState(getQueryStringParams(location.search)?.isVerify || '-1');
  const [params, set_params] = useState();

  const navigate = useNavigate();

  const [handleChangeMerchant, DataTableMerchant] = HookDataTable({
    isLoading,
    setIsLoading,
    pageSize: 'row',
    fullTextSearch: 'key',
    xScroll: 1400,
    Get: (params) => {
      if (params.isVerify === undefined) {
        params.isVerify = -1;
      }
      if (location?.state?.isVerify !== undefined) params.isVerify = location?.state?.isVerify;
      set_params(params);
      return UserService.get(params);
    },
    searchPlaceholder: 'Search...',
    onRow: (record) => ({
      onClick: () =>
       {
        if(record?.userId){
          navigate(
            `${routerLinks('Consumer')}/${record?.userId}`,
            { state: { isVerify } },
            {
              replace: true,
            },
          );
        }
       }
    }),
    columns: ColumnConsumer({
      t,
      formatDate,
    }),
    leftHeader: (
      <div className="flex items-center ml-5 mt-1 w-screen">
        <div className="mr-2 font-semibold text-black">Is Verify:</div>
        <Radio.Group
          value={isVerify}
          buttonStyle="solid"
          onChange={(e) => {
            params.isVerify = e.target.value;
            handleChangeMerchant(params);
            setIsVerify(e.target.value);
          }}
        >
          <Radio.Button value="-1">All</Radio.Button>
          <Radio.Button value="1">True</Radio.Button>
          <Radio.Button value="0">False</Radio.Button>
        </Radio.Group>
        <Button
          name="Reset"
          type="ok"
          onClick={() => {
            params.isVerify = -1;
            handleChangeMerchant(params);
            setIsVerify('-1');
          }}
          moreClass="ml-5"
        />
      </div>
    ),
  });

  const bread = [
    {
      name: 'Customer',
    },
  ];

  return (
    <Fragment>
      <Title title="Customer" breadcrumbs={bread} />
      <div className="p-4 bg-gray-50 shadow rounded-xl">{DataTableMerchant()}</div>
    </Fragment>
  );
};

export default Customer;
