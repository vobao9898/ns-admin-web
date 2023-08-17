import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Select, DatePicker, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { DataTable, ModalForm } from 'components';

import { useAuth } from 'globalContext';
import { ColumnInvoice } from 'columns/merchant';
import { MerchantService } from 'services/merchant';
import { Button } from 'layouts/components';
import moment from 'moment';

const Page = ({ id, toggleState, clickInvoice }) => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [detailMode, setDetailMode] = useState(false);
  let [timeRange, setTimeRange] = useState('thisWeek');
  let [timeStart, setTimeStart] = useState();
  let [timeEnd, setTimeEnd] = useState();
  let [status, setStatus] = useState('');
  let [paymentMethod, setPaymentMethod] = useState('');
  const [invoice, setInvoice] = useState({});

  clickInvoice(() => {
    // khi click invoice -> set detailMode = false ( ve lai table)
    setDetailMode(false);
  });

  useEffect(() => {
    setDetailMode(false);
  }, [toggleState]);

  const handleRefundInvoice = async (record) => {
    await MerchantService.putRefundInvoice(record?.checkoutId);
    setIsLoading(true);
    const { data } = await MerchantService.getInvoiceById(record?.checkoutId, {
      merchantId: record?.merchantId,
    });
    setInvoice(data);
    setDetailMode(true);
    setIsLoading(false);
  };

  const handleResetFilter = () => {
    setTimeRange('thisWeek');
    timeRange = 'thisWeek';
    setStatus('');
    status = '';
    setPaymentMethod('');
    paymentMethod = '';
    dataTableRef?.current?.onChange();
  };

  const datePickerHandle = (value) => {
    const [start, end] = value;
    setTimeStart(start.format('L'));
    timeStart = start.format('L');
    setTimeEnd(end.format('L'));
    timeEnd = end.format('L');
    dataTableRef?.current?.onChange();
  };

  const dataTableRef = useRef();
  const modalFormRef = useRef();

  return (
    <Fragment>
      {!detailMode && (
        <div>
          <ModalForm
            ref={modalFormRef}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            widthModal={600}
            GetById={MerchantService.getById}
            Post={MerchantService.post}
            Put={MerchantService.put}
            Delete={MerchantService.delete}
            title={(data) => (!data?.id ? 'Create' : 'Edit')}
            handleChange={() => dataTableRef?.current?.onChange()}
            columns={ColumnInvoice({ t, formatDate })}
          />
          <DataTable
            ref={dataTableRef}
            xScroll={'100%'}
            save={false}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            idElement={'invoice'}
            pageSize={'row'}
            fullTextSearch={'key'}
            onRow={(record) => ({
              onClick: async () => {
                setIsLoading(true);
                const { data } = await MerchantService.getInvoiceById(record?.checkoutId, {
                  merchantId: record?.merchantId,
                });
                setInvoice(data);
                setDetailMode(true);
                setIsLoading(false);
              },
            })}
            Get={async (params) => {
              params.quickFilter = timeRange;
              params.timeStart = timeStart;
              params.timeEnd = timeEnd;
              params.method = paymentMethod;
              params.status = status;
              params.merchantId = id;
              return await MerchantService.getInvoice(params);
            }}
            columns={ColumnInvoice({
              t,
              formatDate,
              handleEdit: modalFormRef?.current?.handleEdit,
              handleDelete: modalFormRef?.current?.handleDelete,
            })}
            rightHeader={
              <div className="mb-4 flex items-center">
                <div className="flex items-center mr-5">
                  <p className="mr-2 text-black font-medium">Time Range</p>
                  <Select
                    value={timeRange}
                    onChange={(value) => {
                      setTimeRange(value);
                      timeRange = value;
                      dataTableRef?.current?.onChange();
                    }}
                    className="min-w-[130px]"
                  >
                    <Select.Option value="today">Today</Select.Option>
                    <Select.Option value="yesterday">Yesterday</Select.Option>
                    <Select.Option value="thisWeek">This Week</Select.Option>
                    <Select.Option value="lastWeek">Last Week</Select.Option>
                    <Select.Option value="thisMonth">This Month</Select.Option>
                    <Select.Option value="lastMonth">Last Month</Select.Option>
                    <Select.Option value="custom">Custom</Select.Option>
                  </Select>
                </div>

                {timeRange === 'custom' && (
                  <div className="mr-5 flex items-center">
                    <p className="text-black font-medium mr-2">From To</p>
                    <DatePicker.RangePicker
                      onChange={(e) => datePickerHandle(e)}
                      className="w-[260px]"
                      format="MM/DD/YYYY"
                    />
                  </div>
                )}

                <div className="flex items-center mr-5">
                  <p className="mr-2 text-black font-medium">Status</p>
                  <Select
                    value={status}
                    onChange={(value) => {
                      setStatus(value);
                      status = value;
                      dataTableRef?.current?.onChange();
                    }}
                    className="min-w-[130px]"
                  >
                    <Select.Option value="">All</Select.Option>
                    <Select.Option value="complete">Complete</Select.Option>
                    <Select.Option value="incomplete">Incomplete</Select.Option>
                    <Select.Option value="paid">Paid</Select.Option>
                    <Select.Option value="void">Void</Select.Option>
                    <Select.Option value="refund">Refund</Select.Option>
                    <Select.Option value="cancel">Cancel</Select.Option>
                    <Select.Option value="transaction fail">Transaction Fail</Select.Option>
                  </Select>
                </div>

                <div className="flex items-center mr-5">
                  <p className="mr-2 text-black font-medium">Payment method</p>
                  <Select
                    value={paymentMethod}
                    onChange={(value) => {
                      setPaymentMethod(value);
                      paymentMethod = value;
                      dataTableRef?.current?.onChange();
                    }}
                    className="min-w-[130px]"
                  >
                    <Select.Option value="">All</Select.Option>
                    <Select.Option value="nailsoft">NailSoft</Select.Option>
                    <Select.Option value="credit_card">Credit Card</Select.Option>
                    <Select.Option value="cash">Cash</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                    <Select.Option value="giftcard">Gift Card</Select.Option>
                  </Select>
                </div>
                <Button name="Reset" type="ok" onClick={() => handleResetFilter()} />
              </div>
            }
          />
        </div>
      )}

      {detailMode && (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <strong className="text-lg mb-5">Invoice #{invoice?.code}</strong>
            <div className="justify-self-end">
              {invoice?.status === 'paid' && (
                <Popconfirm
                  placement="left"
                  title={
                    <div>
                      <strong>Refund Confirmation</strong>
                      <div>Are you sure you want to refund this invoice?</div>
                    </div>
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handleRefundInvoice(invoice)}
                  okText={t('components.datatable.ok')}
                  cancelText={t('components.datatable.cancel')}
                >
                  <Button name="REFUND" type="ok" moreClass="mr-5" />
                </Popconfirm>
              )}
              <Button
                name="BACK"
                type="cancel"
                onClick={() => {
                  dataTableRef?.current?.onChange();
                  setDetailMode(false);
                }}
                moreClass="mr-5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h1>
                <strong className="text-base">Invoice Details</strong>
              </h1>
              <div className="p-5 rounded-lg bg-gray-50	mt-2">
                <div className="flex items-center py-2">
                  <p className="w-3/5">Invoice ID</p>
                  <p className="w-2/5">
                    <strong>#{invoice?.code}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Date</p>
                  <p className="w-2/5">
                    <strong>{moment(invoice?.createdDate).format('MM/DD/YYYY')}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Time</p>
                  <p className="w-2/5">
                    <strong>{moment(invoice?.createdDate).format('hh:mm A')}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Customer</p>
                  <p className="w-2/5">
                    <strong>{invoice?.user?.firstName + ' ' + invoice?.user?.lastName}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Phone</p>
                  <p className="w-2/5">
                    <strong>{invoice?.user?.phone}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Status</p>
                  <p className="w-2/5">
                    <strong>{invoice?.status}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Payment method</p>
                  <p className="w-2/5">
                    <strong>{invoice?.paymentMethod}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Total amount</p>
                  <p className="w-2/5">
                    <strong>${invoice?.total}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Created by</p>
                  <p className="w-2/5">
                    <strong>{invoice?.createdBy}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Modified by</p>
                  <p className="w-2/5">
                    <strong>{invoice?.modifiedBy}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h1>
                <strong className="text-base">Basket</strong>
              </h1>
              <div className="p-5 rounded-lg bg-gray-50	mt-2">
                <div className="flex flex-row border-b mt-2 p-2">
                  <div className="basis-1/3">
                    <strong>Description</strong>
                  </div>
                  <div className="basis-1/6">
                    <strong>Price</strong>
                  </div>
                  <div className="basis-1/3">
                    <strong>Qty</strong>
                  </div>
                  <div className="basis-1/6">
                    <strong>Total</strong>
                  </div>
                </div>

                {invoice?.basket?.extras &&
                  invoice?.basket?.extras.map((item, index) => (
                    <div key={index} className="flex flex-row border-b mt-2 p-2">
                      <div className="basis-1/3">
                        <strong>{item?.extraName}</strong>
                      </div>
                      <div className="basis-1/6">
                        <strong>${item?.price}</strong>
                      </div>
                      <div className="basis-1/3">
                        <strong>{item?.quantity ? item?.quantity : '1'}</strong>
                      </div>
                      <div className="basis-1/6">
                        <strong>
                          {item?.quantity
                            ? (item?.price * item?.quantity).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })
                            : '$' + item?.price}
                        </strong>
                      </div>
                    </div>
                  ))}

                {invoice?.basket?.giftCards &&
                  invoice?.basket?.giftCards.map((item, index) => (
                    <div key={index} className="flex flex-row border-b mt-2 p-2">
                      <div className="basis-1/3">
                        <strong>{item?.name}</strong>
                      </div>
                      <div className="basis-1/6">
                        <strong>${item?.price}</strong>
                      </div>
                      <div className="basis-1/3">
                        <strong>{item?.quantity ? item?.quantity : '1'}</strong>
                      </div>
                      <div className="basis-1/6">
                        <strong>
                          {item?.quantity
                            ? (item?.price * item?.quantity).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })
                            : '$' + item?.price}
                        </strong>
                      </div>
                    </div>
                  ))}

                {invoice?.basket?.products &&
                  invoice?.basket?.products.map((item, index) => (
                    <div key={index} className="flex flex-row border-b mt-2 p-2">
                      <div className="basis-1/3">
                        <strong>{item?.productName}</strong>
                      </div>
                      <div className="basis-1/6">
                        <strong>${item?.price}</strong>
                      </div>
                      <div className="basis-1/3">
                        <strong>{item?.quantity ? item?.quantity : '1'}</strong>
                      </div>
                      <div className="basis-1/6">
                        <strong>
                          {item?.quantity
                            ? (item?.price * item?.quantity).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })
                            : '$' + item?.price}
                        </strong>
                      </div>
                    </div>
                  ))}

                {invoice?.basket?.services &&
                  invoice?.basket?.services.map((item, index) => (
                    <div key={index} className="flex flex-row border-b mt-2 p-2">
                      <div className="basis-1/3">
                        <strong>{item?.serviceName}</strong>
                      </div>
                      <div className="basis-1/6">
                        <strong>${item?.price}</strong>
                      </div>
                      <div className="basis-1/3">
                        <strong>{item?.quantity ? item?.quantity : '1'}</strong>
                      </div>
                      <div className="basis-1/6">
                        <strong>
                          {item?.quantity
                            ? (item?.price * item?.quantity).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              })
                            : '$' + item?.price}
                        </strong>
                      </div>
                    </div>
                  ))}

                <div className="flex flex-row mt-2 p-2">
                  <div className="basis-5/6">Subtotal</div>
                  <div className="basis-1/6">
                    <strong className="text-green-600	">${invoice?.subTotal}</strong>
                  </div>
                </div>

                <div className="flex flex-row mt-2 p-2">
                  <div className="basis-5/6">Tip</div>
                  <div className="basis-1/6">
                    <strong className="text-green-600	">${invoice?.tipAmount}</strong>
                  </div>
                </div>

                <div className="flex flex-row mt-2 p-2">
                  <div className="basis-5/6">Discount</div>
                  <div className="basis-1/6">
                    <strong className="text-green-600	">${invoice?.discount}</strong>
                  </div>
                </div>

                <div className="flex flex-row mt-2 p-2">
                  <div className="basis-5/6">Tax</div>
                  <div className="basis-1/6">
                    <strong className="text-green-600	">${invoice?.tax}</strong>
                  </div>
                </div>

                <div className="flex flex-row mt-2 p-2">
                  <div className="basis-5/6">
                    <strong>Total</strong>
                  </div>
                  <div className="basis-1/6">
                    <strong className="text-green-600	">${invoice?.total}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h1>
                <strong className="text-base">History</strong>
              </h1>
              <div className="p-5 rounded-lg bg-gray-50	mt-2">
                {invoice?.history &&
                  invoice?.history.map((item, index) => (
                    <div key={index} className="flex items-center py-2">
                      <p className="w-2/5">{moment(item?.createdAt).format('MM/DD/YYYY hh:mm A')}</p>
                      <p className="w-3/5">
                        <strong>{item?.message}</strong>
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default Page;
