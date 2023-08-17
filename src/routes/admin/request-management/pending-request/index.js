import React, { useState, useRef } from 'react';
import { useNavigate, useLocation} from 'react-router';
import { DataTable } from 'components';

import { ColumnPendingRequest } from 'columns/request-management';
import { routerLinks } from 'utils';
import Title from 'layouts/components/title';
import { Form as FormAnt, Spin, Select } from 'antd';
import { Button } from 'layouts/components';
import { RequestManagementService } from 'services/request-management';

const PendingRequest = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form] = FormAnt.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(state?.status ? state?.status : '-1');

  const bread = [
    {
      name: 'Pending Request',
    },
  ];
  const dataTableRef = useRef();

  const changeStatus = async (value) => {
    setIsLoading(true);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        status: value,
      }));
    setStatus(value);
    setIsLoading(false);
  };

  const handleReset = async () => {
    if (status === '-1') return;
    setIsLoading(true);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        status: '-1'
      }));
    setStatus('-1');
    setIsLoading(false);
  };

  return (
    <Spin spinning={false}>
      <Title title={'Pending Request'} breadcrumbs={bread} />
      <div className="p-4 bg-gray-50 shadow rounded-xl">
        <DataTable
          ref={dataTableRef}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          searchPlaceholder={'Search...'}
          Get={RequestManagementService.getPendings}
          columns={ColumnPendingRequest({ form })}
          onRow={(item) => ({
            onClick: () => navigate(`${routerLinks('Pending Request')}/${item.merchantId}`),
          })}
          subHeader={() => (
            <div className="flex items-center mb-5">
              <div className="flex items-center">
                <h3 className="mr-2">Status: </h3>
                <Select style={{ width: '150px' }} value={status} onChange={(value) => changeStatus(value)}>
                  <Select.Option value="-1">All</Select.Option>
                  <Select.Option value="0">Pending</Select.Option>
                  <Select.Option value="1">Handling</Select.Option>
                </Select>
              </div>
              <Button name="Reset" type="ok" moreClass="ml-5" onClick={() => handleReset()} />
            </div>
          )}
        />
      </div>
    </Spin>
  );
};

export default PendingRequest;
