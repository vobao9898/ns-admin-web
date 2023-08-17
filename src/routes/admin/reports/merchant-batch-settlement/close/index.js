import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import { Form as FormAnd, Spin } from 'antd';
import { Title, Button } from 'layouts/components';

import '../../index.less';
import { Form } from 'components';
import ReportService from 'services/reports';
import axios from 'axios';

const CloseSettlement = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [currentObj, setCurrentObj] = useState({});
  const [cols, setCols] = useState([]);
  const [settlementWaiting, setSettlementWaiting] = useState({});
  const [terminal, setTerminal] = useState(null);
  const [note, setNote] = useState('');
  const [form] = FormAnd.useForm();

  const getBasic = useCallback(async () => {
    const data = await ReportService.getBasic();
    const basics = data.map((item) => ({ value: item?.merchantid, label: item?.businessname }));
    const cols = [
      {
        title: 'Merchant & Device',
        formItem: {
          type: 'title',
          col: 12,
          render: () => <h4 className="font-semibold text-blue-500 text-xl">Merchant & Device</h4>,
        },
      },
      {
        title: 'Merchant',
        name: 'merchant',
        formItem: {
          rules: [{ type: 'required' }],
          type: 'select',
          list: basics,
          col: 4,
          onChange: (value, form) => {
            form.resetFields(['device']);
            form.setFieldsValue({ device: null });
          },
        },
      },
      {
        title: 'Device',
        name: 'device',
        formItem: {
          rules: [{ type: 'required' }],
          type: 'select',
          col: 4,
          api: {
            link: (getFieldValue) => {
              const id = getFieldValue(['merchant']);
              return id ? `/Merchant/${id}/device-terminal` : null;
            },
            format: (item) => {
              setTerminal(item);
              return { label: item?.terminalId, value: item?.deviceId };
            },
          },
          onChange: async (value, form) => {
            form.resetFields(['serialNumber']);
            form.setFieldsValue({ serialNumber: '' });
            const { data } = await axios.get('/Settlement/ssnByDevice', {
              params: {
                merchantId: form.getFieldValue(['merchant']),
                deviceId: value,
              },
            });
            form.setFieldsValue({ serialNumber: data.data });
          },
        },
      },
      {
        title: 'Serial number',
        name: 'serialNumber',
        formItem: {
          disabled: () => true,
          col: 4,
        },
      },
    ];

    setCols(cols);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getBasic();
  }, [getBasic]);

  const nextHandle = async () => {
    form.validateFields().then(async (value) => {
      setIsLoading(true);
      const data = await ReportService.getSettlementWaiting({
        sn: value?.serialNumber,
        merchantId: value?.merchant,
        deviceId: value?.device,
      });
      setCurrentObj({
        merchant: value?.merchant,
        device: value?.device,
        serialNumber: value?.serialNumber,
      });
      setSettlementWaiting(data);
      setCurrent(current + 1);
      setIsLoading(false);
    });
  };

  const closeSettlement = async () => {
    setIsLoading(true);
    const { codeNumber } = await ReportService.closeSettlement(
      settlementWaiting?.settlement,
      terminal,
      note,
      currentObj,
    );
    if (codeNumber === 200) navigate(routerLinks('Merchant Batch Settlement'));

    setIsLoading(false);
  };

  const steps = [
    {
      title: 'Merchant & Device',
      content: cols && <Form columns={cols} form={form} values={currentObj} />,
    },
    {
      title: 'Submit',
      content: (
        <div>
          <h2 className="mb-4 text-xl text-blue-500 font-medium">Submit</h2>
          <div className="flex w-full">
            <div className="w-1/2 pr-2 lg:pr-5 text-white font-medium">
              <p className="mb-2 font-medium text-base text-black">Actual Amount</p>
              <div className="flex items-center justify-between p-2.5 bg-blue-900">
                <p className="">Nailsoft account</p>
                <p>${settlementWaiting?.settlement?.paymentByHarmony}</p>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-blue-800">
                <p className="">Credit card</p>
                <p>${settlementWaiting?.settlement?.paymentByCreditCard}</p>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-blue-600">
                <p className="">Cash</p>
                <p>${settlementWaiting?.settlement?.paymentByCash}</p>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-blue-500">
                <p className="">Gift Card</p>
                <p>${settlementWaiting?.settlement?.paymentByGiftcard}</p>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-blue-400">
                <p className="">Other</p>
                <p>${settlementWaiting?.settlement?.otherPayment}</p>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-blue-300">
                <p className="">Star redeem</p>
                <p>${settlementWaiting?.settlement?.redeemStar}</p>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-blue-200">
                <p className="">Discount</p>
                <p>${settlementWaiting?.settlement?.discount}</p>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-blue-100 text-black font-semibold">
                <p className="">Total</p>
                <p className="text-green-500">${settlementWaiting?.settlement?.total}</p>
              </div>
            </div>
            <div className="w-1/2 pl-2 lg:pl-5 text-white font-medium">
              <p className="mb-2 font-medium text-base text-black">Open batch</p>
              <div className="flex items-center justify-between p-2.5 bg-blue-800">
                <p className="">Credit card transaction:</p>
                <p>{settlementWaiting?.settlement?.paymentTransaction?.length}</p>
              </div>

              <div className="w-full text-black">
                <div className="flex items-center">
                  <p className="py-2 text-xs min-w-[20%] bg-gray-200">Trans ID</p>
                  <p className="py-2 text-xs min-w-[20%] bg-gray-200">Invoice</p>
                  <p className="py-2 text-xs min-w-[20%] bg-gray-200">Payments</p>
                  <p className="py-2 text-xs min-w-[20%] bg-gray-200">Status</p>
                  <p className="py-2 text-xs min-w-[20%] bg-gray-200">Amount</p>
                </div>
                {settlementWaiting &&
                  settlementWaiting?.settlement?.paymentTransaction &&
                  settlementWaiting?.settlement?.paymentTransaction?.map((item, index) => (
                    <div className="flex items-center" key={index}>
                      <p className="py-2 pr-0.5 text-xs min-w-[20%]">#{item?.transactionId}</p>
                      <p className="py-2 pr-0.5 text-xs min-w-[20%]">#{item?.checkoutId}</p>
                      <p className="py-2 pr-0.5 text-xs min-w-[20%]">
                        <span className="p-1 rounded text-[10px] bg-blue-100 text-blue-500">Other</span> x
                        {item?.paymentData?.card_number}
                      </p>
                      <p className="py-2 pr-0.5 text-xs min-w-[20%]">{item?.status}</p>
                      <p className="py-2 pr-0.5 text-xs min-w-[20%]">$ {item?.amount}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-5 w-1/2 pr-5">
            <p className="mb-1 font-medium text-lg text-black">Note:</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="p-2 text-black text-base outline-none border border-black/20 w-full"
            />
          </div>
        </div>
      ),
    },
  ];

  const bread = [
    {
      name: 'Reports',
    },
    {
      name: 'Batch',
      path: 'Merchant Batch Settlement',
    },
    {
      name: 'Close Settlement',
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <Title title="Close Settlement" breadcrumbs={bread} />
      <div className="mb-4 text-lg w-full rounded-xl px-4 py-3 bg-white shadow-md">
        <div className={`w-full flex flex-wrap items-center demo my-5 text-white`}>
          {steps.map((step, index) => {
            let bgRec = 'bg-gray-500';
            let bg = 'bg-gray-500 lg:bg-gray-500';
            let border = 'border-l-gray-500';
            let width = 'w-full md:w-1/3 lg:w-1/5';

            if (index === current) {
              border = 'border-l-blue-500';
              bgRec = 'bg-blue-500';
            }
            if (index < current) {
              border = 'border-l-green-500';
              bg = 'bg-green-500 lg:bg-green-500';
              bgRec = 'bg-green-500';
            }
            if (index === current - 1) {
              bg = 'bg-blue-500 lg:bg-blue-500';
            }
            if (index === steps.length - 1) {
              bg = 'bg-white';
            }

            if (index > 2) {
              width = 'w-full md:w-1/2 lg:w-1/5';
            }

            if (index === 2) {
              bg = bg + ' md:bg-white';
            }

            return (
              <div className={`h-20 relative border-white ${width} border-b border-white md:border-0`} key={index}>
                <div className={`w-full h-full text-center pr-8 flex flex-col justify-center ${bgRec}`}>
                  <h4 className="text-white font-semibold">Step {index + 1}</h4>
                  <p className="text-sm">{step.title}</p>
                </div>
                {/* arrow */}
                <p
                  className={`hidden md:block step-arrow absolute top-0 ${
                    index === steps.length - 1 ? 'right-[0]' : 'right-[2px]'
                  } w-0 h-0 z-10
                    border-b-[40px] border-t-[40px]
                    border-b-transparent border-t-transparent
                    ${border} border-l-[30px]`}
                ></p>
                {/* arrow white */}
                <p
                  className="hidden md:block step-arrow absolute top-0 right-0 w-0 h-0 z-[1]
                    border-b-[40px] border-t-[40px]
                    border-b-transparent border-t-transparent
                    border-l-white border-l-[30px]"
                ></p>
                {/* bg */}
                <p
                  className={`aa hidden md:block w-[30px] h-20 ${bg}
                  absolute top-0 right-0 z-0`}
                ></p>
              </div>
            );
          })}
        </div>

        <div className="steps-content">{steps[current]?.content}</div>
        <div className="steps-action mt-10">
          {current < steps.length - 1 && (
            <div className="flex items-center justify-between">
              <Button name="Next" type="ok" onClick={nextHandle} />
              <Button name="Cancel" type="cancel" onClick={() => navigate(routerLinks('Merchant Batch Settlement'))} />
            </div>
          )}
          {current === steps.length - 1 && (
            <div className="flex">
              <Button
                name="Back"
                type="cancel"
                onClick={() => {
                  if (form) {
                    form.resetFields();
                    form.setFieldsValue({ merchant: currentObj?.merchant });
                  }
                  setCurrent(current - 1);
                }}
                moreClass="mr-5"
              />
              {settlementWaiting?.settlement?.paymentTransaction.length === 0 &&
              settlementWaiting?.settlement?.total === '0.00' ? (
                <div />
              ) : (
                <Button name="Close Settlement" type="ok" onClick={closeSettlement} />
              )}
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default CloseSettlement;
