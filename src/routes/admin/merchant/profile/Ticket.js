import React, { useState, Fragment, useRef, useCallback, useEffect } from 'react';
import { Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'components';
import {  HookModalForm } from 'hooks';
import { useAuth } from 'globalContext';
import { ColumnTicket } from 'columns/merchant';
import { MerchantService } from 'services/merchant';
import { Button } from 'layouts/components';
import { keyUser } from 'variable';
import { useLocation, useNavigate } from 'react-router';
import { TicketService } from 'services/ticket';
import { ColumnTicket as  ColumnTicketAdd} from 'columns/ticket';
import { routerLinks } from 'utils';

const Page = ({ id, clickProduct }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatDate, permission } = useAuth();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  // const [oldData, setOldData] = useState();
  const [ticket, setTicket] = useState();

  const [detail, setDeail] = useState(null);
  const [basics, setBasics] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(state?.status && state?.status !== "-1" ? state?.status : "All");
  const currentUser = JSON.parse(localStorage.getItem(keyUser));
  const getTicket = useCallback(async () => {
    const { data } = await MerchantService.getTicket({ page: 0, row: 0, type: 'Product' }, id);
    setTicket(data);
    const basicRes = await TicketService.getBasicListRes();
    const userRes = await TicketService.getUser();
    setBasics(basicRes.data);
    setUsers(userRes.data);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    getTicket();
  }, [getTicket]);

  const handleRestoreProduct = async (id) => {
    await MerchantService.restoreProduct(id);
    dataTableRef?.current?.onChange();
  };
  const handleArchiveProduct = async (id) => {
    await MerchantService.archiveProduct(id);
    dataTableRef?.current?.onChange();
  };

  clickProduct(() => {
    setDeail(null);
    dataTableRef?.current?.onChange();
  });

  const basicList = basics && basics.map((item) => ({ label: item.businessname, value: item.merchantid }));

  const userList =
    users &&
    users.map((item) => ({
      label: item.firstName + ' ' + item.lastName,
      value: item.waUserId,
    }));

  const [handleEdit, ModalForm] = HookModalForm({
    title: (data) => (!data?.id ? 'New ticket' : 'Edit ' + data?.id),
    isLoading,
    setIsLoading,
    handleChange:() => dataTableRef?.current?.onChange(),
    columns: ColumnTicketAdd({
      t,
      formatDate,
      basicList,
      userList,
      merchantId: id
    }),
    GetById: TicketService.getById,
    Post: TicketService.createTicket,
    Put: TicketService.put,
    Delete: TicketService.delete,
    widthModal: 900,
    merchantId: id
  });

  const changeStatus = async (value) => {
    setIsLoading(true);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        status: value,
      }));
    setStatus(value);
    setIsLoading(false);
  };

  const handleReset = async () => {
    if (status === 'all') return;
    setIsLoading(true);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        status: 'all',
      }));
    setStatus('all');

    setIsLoading(false);
  };

  const dataTableRef = useRef();
  const modalFormRef = useRef();

  return (
    <>
    {ModalForm()}
      {!detail && (
        <DataTable
          ref={dataTableRef}
          save={false}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          id={() => id}
          Get={MerchantService.getTicket}
          onRow= {(data) => ({
            onClick: () => navigate(`${routerLinks('Ticket')}/${data?.id}/${id}`, { replace: true }),
          })}
          columns={ColumnTicket({
            t,
            formatDate,
            handleEdit: modalFormRef?.current?.handleEdit,
            handleDelete: modalFormRef?.current?.handleDelete,
            handleRestoreProduct,
            handleArchiveProduct,
            // setOldData,
            ticket,
          })}
          subHeader={() => (
            <div className="flex items-center mb-5">
              <div className="flex items-center">
                <h3 className="mr-2">Status: </h3>
                <Select style={{ width: '150px' }} value={status} onChange={(value) => changeStatus(value)}>
                  <Select.Option value="all">All</Select.Option>
                  <Select.Option value="backlog">Backlog</Select.Option>
                  <Select.Option value="waiting">Waiting</Select.Option>
                  <Select.Option value="complete">Complete</Select.Option>
                  <Select.Option value="inprogress">Inprogress</Select.Option>
                </Select>
              </div>
              <Button name="Reset" type="ok" moreClass="ml-5" onClick={() => handleReset()} />
            </div>
          )}
          // onRow={(...params) => ({
          //   onClick: (e) => {
          //     if (e?.target?.cellIndex) {
          //       setDeail(params[0]);
          //     }
          //   },
          // })}
          rightHeader={
            <Space>
              {!!permission && (
                <Fragment>
                  <Button
                    type={'ok'}
                    name="New Ticket"
                    onClick={() => handleEdit({ status: 'backlog', requestedBy: currentUser?.userAdmin?.waUserId })}
                  />
                </Fragment>
              )}
            </Space>
          }
        />
      )}
    </>
  );
};
export default Page;
