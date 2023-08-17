import React, { useState, useRef } from 'react';
import { Select, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'components';
import { useAuth } from 'globalContext';
import { ColumnMerchant } from 'columns/principal';
import { PrincipalService } from 'services/principal';
import { useLocation } from 'react-router';
import { Button } from 'layouts/components';

const Page = ({ id }) => {
  const { formatDate } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useLocation();
  const [status, setStatus] = useState(state?.status ? state?.status : '-1');
  const [merchantType, setMerchantType] = useState(state?.merchantType || '-1');
  const [isTest, setIsTest] = useState(state?.isTest || -1);

  const dataTableRef = useRef();

  const handleReset = async () => {
    if (status === '-1' && merchantType === '-1' && isTest === -1) return;

    setIsLoading(true);
    setMerchantType('-1');
    setStatus('-1');
    setIsTest(-1);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        isDisabled: '-1',
        merchantType: '-1',
        isTest: -1,
      }));
    setIsLoading(false);
  };

  const changeStatus = async (value) => {
    setIsLoading(true);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        isDisabled: value,
        merchantType,
        isTest,
      }));
    setStatus(value);
    setIsLoading(false);
  };

  const changeMerchantType = async (value) => {
    setIsLoading(true);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        isDisabled: status,
        merchantType: value,
        isTest,
      }));
    setMerchantType(value);
    setIsLoading(false);
  };

  const changeIsTest = async (value) => {
    setIsLoading(true);
    setIsTest(value);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        isDisabled: status,
        merchantType,
        isTest: value,
      }));
    setIsLoading(false);
  };

  return (
    <Spin spinning={false}>
      <div className="mb-4 w-full rounded-xl px-4 py-3 bg-white shadow-md">
        <DataTable
          ref={dataTableRef}
          isLoading={isLoading}
          showPagination={true}
          setIsLoading={setIsLoading}
          showSearch={false}
          xScroll={'100%'}
          id={() => ({
            status,
            merchantType,
            isTest,
          })}
          Get={(params) => {
            return PrincipalService.getMerchants(params, id);
          }}
          onRow={(record) => ({})}
          columns={ColumnMerchant({ t, formatDate })}
          subHeader={() => (
            <div className="flex items-center mb-5">
              <div className="flex items-center">
                <h3 className="mr-2">Status: </h3>
                <Select style={{ width: '150px' }} value={status} onChange={(value) => changeStatus(value)}>
                  <Select.Option value="-1">All</Select.Option>
                  <Select.Option value="0">Active</Select.Option>
                  <Select.Option value="1">Inactive</Select.Option>
                </Select>
              </div>

              <div className="flex items-center ml-5">
                <h3 className="mr-2">Merchant Type: </h3>
                <Select style={{ width: '150px' }} value={merchantType} onChange={(value) => changeMerchantType(value)}>
                  <Select.Option value="-1">All</Select.Option>
                  <Select.Option value="0">Salon POS</Select.Option>
                  <Select.Option value="1">Retailer</Select.Option>
                  <Select.Option value="2">Staff One</Select.Option>
                  <Select.Option value="3">Restaurant</Select.Option>
                </Select>
              </div>
              <div className="flex items-center ml-5">
                <h3 className="mr-2">Is Test: </h3>
                <Select style={{ width: '150px' }} value={isTest} onChange={(e) => changeIsTest(e)}>
                  <Select.Option value={-1}>All</Select.Option>
                  <Select.Option value={true}>Yes</Select.Option>
                  <Select.Option value={false}>No</Select.Option>
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
export default Page;
