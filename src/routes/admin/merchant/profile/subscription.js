import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable, ModalForm } from 'components';

import { MerchantService } from 'services/merchant';
import { Spin } from 'antd';

import { useAuth } from 'globalContext';
import { ColumnSubscription, ColumnSubscriptionHistory } from 'columns/merchant';
import { Button } from 'layouts/components';
import moment from 'moment';

const Page = ({ id, setToggleState, toggleState }) => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState();
  const [packages, setPackages] = useState();
  const [packageId, setPackageId] = useState();
  const dataTableRef = useRef();
  const idRef = useRef();

  const initFunction = useCallback(async () => {
    const subscriptuionRes = await MerchantService.getSubscription(id);
    const packageRes = await MerchantService.getPackage();
    const data = packageRes?.data;
    const stemp = [];

    data?.forEach((item) => {
      if (item?.isDisabled === 0) {
        stemp.push(item);
      }
    });
    await setSubscription(subscriptuionRes?.data);
    await setPackages(stemp);
    await setPackageId(subscriptuionRes?.data?.packageId);
    idRef.current = subscriptuionRes?.data?.subscriptionId;
    await setIsLoading(false);
    await dataTableRef?.current?.onChange();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (toggleState === 'subscription') {
      initFunction();
    }
  }, [initFunction]);

  const handleChange = async () => {
    setIsLoading(true);
    const { data } = await MerchantService.getSubscription(id);
    setSubscription(data);
    setIsLoading(false);
    await dataTableRef?.current?.onChange();
  };

  const handleAfterClose = () => {
    setPackageId(subscription?.packageId);
  };

  const handleExport = async (ids) => {
    await setIsLoading(true);
    const { data } = await MerchantService.getExportSubscription(ids);
    const link = document.createElement('a');
    if (data) {
      link.href = data;
      link.target = '_blank';
      link.download = 'Export_Subscription.xlsx';
      link.click();
    }
    await setIsLoading(false);
  };

  const modalFormRef = useRef();

  return (
    <Spin spinning={isLoading}>
      <ModalForm
        ref={modalFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={600}
        handleChange={handleChange}
        Put={MerchantService.editSubscription}
        GetById={() => ({ data: subscription })}
        title={(data) => (data?.id ? 'Edit' : 'Add')}
        setPackageId={setPackageId}
        columns={ColumnSubscription({
          t,
          formatDate,
          packages,
          packageId,
        })}
        afterClose={handleAfterClose}
      />

      <div className="my-5">
        <div className="mb-4">
          <div className="font-bold text-lg mb-4 text-blue-500">Subscription</div>
          <div className="w-3/5 mb-3">
            <div className="grid grid-cols-2 items-center">
              <div>{'Current Subscription Plan'}</div>
              <div>{subscription?.planName}</div>
              <div>{'Pricing Model'}</div>
              <div>Paid {subscription?.pricingType}</div>
              <div>{'Next Payment Date'}</div>
              <div>{moment(subscription?.expiredDate).format('MMM D, YYYY')}</div>
              <div>{'Amount'}</div>
              <div>$ {subscription?.totalPrice}</div>
              {subscription && subscription?.packageId === 28 && (
                <>
                  <div>{'Addition staff'}</div>
                  <div>{subscription?.additionStaff}</div>
                </>
              )}
            </div>
          </div>
          <div className="mr-2 mt-1">
            <Button
              type="ok"
              onClick={() => modalFormRef?.current?.handleEdit({ ...subscription, id: subscription?.subscriptionId })}
              name="Edit"
            />
          </div>
        </div>
        <div className="">
          <div className="font-bold text-lg mb-4 text-blue-500">Payment Method</div>
          <p>{subscription?.paymentMethod}</p>
          <div className="mr-2 mt-3">
            <Button
              type="ok"
              onClick={() => {
                setToggleState('bank');
                localStorage.setItem('toggleState', JSON.stringify('bank'));
              }}
              name="Edit"
            />
          </div>
        </div>
        <div className="mt-8">
          <div className="font-bold text-lg text-blue-500">Billing History</div>
          <DataTable
            ref={dataTableRef}
            save={false}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            searchPlaceholder={'Search...'}
            id={() => idRef.current}
            Get={MerchantService.getSubscriptionGetHistory}
            columns={ColumnSubscriptionHistory({ handleExport })}
            showSearch={false}
          />
        </div>
      </div>
    </Spin>
  );
};
export default Page;
