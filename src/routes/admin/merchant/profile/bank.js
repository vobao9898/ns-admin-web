import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'globalContext';
import { ColumnBank } from 'columns/merchant';
import { Form } from 'components';
import './index.less';
import { Button } from 'layouts/components';
import { Form as FormAnt, Spin } from 'antd';
import { MerchantService } from 'services/merchant';
import { ReactComponent as PdfIcon } from 'assets/images/pdf-icon.svg';

const Page = ({ bank, merchantId, handleChange, clickBank }) => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = FormAnt.useForm();

  clickBank(() => {
    setEdit(false);
  });

  const editHandle = async () => {
    const newBank = await form.validateFields();
    setIsLoading(true);
    await MerchantService.editBusinessBank(newBank, bank, merchantId);
    handleChange();
    setEdit(false);
    setIsLoading(false);
  };

  const isPdfFile = (fileName) => {
    if (!fileName) return false;
    const extension = fileName.split('.').pop();
    if (extension === 'pdf') return true;
    return false;
  };

  const renderPdf = (url) => {
    return (
      <div className="relative flex flex-col p-2 rounded-md border border-gray-300 w-[120px] h-[120px]">
        <div className="flex items-center justify-center flex-grow w-full">
          <PdfIcon
            className="cursor-pointer"
            onClick={() => {
              window.open(url, '_blank');
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <Spin spinning={isLoading}>
      <div className="intro-x">
        <div className="font-bold text-lg mb-4 text-blue-500">Bank Information</div>
        {!edit ? (
          <div className="grid grid-cols-12 gap-6 mb-4 intro-x">
            <div className="sm:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Account Holder Name</div>
              <div className="text-sm">{bank?.accountHolderName}</div>
            </div>
            <div className="sm:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Bank Name</div>
              <div className="text-sm">{bank?.name}</div>
            </div>
            <div className="sm:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Routing Number</div>
              <div className="text-sm">{bank?.routingNumber}</div>
            </div>
            <div className="sm:col-span-12 col-span-12">
              <div className="text-sm font-semibold mb-2">Account Number</div>
              <div className="text-sm">{bank?.accountNumber}</div>
            </div>
            <div className="sm:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Void Check</div>
              <div className="text-sm">
                {isPdfFile(bank?.imageUrl) ? renderPdf(bank?.imageUrl) : <img src={bank?.imageUrl} alt="" />}
              </div>
            </div>
          </div>
        ) : (
          <div className="intro-x">
            <Form
              columns={ColumnBank({ t, formatDate })}
              form={form}
              values={bank}
              idSubmit={'submit-form-bank'}
              extendButton={() => (
                <div className="w-full flex justify-start">
                  <Button
                    onClick={() => {
                      setEdit(!edit);
                    }}
                    name={'Cancel'}
                    moreClass="mr-2"
                  />
                  <Button name="Save" type="ok" onClick={() => editHandle()} moreClass="ml-5" />
                </div>
              )}
            />
          </div>
        )}
        {!edit && (
          <Button
            type="ok"
            onClick={() => {
              setEdit(!edit);
            }}
            name={'Edit'}
          />
        )}
      </div>
    </Spin>
  );
};
export default Page;
