import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAuth } from 'globalContext';
import { HookDataTable, HookModalForm } from 'hooks';
import { ColumnTicket } from 'columns/ticket';
import { TicketService } from 'services/ticket';
import Trello from 'components/trello';
import { routerLinks } from 'utils';
import { Title, Button } from 'layouts/components';

import './index.less';
import { Radio } from 'antd';
import { keyUser } from 'variable';

const Page = () => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [basics, setBasics] = useState([]);
  const [users, setUsers] = useState([]);
  let [status, changeStatus] = useState('all');

  const [showTable, setShowTable] = useState(() => {
    return JSON.parse(localStorage.getItem('showTable'));
  });
  const navigate = useNavigate();

  const initFunction = useCallback(async () => {
    const basicRes = await TicketService.getBasicListRes();
    const userRes = await TicketService.getUser();
    setBasics(basicRes.data);
    setUsers(userRes.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    initFunction();
  }, [initFunction]);

  useEffect(() => {
    handleChange();
  }, [showTable]);

  const currentUser = JSON.parse(localStorage.getItem(keyUser));

  const basicList = basics && basics.map((item) => ({ label: item.businessname, value: item.merchantid }));

  const userList =
    users &&
    users.map((item) => ({
      label: item.firstName + ' ' + item.lastName,
      value: item.waUserId,
    }));

  const [handleEdit, ModalForm, handleDelete] = HookModalForm({
    title: (data) => (!data?.id ? 'New ticket' : 'Edit ' + data?.id),
    isLoading,
    setIsLoading,
    handleChange: async () => await handleChange(),
    columns: ColumnTicket({
      t,
      formatDate,
      basicList,
      userList,
    }),
    GetById: TicketService.getById,
    Post: TicketService.createTicket,
    Put: TicketService.put,
    Delete: TicketService.delete,
    widthModal: 900,
  });

  const leftHeader = (
    <div className="mb-2 mt-1 flex items-center">
      <p className="mr-5 text-black font-medium">Status</p>
      <Radio.Group
        value={status}
        buttonStyle="solid"
        onChange={(e) => {
          changeStatus(e.target.value);
          status = e.target.value;
          handleChange();
        }}
        className="mr-5"
      >
        <Radio.Button value="all">All Status</Radio.Button>
        <Radio.Button value="backlog">Backlog</Radio.Button>
        <Radio.Button value="inprogress">In Progress</Radio.Button>
        <Radio.Button value="waiting">Waiting</Radio.Button>
        <Radio.Button value="complete">Complete</Radio.Button>
      </Radio.Group>
      <Button
        name="Reset"
        type="ok"
        onClick={() => {
          changeStatus('all');
          status = 'all';
          handleChange();
        }}
      />
    </div>
  );

  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onClick: () => navigate(`${routerLinks('Ticket')}/${data?.id}`, { replace: true }),
    }),
    isLoading,
    setIsLoading,
    id: () => status,
    Get: TicketService.getTicketsTable,
    leftHeader,
    searchPlaceholder: 'Search by ID, Title, Application, Client name',
    columns: ColumnTicket({
      t,
      formatDate,
      handleEdit,
      handleDelete,
    }),
  });

  const bread = [
    {
      name: 'Ticket',
    },
  ];

  return (
    <>
      {/* <Spin spinning={isLoading} className="mb-10"> */}
      <Title title="Ticket" breadcrumbs={bread} />
      <div className="p-4 shadow rounded-2xl bg-gray-50">
        <div className="flex justify-end mb-2">
          <div className="flex">
            <Button
              name={showTable ? <div>Column View</div> : <div>Table View</div>}
              type="ok"
              moreClass="mr-5"
              onClick={() => {
                setShowTable(!showTable);
                localStorage.setItem('showTable', !showTable);
              }}
            />

            <Button
              name={
                <>
                  <i className="las la-plus mr-1" />
                  <span>Add Ticket</span>
                </>
              }
              onClick={() => handleEdit({ status: 'backlog', requestedBy: currentUser?.userAdmin?.waUserId })}
              type="ok"
            />
          </div>
        </div>
        {showTable ? (
          DataTable()
        ) : (
          <Trello
            isMoveColumn={false}
            widthCard={340}
            renderItem={(item, subItem, subIndex) => (
              <div
                className="p-2 mb-2 bg-white rounded"
                key={item.id + subIndex}
                onClick={() => navigate(`${routerLinks('Ticket')}/${subItem?.id}`)}
              >
                <h4 className="font-semibold text-base">{subItem.title}</h4>
                <p className="my-1 text-xs">{`"${subItem.description}"`}</p>
                <hr />
                <div className={'inline-block w-full'}>
                  <p className={'text-xs float-left'}>
                    Requested by: <span className="text-black font-semibold">{subItem.requestedUserName}</span>
                  </p>
                  <p className={'text-xs float-right'}>ID: {subItem.id}</p>
                </div>
              </div>
            )}
            Get={TicketService.getTickets}
            Put={TicketService.changeStatus}
          />
        )}
      </div>
      {ModalForm()}
      {/* </Spin> */}
    </>
  );
};
export default Page;
