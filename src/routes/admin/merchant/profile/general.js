import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MerchantService } from 'services/merchant';
import { useAuth } from 'globalContext';
import { ColumnGeneral } from 'columns/merchant';
import { Radio, Spin } from 'antd';
import { Button } from 'layouts/components';
import { ModalForm } from 'components';

import '../index.less';

const Page = ({ merchant, handleChange, isLoading, setIsLoading, state, id, toggleState }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    type: merchant?.type,
    ...merchant?.general,
    ...merchant?.general?.dbaAddress,
  });

  const { formatDate } = useAuth();

  const modalFormRef = useRef();
  const getInit = useCallback(async () => {
    if (merchant?.general) {
      setData({
        type: merchant?.type,
        ...merchant?.general,
        ...merchant?.general?.dbaAddress,
      });
    }
  }, [merchant]);

  useEffect(() => {
    getInit();
  }, [getInit, toggleState]);

  return (
    <Spin spinning={false}>
      <ModalForm
        ref={modalFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={1200}
        idElement={'user'}
        handleChange={handleChange}
        title={(data) => (!data?.id ? 'Edit' : 'Edit')}
        Post={MerchantService.post}
        Put={MerchantService.editGeneral}
        Delete={MerchantService.delete}
        getInit={getInit}
        GetById={() => ({
          data,
        })}
        columns={ColumnGeneral({
          t,
          formatDate,
          state,
          modalFormRef,
          setData,
          setIsLoading
        })}
      />
      <div className="font-bold text-lg mb-4 text-blue-500">General Information</div>
      <div className="grid grid-cols-12 gap-6 mb-4">
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">
            Legal Business Name <div className="ant-form-item-required" />
          </div>
          <div className="text-sm">{merchant && merchant?.general?.legalBusinessName}</div>
        </div>
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Doing Business As</div>
          <div className="text-sm">{merchant && merchant?.general?.doBusinessName}</div>
        </div>
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Merchant type</div>
          <div className="text-sm">{merchant && merchant?.type}</div>
        </div>
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Federal Tax ID</div>
          <div className="text-sm">{merchant && merchant?.general?.tax}</div>
        </div>
        <div className="sm:col-span-12 col-span-12">
          <div className="text-sm font-semibold mb-2">Business Address</div>
          <div className="text-sm">{merchant && merchant?.general?.address}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">City</div>
          <div className="text-sm">{merchant && merchant?.general?.city}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">State</div>
          <div className="text-sm">{merchant && merchant?.state?.name}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Zip Code</div>
          <div className="text-sm">{merchant && merchant?.general?.zip}</div>
        </div>
        <div className="sm:col-span-12 col-span-12">
          <div className="text-sm font-semibold mb-2">DBA Address</div>
          <div className="text-sm">{merchant && merchant?.general?.dbaAddress?.Address}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">City</div>
          <div className="text-sm">{merchant && merchant?.general?.dbaAddress?.City}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">State</div>
          <div className="text-sm">{merchant && merchant?.general?.dbaAddress?.StateName}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Zip Code</div>
          <div className="text-sm">{merchant && merchant?.general?.dbaAddress?.Zip}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Business Phone Number</div>
          <div className="text-sm">
            {merchant && merchant?.general?.codePhoneBusiness + ' ' + merchant?.general?.phoneBusiness}
          </div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Contact Email Address</div>
          <div className="text-sm">{merchant && merchant?.general?.emailContact}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Password</div>
          <div className="text-sm flex items-center justify-between">
            <div>{showPassword ? merchant && merchant?.password : '********'}</div>
            <div className="" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <i className="las la-eye-slash"></i> : <i className="las la-eye cursor-pointer"></i>}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Contact Name</div>
          <div className="text-sm">{merchant && merchant?.general?.firstName + ' ' + merchant?.general?.lastName}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Title/Position</div>
          <div className="text-sm">{merchant && merchant?.general?.title}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Contact Phone Number</div>
          <div className="text-sm">
            {merchant && merchant?.general?.codePhoneContact + ' ' + merchant?.general?.phoneContact}
          </div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Review Link</div>
          <div className="text-sm">{merchant && merchant?.general?.reviewLink}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Send Review Link Option</div>
          <div className="text-sm capitalize">
            {merchant && merchant?.general?.sendReviewLinkOption === 'auto'
              ? 'Automatic'
              : merchant?.general?.sendReviewLinkOption}
          </div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Latitude</div>
          <div className="text-sm">{merchant && merchant?.general?.latitude}</div>
        </div>
        <div className="lg:col-span-4 md:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Longitude</div>
          <div className="text-sm">{merchant && merchant?.general?.longitude}</div>
        </div>
      </div>
      <div className="font-bold text-lg mb-4 text-blue-500">Business Information</div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mb-4">
        <div className="">
          <div className="text-sm font-semibold mb-2">
            {merchant && merchant?.business && merchant?.business[0]?.question}
          </div>
          <div className="text-sm mb-2">
            <Radio.Group value={merchant && merchant?.business && merchant?.business[0]?.answer}>
              <Radio value={false}>No</Radio>
              <Radio value={true}>Yes (if yes, who was the processor)</Radio>
            </Radio.Group>
          </div>
          <div className="text-sm font-semibold">
            Answer: {merchant && merchant?.business && merchant?.business[0]?.answerReply}
          </div>
        </div>

        <div className="">
          <div className="text-sm font-semibold mb-2">
            {merchant && merchant?.business && merchant?.business[1]?.question}
          </div>
          <div className="text-sm mb-2">
            <Radio.Group value={merchant && merchant?.business && merchant?.business[1]?.answer}>
              <Radio value={false}>No</Radio>
              <Radio value={true}>Yes (if yes, who was the processor)</Radio>
            </Radio.Group>
          </div>
          <div className="text-sm font-semibold">
            Answer: {merchant && merchant?.business && merchant?.business[1]?.answerReply}
          </div>
        </div>

        <div className="">
          <div className="text-sm font-semibold mb-2">
            {merchant && merchant?.business && merchant?.business[2]?.question}
          </div>
          <div className="text-sm mb-2">
            <Radio.Group value={merchant && merchant?.business && merchant?.business[2]?.answer}>
              <Radio value={false}>No</Radio>
              <Radio value={true}>Yes (if yes, date filed)</Radio>
            </Radio.Group>
          </div>
          <div className="text-sm font-semibold">
            Answer: {merchant && merchant?.business && merchant?.business[2]?.answerReply}
          </div>
        </div>

        <div className="">
          <div className="text-sm font-semibold mb-2">
            {merchant && merchant?.business && merchant?.business[3]?.question}
          </div>
          <div className="text-sm mb-2">
            <Radio.Group value={merchant && merchant?.business && merchant?.business[3]?.answer}>
              <Radio value={false}>No</Radio>
              <Radio value={true}>Yes (if yes, what was program and when)</Radio>
            </Radio.Group>
          </div>
          <div className="text-sm font-semibold">
            Answer: {merchant && merchant?.business && merchant?.business[3]?.answerReply}
          </div>
        </div>

        <div className="">
          <div className="text-sm font-semibold mb-2">
            {merchant && merchant?.business && merchant?.business[4]?.question}
          </div>
          <div className="text-sm mb-2">
            <Radio.Group value={merchant && merchant?.business && merchant?.business[4]?.answer}>
              <Radio value={false}>No</Radio>
              <Radio value={true}>Yes (if yes, who was your previous company)</Radio>
            </Radio.Group>
          </div>
          <div className="text-sm font-semibold">
            Answer: {merchant && merchant?.business && merchant?.business[4]?.answerReply}
          </div>
        </div>
      </div>
      <Button
        type="ok"
        name={'Edit'}
        onClick={() => {
          modalFormRef?.current?.handleEdit({ ...merchant, id: '1' });
        }}
      />
    </Spin>
  );
};
export default Page;
