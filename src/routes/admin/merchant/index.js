import React, { useEffect, useState, useRef } from 'react';
import { Select, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { DataTableV2 } from 'components';
import { useAuth } from 'globalContext';
import { ColumnMerchant } from 'columns/merchant';
import { MerchantService } from 'services/merchant';
import { useNavigate, useLocation } from 'react-router';
import { routerLinks } from 'utils';
import { Title, Button } from 'layouts/components';
import IsMerchantExpiredDate from 'utils/IsMerchantExpiredDate';

const Merchant = () => {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatDate, permission } = useAuth();
  const { state } = useLocation();

  const [status, setStatus] = useState(state?.status ? state?.status : '-1');
  const [merchantType, setMerchantType] = useState(state?.merchantType || '-1');
  const [isTest, setIsTest] = useState(state?.isTest || -1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('toggleState', JSON.stringify('general'));
  }, []);

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

  const handleReset = async () => {
    if (status === '-1' && merchantType === '-1' && isTest === -1) return;

    setIsLoading(true);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        isDisabled: '-1',
        merchantType: '-1',
        isTest: -1,
      }));
    setMerchantType('-1');
    setStatus('-1');
    setIsTest(-1);
    setIsLoading(false);
  };

  const breadcrumbs = [
    {
      name: 'Merchant List',
      path: 'Merchant',
    },
  ];

  const handleExport = async () => {
    const parrams = {
      ...dataTableRef?.current?.params,
      isDisabled: status,
      merchantType,
      isTest,
      exportType: 'excel',
    };
    setIsLoading(true);
    const data = await MerchantService.exportMerchant(parrams);
    if (data?.data) {
      window.open(data?.data);
    }
    setIsLoading(false);
  };

  const dataTableRef = useRef();

  return (
    <Spin spinning={false}>
      <Title title={'Merchant List'} breadcrumbs={breadcrumbs} />
      <div className="mb-4 w-full rounded-xl px-4 py-3 bg-white shadow-md">
        <DataTableV2
          ref={dataTableRef}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          defaultRequest={{
            sort: {
              isDisabled: 'ASC',
              expiredDate: 'ASC',
            },
          }}
          sort="sort"
          xScroll={'100%'}
          id={() => ({
            status,
            merchantType,
            isTest,
          })}
          Get={MerchantService.getMerchants}
          handleRowClassName={(record) => {
            if (IsMerchantExpiredDate(record.expiredDate)) {
              return 'custom-ant-table-bg bg-yellow-200';
            }
            return '';
          }}
          onRow={(record) => ({
            onClick: () =>
              navigate(`${routerLinks('Merchant')}${record?.merchantId}`, {
                state: { tab: 'general', modal: false, status, merchantType, isTest },
              }),
          })}
          columns={ColumnMerchant({ t, formatDate })}
          rightHeader={
            <Space>
              {!!permission && (
                <div className="flex">
                  <Button name="Export" type={'ok'} moreClass="mr-2" onClick={() => handleExport()} />
                  <Button
                    name="Add Merchant"
                    type={'ok'}
                    onClick={() =>
                      navigate(routerLinks('AddMerchant'), {
                        state: { status },
                      })
                    }
                  />
                </div>
              )}
            </Space>
          }
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
                  <Select.Option value={1}>Yes</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
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

export default Merchant;
