import React, { useState, Fragment, useRef, useEffect, useCallback } from 'react';
import { Modal, Space, Upload } from 'antd';
import { useTranslation } from 'react-i18next';

import { useAuth } from 'globalContext';
import { ColumnCategory } from 'columns/merchant';
import { MerchantService } from 'services/merchant';
import { Button } from 'layouts/components';
import { linkApi, keyToken } from 'variable';
import { Message, DataTable, ModalForm } from 'components';
import Check from 'assets/images/check.png';
import close_black from 'assets/images/close_black.png';

const Page = ({ id }) => {
  const { t } = useTranslation();
  const { formatDate, permission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [oldData, setOldData] = useState();
  const [isWarHouse, setIsWarHouse] = useState(true);
  const [isRetailer, setIsRetailer] = useState(true);
  const [dataIsSubCategory, setDataIsSubCategory] = useState([]);
  const [isExport, setIsExport] = useState(false);
  const [isExports, setIsExports] = useState(false);
  const [linkExport, setLinkExport] = useState(null);
  const [linkExports, setLinkExports] = useState(null);

  const changeTable = useCallback(async (id) => {
    setIsLoading(false);
    const dataCategory = await MerchantService.getCategory(
      { page: 0, perPage: 0, isSubCategory: 0, isGetBrief: true, status: 0 },
      id,
    );
    const dataI = await dataCategory?.data?.map((item) => {
      return {
        value: item?.categoryId,
        label: item?.name,
      };
    });
    await setDataIsSubCategory(dataI);
  }, []);

  const loadMerchant = async (id) => {
    if (id) {
      await setIsLoading(true);
      const res = await MerchantService.getMerchantById(id);
      if (res?.data?.type === 'Retailer') {
        if (res?.data?.isWareHouse) {
          setIsWarHouse(true);
          setIsRetailer(false);
        } else {
          setIsWarHouse(false);
          setIsRetailer(true);
        }
      } else {
        setIsWarHouse(false);
        setIsRetailer(false);
      }
      await setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMerchant(id);
    changeTable(id);
  }, [id]);

  const handleRestoreCategory = async (id) => {
    await MerchantService.restoreCategory(id);
    dataTableRef?.current?.onChange();
  };
  const handleArchiveCategory = async (id) => {
    await MerchantService.archiveCategory(id);
    dataTableRef?.current?.onChange();
  };

  const handleExport = async () => {
    const { data } = await MerchantService.getExportCategory(id);
    if (data) {
      setIsExports(true);
      setLinkExports(data);
    }
  };

  const dataTableRef = useRef();
  const modalFormRef = useRef();

  return (
    <Fragment>
      <ModalForm
        ref={modalFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={600}
        parentID={() => ({
          categoryId: oldData?.categoryId,
          merchantId: id,
        })}
        title={(data) => (!data?.id ? 'Add' : 'Edit')}
        handleChange={() => dataTableRef?.current?.onChange()}
        columns={ColumnCategory({ t, formatDate, isWarHouse, isRetailer, dataIsSubCategory })}
        GetById={MerchantService.getById}
        Post={MerchantService.postCategory}
        Put={MerchantService.putCategory}
        Delete={MerchantService.deleteCategory}
        dataIsSubCategory={dataIsSubCategory}
        isColumn={true}
        isWarHouse={isWarHouse}
        isRetailer={isRetailer}
      />
      <Modal
        open={isExports}
        onCancel={() => setIsExports(false)}
        footer={null}
        width={700}
        title={<div className="text-[20px] text-[#363636] font-semibold">Click below link to download</div>}
      >
        <div className="modalExport">
          <img src={Check} alt="img" />
          {linkExports && linkExports !== '' && <a href={linkExports}>Download link</a>}
        </div>
      </Modal>
      <Modal
        onCancel={() => setIsExport(false)}
        footer={null}
        width={700}
        title={<div className="text-[20px] text-[#363636] font-semibold">Click below link to download error file</div>}
        open={isExport}
      >
        <div className="modalExport">
          <img src={close_black} alt="img" />
          {linkExport && linkExport !== '' && <a href={linkExport}>Download link</a>}
        </div>
      </Modal>
      <DataTable
        ref={dataTableRef}
        save={false}
        xScroll={'100%'}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        id={() => id}
        Get={MerchantService.getCategory}
        columns={ColumnCategory({
          t,
          formatDate,
          handleEdit: modalFormRef?.current?.handleEdit,
          handleDelete: modalFormRef?.current?.handleDelete,
          setOldData,
          handleRestoreCategory,
          handleArchiveCategory,
          isRetailer,
          isWarHouse,
          isTable: true,
        })}
        rightHeader={
          <Space>
            {!!permission && !isRetailer && (
              <Fragment>
                <div className="grid lg:grid-cols-3 grid-cols-2 gap-3">
                  <Button type={'ok'} onClick={handleExport} name="Export" />
                  <Upload
                    className="w-full"
                    showUploadList={false}
                    method={'put'}
                    name={'file'}
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    action={linkApi + 'Category/import/' + id}
                    headers={{ Authorization: 'Bearer ' + localStorage.getItem(keyToken) }}
                    beforeUpload={(file) => {
                      let isExcel = false;
                      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                        // if( file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'text/csv')
                        isExcel = true;
                      if (!isExcel) {
                        Message.error({ text: `File type is not supported! Please choose another file.` });
                      }
                      return isExcel || Upload.LIST_IGNORE;
                    }}
                    onChange={({ file }) => {
                      if (file.response && file.response.codeNumber !== 200) {
                        const err = JSON.stringify(file.response.message);
                        Message.error({ text: err });
                        if (file?.response?.data?.path) {
                          setLinkExport(file?.response?.data?.path);
                          setIsExport(true);
                        }
                      }
                      if (file.response && file.response.codeNumber === 200) {
                        dataTableRef?.current?.onChange();

                        if (file?.response?.data?.path) {
                          setLinkExport(file?.response?.data?.path);
                          setIsExport(true);
                        } else {
                          Message.success({ text: file.response.Message });
                        }
                      }
                      setIsLoading(false);
                    }}
                  >
                    <Button moreClass="w-full" type={'ok'} name="Import" onClick={() => {}} />
                  </Upload>
                  <Button
                    type={'ok'}
                    onClick={() => {
                      modalFormRef?.current?.handleEdit();
                    }}
                    moreClass="lg:col-span-1 col-span-2"
                    name="New Category"
                  />
                </div>
              </Fragment>
            )}
          </Space>
        }
      />
    </Fragment>
  );
};
export default Page;
