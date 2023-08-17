import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { useAuth } from 'globalContext';
import { DataTable, ModalForm, ModalDrag } from 'components';
import { ColumnUser } from 'columns/user';
import { UserService } from 'services/user';
const Page = () => {
  const { t } = useTranslation();
  // changePermission permission
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [listGender, set_listGender] = useState([]);
  const { pathname } = useLocation();

  const initFunction = useCallback(async () => {
    set_listGender([
      {
        value: 'Male',
        label: 'Male',
      },
      {
        value: 'Female',
        label: 'Female',
      },
    ]);
  }, []);

  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  const dataTableRef = useRef();
  const modalFormRef = useRef();
  const modalDragRef = useRef();
  return (
    <Fragment>
      <DataTable
        ref={dataTableRef}
        onRow={(data) => ({
          onDoubleClick: (event) => {},
        })}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        pageSizeRender={(sizePage) => sizePage}
        pageSizeWidth={'50px'}
        paginationDescription={(from, to, total) => 'Hiển thị ' + from + '-' + to + ' / Tổng số ' + total + ' danh mục'}
        Get={UserService.get}
        columns={ColumnUser({
          t,
          formatDate,
          handleEdit: modalFormRef?.current?.handleEdit,
          handleDelete: modalFormRef?.current?.handleDelete,
        })}
        rightHeader={
          <Fragment>
            <button
              className="bg-blue-500 text-white px-4 py-2.5 rounded-xl hover:bg-blue-400 inline-flex items-center mr-2"
              onClick={() => modalDragRef?.current?.handleShow()}
            >
              <i className="las la-plus mr-1" />
              {t('Vai trò')}
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2.5 rounded-xl hover:bg-blue-400 inline-flex items-center"
              onClick={() => modalFormRef?.current?.handleEdit()}
            >
              <i className="las la-plus mr-1" />
              {t('Tạo mới')}
            </button>
          </Fragment>
        }
      />
      <ModalForm
        ref={modalFormRef}
        title={(data) => (!data?.id ? t('Tạo mới người dùng') : t('Chỉnh sửa người dùng'))}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        handleChange={async () => await dataTableRef?.current?.onChange()}
        columns={ColumnUser({
          t,
          formatDate,
          listGender,
        })}
        GetById={UserService.getById}
        Post={UserService.post}
        Put={UserService.put}
        Delete={UserService.delete}
        widthModal={600}
        idElement={'user'}
      />
      <ModalDrag
        ref={modalDragRef}
        title={() => t('Vai trò')}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        columns={ColumnUser({ t })}
        Get={() => [
          {
            id: '1',
            name: 'Biên tập viên',
          },
          {
            id: '2',
            name: 'Người dùng',
          },
          {
            id: '3',
            name: 'Quản trị viên',
          },
          {
            id: '4',
            name: 'Thanh tra',
          },
          {
            id: '5',
            name: 'Trưởng phòng',
          },
        ]}
        Put={UserService.put}
        Post={UserService.post}
        Delete={UserService.delete}
        GetById={UserService.getById}
        widthForm={1200}
        isReloadLoadToSave={true}
        idElement={'role'}
      />
    </Fragment>
  );
};
export default Page;
