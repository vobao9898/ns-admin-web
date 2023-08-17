import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { Space, Form as FormAnt, Spin, Upload } from 'antd';
import { useTranslation } from 'react-i18next';
import { linkApi, keyToken } from 'variable';

import { useAuth } from 'globalContext';
import { ColumnExtraSer, ColumnService } from 'columns/merchant';
import { MerchantService } from 'services/merchant';
import Form from 'components/form';
import { Button } from 'layouts/components';
import { Message, DataTable, Modal } from 'components';

import './index.less';

const Page = ({ id, merchant, handleChange, toggleState, clickService }) => {
  const { t } = useTranslation();
  const { formatDate, permission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [add, setAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [service, setService] = useState({ isDisabled: 0 });
  const [category, setCategory] = useState();
  const [extrasList, setExtraList] = useState([]);

  const [form] = FormAnt.useForm();
  const [formExtra] = FormAnt.useForm();

  clickService(() => {
    setAdd(false);
    setIsEdit(false);
    dataTableRef?.current?.onChange();
  });

  const getInit = useCallback(async () => {
    const category = await MerchantService.getCategory(
      { page: 0, perPage: 0, row: 0, isSubCategory: 0, isGetBrief: true, status: 0 },
      id,
      { type: 'service' },
    );
    const extrasRes = await MerchantService.getExtraByMerchantId(id);
    const values = category?.data?.filter((item) => item?.isDisabled === 0);
    setCategory(values);
    setExtraList(extrasRes);
    setIsLoading(false);
    setIsEdit(false);
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    getInit();
    setAdd(false);
  }, [getInit, toggleState]);

  const handleExport = async () => {
    setIsLoading(true);
    const res = await MerchantService.serviceExport(merchant?.merchantId);
    window.open(res);
    setIsLoading(false);
  };

  const handleArchiveRestore = async (data) => {
    if (data?.isDisabled === 1) {
      const res = await MerchantService.serviceRestore(data?.serviceId);
      if (res?.data) {
        Message.success({ text: data?.message });
        dataTableRef?.current?.onChange();
        return;
      }
      Message.error({ text: data?.message });
      return;
    }
    const res = await MerchantService.serviceArchive(data?.serviceId);
    if (res?.data) {
      Message.success({ text: data?.message });
      dataTableRef?.current?.onChange();
      return;
    }
    Message.error({ text: data?.message });
  };

  const handleDelete = async (data) => {
    const res = await MerchantService.deleteService(data?.serviceId);
    if (res?.data) {
      Message.success({ text: res?.message });
    } else Message.error({ text: res?.message });
    dataTableRef?.current?.onChange();
  };

  const reset = async () => {
    const res = await MerchantService.getExtraByMerchantId(id);
    setExtraList(res);
    handleChange();
    dataTableRef?.current?.onChange();
    setService({ isDisabled: 0 });
    setAdd(false);
    setIsEdit(false);
    setIsLoading(false);
  };

  const handleSave = async () => {
    const serviceValue = await form.validateFields();
    const extraValues = await formExtra.validateFields();
    if (service?.serviceId) {
      setIsLoading(true);
      const res = await MerchantService.editService(service, merchant, serviceValue, extraValues);
      if (res?.data) {
        Message.success({ text: res?.message });
      }
      reset();
    }
    if (!service?.serviceId) {
      setIsLoading(true);
      const res = await MerchantService.addService(service, merchant, serviceValue, extraValues);
      if (res?.data) {
        Message.success({ text: res?.message });
      }
      reset();
    }
  };

  const dataTableRef = useRef();
  const modalRef = useRef();
  const modalArchiveRef = useRef();

  const categoryOfServiceNotExistHandle = (service, category) => {
    let isExist = false;
    category &&
      category.map((item) => {
        if (item.categoryId === service.categoryId) isExist = true;
        return item;
      });

    if (isExist) {
      return service;
    }
    return {
      ...service,
      categoryId: '',
    };
  };

  return (
    <Fragment>
      <Modal
        ref={modalArchiveRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={400}
        textSubmit={'AGREE'}
        title={(data) => (data?.isDisabled === 1 ? 'Restore this Service?' : 'Archive this Service?')}
        onOk={handleArchiveRestore}
      >
        <p>
          {modalArchiveRef?.current?.data?.isDisabled === 1
            ? 'This service will appear on the app as well as the related lists.'
            : 'This service will not appear on the app. You can restore this service by clicking the Restore button.'}
        </p>
      </Modal>

      <Modal
        ref={modalRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={400}
        textSubmit={'AGREE'}
        title={() => 'Delete this Service?'}
        onOk={handleDelete}
      >
        <p className="">Do you want delete this service ?</p>
      </Modal>

      {add || isEdit ? (
        <Spin spinning={isLoading}>
          <div className="intro-x">
            <div className="flex items-center mb-4">
              {isEdit ? (
                <h3 className="font-bold text-lg text-blue-500">Edit Service</h3>
              ) : (
                <h3 className="font-bold text-lg text-blue-500">New Service</h3>
              )}
            </div>
            <div className="grid lg:grid-cols-3 grid-cols-2 gap-4">
              <div className="relative lg:col-span-2">
                <div className="mb-10">
                  <Form
                    values={categoryOfServiceNotExistHandle(service, category)}
                    columns={ColumnService({ t, formatDate, category })}
                    idSubmit={'submit-form'}
                    form={form}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button name="Save" moreClass="absolute left-0 bottom-0" onClick={handleSave} />
                  <Button
                    name="Cancel"
                    onClick={() => {
                      setAdd(false);
                      setIsEdit(false);
                      setService({});
                    }}
                    moreClass="absolute right-0 bottom-0"
                  />
                </div>
              </div>
              <div className="lg:col-span-1">
                <Form
                  values={{ extras: service?.extras || [] }}
                  form={formExtra}
                  columns={ColumnExtraSer({ extrasList, isEdit })}
                />
              </div>
            </div>
          </div>
        </Spin>
      ) : (
        <DataTable
          ref={dataTableRef}
          save={false}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          id={() => id}
          Get={MerchantService.getService}
          columns={ColumnService({
            t,
            formatDate,
            handleEdit: (data) => {
              setIsEdit(true);
              setService({ ...data, imageUrl: data?.imageUrl || undefined });
            },
            handleDelete: modalRef?.current?.handleShow,
            handleArchive: modalArchiveRef?.current?.handleShow,
          })}
          rightHeader={
            <Space>
              {!!permission && (
                <Fragment>
                  <div className="grid lg:grid-cols-3 grid-cols-2 gap-3">
                    <Button type={'ok'} name="Export" onClick={() => handleExport()} />
                    <Upload
                      style={{ width: '100%', display: 'block' }}
                      accept=".xlsx"
                      method="put"
                      name="file"
                      action={linkApi + 'Service/importByMerchant/' + merchant?.merchantId}
                      headers={{ Authorization: 'Bearer ' + localStorage.getItem(keyToken) }}
                      showUploadList={false}
                      onChange={({ file }) => {
                        if (file.response && file.response.codeNumber !== 200) {
                          const err = JSON.stringify(file.response.message);
                          Message.error({ text: err });
                        }
                        if (file.response && file.response.codeNumber === 200) {
                          dataTableRef?.current?.onChange();
                          Message.success({ text: file.response.Message });
                        }
                        setIsLoading(false);
                      }}
                    >
                      <Button type={'ok'} name="Import" onClick={() => {}} moreClass="w-full" />
                    </Upload>
                    <Button
                      type={'ok'}
                      name="New Service"
                      moreClass="lg:col-span-1 col-span-2"
                      onClick={() => {
                        setAdd(!add);
                        setService({ isDisabled: 0 });
                      }}
                    />
                  </div>
                </Fragment>
              )}
            </Space>
          }
        />
      )}
    </Fragment>
  );
};
export default Page;
