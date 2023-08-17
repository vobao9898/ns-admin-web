import React, { useState, useRef } from 'react';
import { MerchantService } from 'services/merchant';

import { ColumnSetting } from 'columns/merchant';
import { Checkbox, Popover, Spin, Upload } from 'antd';
import { Button } from 'layouts/components';
import { Message, ModalForm, Modal } from 'components';
import { linkApi, keyToken } from 'variable';
import close_black from 'assets/images/close_black.png';
import classNames from 'classnames';

const Page = ({ location, id, merchant, handleChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisiable, setIsvisiable] = useState(false);
  const [linkExport, setLinkExport] = useState(null);
  const activeHandle = async () => {
    setIsLoading(true);
    const data = await MerchantService.activeSetting(merchant?.merchantId);
    if (data?.data) {
      Message.success({ text: data?.message });
      handleChange();
      setIsLoading(false);
      return;
    }
    Message.error({ text: data?.message });
    setIsvisiable(false);
  };

  const downloadCustomerTemplate = async () => {
    setIsLoading(true);
    const data = await MerchantService.downloadCustomerTemplate();
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `customerTemplate.xlsx`);
    document.body.appendChild(link);
    link.click();
    setIsLoading(false);
  };

  const generateBookingLink = async () => {
    setIsLoading(true);
    const data = await MerchantService.generateBookingLink(merchant?.merchantId);
    modalRef?.current?.handleShow(data);
    setIsLoading(false);
  };

  const generateCaller = async () => {
    setIsLoading(true);
    const data = await MerchantService.generateCallerLink(merchant?.merchantId);
    modalRefCaller?.current?.handleShow(data);
    setIsLoading(false);
  };

  const generatePortalLink = async () => {
    if (merchant && merchant.merchantId) {
      setIsLoading(true);
      const data = await MerchantService.generatePortalLink(merchant?.merchantId);
      if (data) {
        modalPortalRef?.current?.handleShow(data);
      }
      setIsLoading(false);
    }
  };

  const modalRef = useRef();
  const modalFormRef = useRef();
  const modalFormInactiveRef = useRef();
  const modalRefLink = useRef();
  const modalRefCaller = useRef();
  const modalPortalRef = useRef();

  return (
    <Spin spinning={isLoading}>
      <Modal
        ref={modalRefLink}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        title={() => <div className="h-[20px]"></div>}
        // onHide={() => loadingExport ? () => { } : closeExport()}
      >
        <div className="modalExport">
          <>
            <img src={close_black} alt="img" />
            <h3>Click below link to download error file</h3>
            {linkExport && linkExport !== '' && <a href={linkExport}>{linkExport}</a>}
          </>
        </div>
      </Modal>
      <Modal
        ref={modalRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        textSubmit={'Copy'}
        title={() => 'Online Booking Link'}
        onOk={() => navigator.clipboard.writeText(modalRef?.current?.data)}
      >
        <p className="text-blue-500 underline cursor-pointer" onClick={() => window.open(modalRef?.current?.data)}>
          {modalRef?.current?.data}
        </p>
      </Modal>
      <Modal
        ref={modalRefCaller}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        title={() => 'Generate Caller ID'}
        widthModal={1000}
        footerCustom={<></>}
      >
        <p className="py-5 text-[15px]">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="text-sm font-[500] mr-1 min-w-[140px]">Established Call URL: </div>
              <div
                className="cursor-pointer text-blue-500 underline mr-2"
                onClick={() => {
                  navigator.clipboard.writeText(modalRefCaller?.current?.data?.establishedCall);
                  Message.success({ text: 'Copy', title: null });
                }}
              >
                {modalRefCaller?.current?.data?.establishedCall}
              </div>
            </div>
            <button
              type={'button'}
              className={classNames(
                'px-4 py-2.5 rounded-xl inline-flex items-center btn-save text-white bg-blue-500 hover:bg-blue-400',
                {},
              )}
              onClick={() => {
                navigator.clipboard.writeText(modalRefCaller?.current?.data?.establishedCall);
                Message.success({ text: 'Copy', title: null });
              }}
            >
              {isLoading && <i className="las la-spinner mr-1 animate-spin" />}
              Copy
            </button>
          </div>
          <div className="flex items-center justify-center mt-5">
            <div className="flex items-center">
              <div className="text-sm font-[500] mr-1 min-w-[140px]">Terminated Call URL: </div>
              <div
                className="cursor-pointer text-blue-500 underline mr-2"
                onClick={() => {
                  navigator.clipboard.writeText(modalRefCaller?.current?.data?.terminatedCall);
                  Message.success({ text: 'Copy', title: null });
                }}
              >
                {modalRefCaller?.current?.data?.terminatedCall}
              </div>
            </div>
            <button
              type={'button'}
              className={classNames(
                'px-4 py-2.5 rounded-xl inline-flex items-center btn-save text-white bg-blue-500 hover:bg-blue-400',
                {},
              )}
              onClick={() => {
                navigator.clipboard.writeText(modalRefCaller?.current?.data?.terminatedCall);
                Message.success({ text: 'Copy', title: null });
              }}
            >
              {isLoading && <i className="las la-spinner mr-1 animate-spin" />}
              Copy
            </button>
          </div>
        </p>
      </Modal>
      <ModalForm
        ref={modalFormInactiveRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        handleChange={handleChange}
        textSubmit={'Confirm'}
        widthModal={600}
        title={() => 'Warning!'}
        parentID={() => merchant?.merchantId}
        Put={MerchantService.inactiveSetting}
        columns={[
          {
            title: 'Are you sure you want to Archive this Merchant?',
            name: 'reason',
            formItem: {
              type: 'textarea',
              placeholder: 'Please enter your reason',
              rules: [{ type: 'required' }],
            },
          },
        ]}
      />
      <ModalForm
        ref={modalFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={900}
        handleChange={handleChange}
        Put={MerchantService.editSetting}
        title={(data) => (!data?.id ? 'Edit' : 'Edit')}
        columns={ColumnSetting({
          merchant,
        })}
      />
      <Modal
        ref={modalPortalRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        textSubmit={'Copy'}
        title={() => 'Portal Link'}
        onOk={() => navigator.clipboard.writeText(modalPortalRef?.current?.data)}
      >
        <p
          className="text-blue-500 underline cursor-pointer"
          onClick={() => window.open(modalPortalRef?.current?.data)}
        >
          {modalPortalRef?.current?.data}
        </p>
      </Modal>
      <div className="font-bold text-lg mb-4 text-blue-500">Settings</div>
      <div className="grid grid-cols-12 gap-6 mb-4">
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Transactions Fee</div>
          <div className="text-sm">% {merchant?.transactionsFee}</div>
        </div>
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Merchant ID</div>
          <div className="text-sm">{merchant?.merchantCode}</div>
        </div>
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Discount Rate</div>
          <div className="text-sm">{merchant?.discountRate}</div>
        </div>
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Point Rate</div>
          <div className="text-sm">% {merchant?.pointRate}</div>
        </div>
        <div className="lg:col-span-3 md:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Turn Amount</div>
          <div className="text-sm">{merchant?.turnAmount}</div>
        </div>
        <div className="sm:col-span-6 col-span-12">
          <div className="text-sm font-semibold mb-2">Time Zone</div>
          <div className="text-sm">{merchant?.timezone}</div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mb-4">
        <div className="">
          <div className="text-sm font-semibold mb-2">Apply Cash Discount Program</div>
          <div className="text-sm mb-2">
            <Checkbox checked={merchant?.isCashDiscount} />
          </div>
          {merchant?.isCashDiscount && (
            <div className="sm:col-span-12 col-span-12">
              <div className="text-sm font-semibold mb-2">Cash discount percent</div>
              <div className="text-sm">{merchant?.cashDiscountPercent}</div>
            </div>
          )}
        </div>
        <div className="">
          <div className="text-sm font-semibold mb-2">Top Store</div>
          <div className="text-sm mb-2">
            <Checkbox checked={merchant?.isTop} />
          </div>
        </div>
        <div className="">
          <div className="text-sm font-semibold mb-2">Test Merchant</div>
          <div className="text-sm mb-2">
            <Checkbox checked={merchant?.isTest} />
          </div>
        </div>
        {merchant?.type === 'Retailer' && (
          <div className="">
            <div className="text-sm font-semibold mb-2">Is Warehouse</div>
            <div className="text-sm mb-2">
              <Checkbox checked={merchant?.isWareHouse} />
            </div>
          </div>
        )}
      </div>
      <Button
        name="Edit"
        onClick={() =>
          modalFormRef?.current?.handleEdit({ ...merchant, id: merchant?.merchantId, type: merchant?.type })
        }
        moreClass="mr-2 m-2"
      />
      {/* Dung Popconfirm */}
      {merchant && merchant?.isDisabled === 0 ? (
        <Button
          name="Inactive"
          type="cancel"
          onClick={() => modalFormInactiveRef?.current?.handleEdit({ id: merchant?.merchantId, reason: '' })}
          moreClass="mr-2 m-2"
        />
      ) : (
        <Popover
          title={'Confirmation'}
          placement="topLeft"
          content={
            <div className="">
              <p className="w-full text-center font-semibold mb-2">Are you sure you want to enable this Merchant?</p>
              <p>
                <span className="font-semibold">Why disabled: </span>
                {merchant?.disabledReason}
              </p>
              <div className="flex items-center justify-end mt-5">
                <Button name="Confirm" type={'ok'} onClick={() => activeHandle()} moreClass="mr-5" />
                <Button name="Cancel" type={'cancel'} onClick={() => setIsvisiable(false)} moreClass="mr-5" />
              </div>
            </div>
          }
          trigger="click"
          onVisibleChange={setIsvisiable}
          visible={isVisiable}
        >
          <Button name="Active" type="ok" onClick={() => {}} moreClass="mr-2 m-2" />
        </Popover>
      )}

      <Button name="Download Customer Template" moreClass="mr-2 m-2" onClick={() => downloadCustomerTemplate()} />
      <Button
        moreClass="mr-2 m-2"
        onClick={() => {}}
        // name="Import Customer"
        name={
          <Upload
            accept=".xlsx"
            method="put"
            name="file"
            action={linkApi + 'Customer/import/' + merchant?.merchantId}
            headers={{ Authorization: 'Bearer ' + localStorage.getItem(keyToken) }}
            showUploadList={false}
            onChange={({ file }) => {
              setIsLoading(true);
              if (file?.response && file?.response?.codeStatus !== 1) {
                if (file?.response && file?.response?.codeStatus === 4 && file?.response?.data?.path) {
                  if (file?.response?.data?.path) {
                    setLinkExport(file?.response?.data?.path);
                    modalRefLink?.current?.handleShow(file?.response?.data?.path);
                  }
                } else {
                  Message.error({ text: file?.response?.message });
                }
                setIsLoading(false);
              }
              if (file?.response && file?.response?.codeStatus === 1) {
                Message.success({ text: file?.response?.message });
                handleChange();
                setIsLoading(false);
              }
            }}
          >
            Import Customer
          </Upload>
        }
      />
      <Button name="Generate Booking Link" moreClass="mr-2 m-2" onClick={() => generateBookingLink()} />
      <Button type="cancel" name="Generate Caller ID" moreClass="mr-2 m-2" onClick={() => generateCaller()} />
      <Button name="Generate Portal Link" moreClass="mr-2 m-2" onClick={() => generatePortalLink()} />
    </Spin>
  );
};
export default Page;
