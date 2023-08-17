import React, { useState, Fragment, useRef } from 'react';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'globalContext';
import { ColumnGiftCard, ColumnGiftCardGeneral } from 'columns/merchant';
import { MerchantService } from 'services/merchant';
import { Button } from 'layouts/components';
import moment from 'moment';
import { DataTable, ModalForm, Modal } from 'components';

const Page = ({ id }) => {
  const { t } = useTranslation();
  const { formatDate, permission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [, setOldData] = useState();
  const [detailMode, setDetailMode] = useState(false);
  const [merchant, setMerchant] = useState([]);
  const [data, set_data] = useState([]);
  let [giftCard, setGiftCard] = useState({});

  const handleExport = async (GiftCardId) => {
    const { data } = await MerchantService.getExportGiftCard(GiftCardId);
    const link = document.createElement('a');
    link.href = data?.path;
    link.target = '_blank';
    link.download = 'Export_My_Overtime.xlsx';
    link.click();
  };

  const dataTableRef = useRef();
  const dataTableGeneralRef = useRef();
  const modalFormRef = useRef();
  const modalRef = useRef();

  return (
    <Fragment>
      <Modal
        ref={modalRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        footerCustom={null}
        title={() => 'Logs for ' + data?.title}
      >
        <div className="border-solid border-2 p-5 shadow-md rounded-lg">
          <div className="grid grid-cols-3 gap-4 border-solid">
            <div className="...">
              <strong>Time</strong>
            </div>
            <div className="...">
              <strong>Date</strong>
            </div>
            <div className="...">
              <strong>Details</strong>
            </div>
          </div>
          {data.data &&
            data.data.map((item, index) => {
              const utcDate = new Date(item?.createdDate);
              return (
                <div key={index} className="grid grid-cols-3 gap-4 border-solid">
                  <div className="...">{moment(utcDate).format('hh:mm A')}</div>
                  <div className="...">{moment(item?.createdDate).format('MM/DD/YYYY')}</div>
                  <div className="...">{item?.message}</div>
                </div>
              );
            })}
        </div>
      </Modal>
      <ModalForm
        ref={modalFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        textSubmit={'Generate'}
        widthModal={600}
        Post={MerchantService.postGiftCard}
        title={(data) => (!data?.id ? 'Add' : 'Edit')}
        parentID={() => ({ merchantId: id })}
        handleChange={() => {
          setDetailMode(false);
          dataTableRef?.current?.onChange();
        }}
        columns={ColumnGiftCard({ t, formatDate })}
      />
      {!detailMode ? (
        <DataTable
          ref={dataTableRef}
          save={false}
          xScroll={'100%'}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          id={() => id}
          idElement={'giftcard'}
          pageSize={'row'}
          fullTextSearch={'keySearch'}
          Get={MerchantService.getGiftCard}
          columns={ColumnGiftCard({
            t,
            formatDate,
            handleExport,
            setOldData,
            setDetailMode,
          })}
          onRow={(record) => ({
            onClick: async () => {
              setIsLoading(true);
              setGiftCard(record);
              giftCard = record;
              const data = await MerchantService.getGiftCardByGeneral({}, giftCard?.giftCardGeneralId);
              setMerchant(data?.summary?.merchantNames);
              setDetailMode(true);
              setIsLoading(false);
            },
          })}
          rightHeader={
            <Space>
              {!!permission && (
                <Fragment>
                  <Button
                    type="ok"
                    name="Generate Code"
                    onClick={() => {
                      modalFormRef?.current?.handleEdit({ amount: '0.00' });
                    }}
                  />
                </Fragment>
              )}
            </Space>
          }
        />
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <strong className="text-lg mb-5">{giftCard?.name}</strong>
            <div className="justify-self-end">
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
          <div>
            <div>
              <div className="p-5 rounded-lg bg-gray-50	mt-2">
                <div className="flex items-center py-2">
                  <p className="w-3/5">Gift Card Label</p>
                  <p className="w-2/5">
                    <strong>{giftCard?.name}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Qty</p>
                  <p className="w-2/5">
                    <strong>{giftCard?.quantity}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Value</p>
                  <p className="w-2/5">
                    <strong>{giftCard?.amount}</strong>
                  </p>
                </div>
                <div className="flex items-center py-2">
                  <p className="w-3/5">Merchants can be apply</p>
                  <p className="w-2/5">
                    <strong>
                      {merchant &&
                        merchant.map((i, index) => {
                          let value;
                          if (index === merchant?.length - 1) value = i;
                          else value = i + ',  ';
                          return value;
                        })}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {
            <DataTable
              ref={dataTableGeneralRef}
              save={false}
              xScroll={'100%'}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              id={() => giftCard?.giftCardGeneralId}
              idElement={'giftcard-detail'}
              pageSize={'row'}
              fullTextSearch={'keySearch'}
              Get={MerchantService.getGiftCardByGeneral}
              columns={ColumnGiftCardGeneral({
                t,
                formatDate,
                setOldData,
                handleModalInfo: (data) => {
                  set_data(data);
                  modalRef?.current?.handleShow();
                },
              })}
              rightHeader={
                <Space>
                  {!!permission && (
                    <Fragment>
                      <Button
                        type="ok"
                        name="Export"
                        onClick={() => {
                          handleExport(giftCard?.giftCardGeneralId);
                        }}
                      />
                    </Fragment>
                  )}
                </Space>
              }
            ></DataTable>
          }
        </div>
      )}
    </Fragment>
  );
};
export default Page;
