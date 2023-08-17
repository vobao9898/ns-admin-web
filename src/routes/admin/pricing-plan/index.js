
import React, { useState, useRef, Fragment } from 'react';
import { ColumnsPricingPlan } from 'columns/pricing-plan';
import { PricingPlanService } from 'services/pricing-plan';
import { Spin, Select, Space } from 'antd';
import { Title, Button } from 'layouts/components';
import { DataTable, ModalForm } from 'components';
import { useLocation } from 'react-router';
import { useAuth } from 'globalContext';
import { MerchantService } from 'services/merchant';
import { useTranslation } from 'react-i18next';

const PricingPlan = () => {
  const { state } = useLocation();
  const { permission, formatDate } = useAuth();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(state?.status ? state?.status : '-1');
  const [oldData, setOldData] = useState();

  const bread = [
    {
      name: 'Pricing plan',
    },
  ];

  const changeStatus = async (value) => {
    setIsLoading(true);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        isDisabled: value,
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
        isDisabled: '-1',
      }));
    setStatus('-1');
    setIsLoading(false);
  };

  const handleRestorePlan = async (data) => {
    if(data?.packageId){
      const dataStemp = {
        ...data,
        isDisabled: 0
      }
      await MerchantService.putPackage(dataStemp, data?.packageId);
      dataTableRef?.current?.onChange();
    }
  };
  const handleArchivePlan = async (data) => {
    if(data?.packageId){
      const dataStemp = {
        ...data,
        isDisabled: 1
      }
      await MerchantService.putPackage(dataStemp, data?.packageId);
      dataTableRef?.current?.onChange();
    }
  };

  const dataTableRef = useRef();
  const modalFormRef = useRef();

  return (
    <>
      <ModalForm
        ref={modalFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={900}
        title={(data) => (!data?.packageId ? 'Add' : 'Edit')}
        dataEdit={oldData}
        Post={MerchantService.postPackage}
        Put={MerchantService.putPackage}
        parentID={() => ({
          fileId: oldData?.packageId,
        })}
        handleChange={() => dataTableRef?.current?.onChange()}
        columns={ColumnsPricingPlan({ t, formatDate })}
      />
      <Spin className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-5 intro-x" spinning={isLoading}>
        <div className="col-span-2 row-span-2 grid">
          <Title title="Pricing Plan" breadcrumbs={bread} />
          <div className="p-4 shadow rounded-xl bg-gray-50">
            <DataTable
              ref={dataTableRef}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              fullTextSearch="key"
              id={() => ({
                status,
              })}
              Get={PricingPlanService.getPricingPlans}
              columns={ColumnsPricingPlan({
                t,
                setOldData,
                handleEdit: modalFormRef?.current?.handleEdit,
                handleRestorePlan,
                handleArchivePlan,
              })}

              rightHeader={
                <Space>
                  {!!permission && (
                    <Fragment>
                      <Button
                        type={'ok'}
                        name="New plan"
                        onClick={() => {
                          modalFormRef?.current?.handleEdit();
                        }}
                      />
                    </Fragment>
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
                  <Button name="Reset" type="ok" moreClass="ml-5" onClick={() => handleReset()} />
                </div>
              )}
            />
          </div>
        </div>
      </Spin>
    </>
  );
};

export default PricingPlan;
