import React, { useState, Fragment, useRef } from 'react';
import { Space, Upload } from 'antd';
import { useTranslation } from 'react-i18next';

import { useAuth } from 'globalContext';
import { ColumnExtra } from 'columns/merchant';
import { MerchantService } from 'services/merchant';
import { Button } from 'layouts/components';
import { Message, DataTable, ModalForm } from 'components';
import { linkApi, keyToken } from 'variable';

const Page = ({ id, clickExtra }) => {
  const { t } = useTranslation();
  const { formatDate, permission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [oldData, setOldData] = useState();

  clickExtra(() => {
    dataTableRef?.current?.onChange();
  });

  const handleRestore = async (id) => {
    await MerchantService.restoreExtra(id);
    dataTableRef?.current?.onChange();
  };
  const handleArchive = async (id) => {
    await MerchantService.archiveExtra(id);
    dataTableRef?.current?.onChange();
  };

  const handleExport = async () => {
    const { data } = await MerchantService.getExportExtra(id);
    const link = document.createElement('a');
    link.href = data;
    link.target = '_blank';
    link.download = 'Export_My_Overtime.xlsx';
    link.click();
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
        title={() => 'Edit'}
        GetById={MerchantService.getExtraById}
        Put={MerchantService.putExtra}
        Delete={MerchantService.deleteExtra}
        parentID={() => ({
          merchantId: id,
          fileId: oldData?.fileId,
        })}
        handleChange={async () => await dataTableRef?.current?.onChange()}
        columns={ColumnExtra({ t, formatDate })}
      />
      <DataTable
        ref={dataTableRef}
        save={false}
        xScroll={'100%'}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        id={() => id}
        Get={MerchantService.getExtra}
        columns={ColumnExtra({
          t,
          formatDate,
          handleEdit: modalFormRef?.current?.handleEdit,
          handleDelete: modalFormRef?.current?.handleDelete,
          handleArchive,
          handleRestore,
          setOldData,
        })}
        rightHeader={
          <Space>
            {!!permission && (
              <Fragment>
                <div className="grid lg:grid-cols-2 grid-cols-2 gap-2">
                  <Button type={'ok'} onClick={handleExport} name="Export" />
                  <Upload
                    className="w-full"
                    showUploadList={false}
                    method={'put'}
                    name={'file'}
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    action={linkApi + 'Extra/import/' + id}
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
                      }
                      if (file.response && file.response.codeNumber === 200) {
                        dataTableRef?.current?.onChange();
                        Message.success({ text: file.response.Message });
                      }
                      setIsLoading(false);
                    }}
                  >
                    <Button moreClass="w-full" type={'ok'} name="Import"  onClick={() => {}}/>
                  </Upload>
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
