import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ColumnTicketEdit } from 'columns/ticket';
import { useTranslation } from 'react-i18next';
import { Modal, Spin, Tabs, Select } from 'antd';
import { routerLinks } from 'utils';
import { Title, Button } from 'layouts/components';
import { HookModalForm } from 'hooks';
import { TicketService } from 'services/ticket';
import { keyUser } from 'variable';

import './index.less';
import moment from 'moment';
import { Avatar } from 'components';

const TicketDetail = ({ location }) => {
  const { t } = useTranslation();
  const { id, merchantID } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState({});
  // const [status, setStatus] = useState();
  // const [requestBy, setRequestBy] = useState();
  const [comments, setComments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [comment, setComment] = useState('');
  const [isVisiable, setIsvisiable] = useState(false);
  const [users, setUsers] = useState([]);

  const initFunction = useCallback(async () => {
    const ticketRes = await TicketService.getTicketById(id);
    const commentRes = await TicketService.getComments(id);
    const logRes = await TicketService.getActivity(id);
    const userRes = await TicketService.getUser();
    setComments(commentRes?.data);
    setTicket(ticketRes?.data);
    setLogs(logRes?.data);
    setUsers(userRes.data);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    initFunction();
  }, [location, initFunction]);

  const userId = JSON.parse(window.localStorage.getItem(keyUser)).userAdmin.waUserId;

  const addComment = async () => {
    setIsLoading(true);
    if (comment !== '') {
      await TicketService.addComment(id, { comment });
      const res = await TicketService.getComments(id);
      setComments(res.data);
      setComment('');
    }
    setIsLoading(false);
  };

  const onChangeStatus = async (status) => {
    setIsLoading(true);
    await TicketService.changeStatusTable(ticket?.id, status);
    initFunction();
  };

  const onChangeRequestBy = async (userId) => {
    setIsLoading(true);
    await TicketService.editTicket(
      {
        requestedBy: userId,
        clientApp: ticket?.clientApp,
        clientName: ticket?.clientName,
        description: ticket?.description,
        status: ticket?.status,
        title: ticket?.title,
      },
      ticket?.id,
    );
    initFunction();
  };

  const bread = [
    {
      name: 'Ticket',
      path: 'Ticket',
    },
    {
      name: 'Detail',
    },
  ];

  const userList =
    users &&
    users.map((item) => {
      return {
        label: item.firstName + ' ' + item.lastName,
        value: item.waUserId,
      };
    });

  const isEdit = true;

  const [showEditTicket, ModalEditTicket] = HookModalForm({
    title: () => 'Edit Ticket',
    columns: ColumnTicketEdit({ t, userList, isEdit, ticketId: id }),
    values: ticket,
    Put: TicketService.editTicket,
    isLoading,
    setIsLoading,
    widthModal: 900,
    handleChange: () => {
      if (merchantID) {
        navigate(`${routerLinks('Merchant')}${merchantID}`, { replace: true });
      }else{
        navigate(routerLinks('Ticket'));
      }
    },
    footerCustom: (handleOk, handleCancel) => (
      <div className="flex items-center justify-end">
        <Button
          name="Cancel"
          type="cancel"
          onClick={async () => {
            setIsLoading(true);
            const { data } = await TicketService.getTicketById(id);
            setTicket(data);
            handleCancel();
            setIsLoading(false);
          }}
          moreClass="mr-5"
        />
        <Button name="Save" type="ok" onClick={() => handleOk()} />
      </div>
    ),
  });

  const deleteTicket = async () => {
    await TicketService.deleteTicket(id);
    if (merchantID) {
      navigate(`${routerLinks('Merchant')}${merchantID}`, { replace: true });
    }else{
      navigate(routerLinks('Ticket'));
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Title title="Ticket Detail" breadcrumbs={bread} />
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="mb-5 flex justify-between items-center">
          <span className="text-lg font-semibold text-black">ID : {id}</span>
          <div className="grid grid-cols-2">
            <Button name="BACK" type="cancel" onClick={() => {
               if (merchantID) {
                navigate(`${routerLinks('Merchant')}${merchantID}`, { replace: true });
              }else{
                navigate(routerLinks('Ticket'));
              }
            }} moreClass="mr-5" />
            <Button name="DELETE" onClick={() => setIsvisiable(true)} />
            <Modal
              title="Delete this Ticket?"
              visible={isVisiable}
              onCancel={() => setIsvisiable(false)}
              onOk={deleteTicket}
            >
              Do you want delete this ticket ?
            </Modal>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {/* <Form
                    columns={ColumnTicket({ t, formatDate })}
                    textSubmit={"Edit"}
                    handSubmit={() => { }}
                /> */}
          <div className="w-full text-black">
            <h2 className="text-black font-semibold text-lg mb-2">{ticket?.title}</h2>
            <div className="flex items-center py-2">
              <p className="w-2/5 font-semibold">Status:</p>
              <Select
                value={ticket?.status}
                onChange={(value) => {
                  onChangeStatus(value);
                }}
                className="min-w-[130px]"
              >
                <Select.Option value="backlog">Backlog</Select.Option>
                <Select.Option value="inprogress">In progress</Select.Option>
                <Select.Option value="waiting">Waiting</Select.Option>
                <Select.Option value="complete">Complete</Select.Option>
              </Select>
              {/* <p className="w-3/5 capitalize">{ticket?.status}</p> */}
            </div>
            <div className="flex items-center py-2 pb-5 border-b border-black/20">
              <p className="w-2/5 font-semibold">Request by:</p>
              <Select
                value={ticket?.requestedBy}
                onChange={(value) => {
                  onChangeRequestBy(value);
                }}
                className="min-w-[130px]"
              >
                {userList.map((item, index) => (
                  <Select.Option key={index} value={item?.value}>
                    {item?.label}
                  </Select.Option>
                ))}
              </Select>
              {/* <p className="w-3/5">{ticket?.requestedUserName}</p> */}
            </div>

            <div className="flex items-center py-2 mt-5">
              <p className="w-2/5 font-semibold">Description:</p>
              <p className="w-3/5">{ticket?.description}</p>
            </div>
            <div className="flex items-center py-2">
              <p className="w-2/5 font-semibold">Application:</p>
              <p className="w-3/5">{ticket?.clientApp}</p>
            </div>
            <div className="flex items-center py-2">
              <p className="w-2/5 font-semibold">Client name:</p>
              <p className="w-3/5">{ticket?.clientName}</p>
            </div>
            <div className="flex items-center py-2">
              <p className="w-2/5 font-semibold">Create by:</p>
              <p className="w-3/5">{ticket?.createdUserName}</p>
            </div>
            <div className="flex items-center py-2">
              <p className="w-2/5 font-semibold">Date create:</p>
              <p className="w-3/5">{moment(ticket?.createdDate).format('L')}</p>
            </div>
            <div className="flex items-center py-2">
              <p className="w-2/5 font-semibold">Last update:</p>
              <p className="w-3/5">{ticket?.modifiedBy !== 0 ? moment(ticket?.modifiedDate).format('L') : ''}</p>
            </div>
            <div className="flex items-center py-2">
              <p className="w-2/5 font-semibold">Modified by:</p>
              <p className="w-3/5">{ticket?.modifiedUserName}</p>
            </div>
            <div className="pt-2">
              <p className="w-2/5 mb-3 font-semibold">Attack file:</p>
              <div className="flex flex-wrap">
                {ticket &&
                  ticket?.ticketAttachFiles &&
                  ticket?.ticketAttachFiles.map((item, index) => (
                    <div className="w-32 h-32 mb-2 mr-2" key={index}>
                      <img className="w-full h-full" src={item?.fileURL} alt="attack file" />
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-full float-right">
              <Button
                name={'EDIT'}
                type="ok"
                onClick={() =>
                  showEditTicket({
                    ...ticket,
                    ticketAttachFiles: ticket?.ticketAttachFiles
                      ? ticket?.ticketAttachFiles.map((i, index) => {
                          i.thumbUrl = i?.fileURL;
                          return i;
                        })
                      : [],
                  })
                }
                moreClass="mt-5"
              />
            </div>
          </div>
          <div className="border h-[500px] border-gray-100 rounded px-2 shadow-sm border-black/20">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Comment" key="1" style={{height: "100%"}}>
                <div className="flex flex-col h-full">
                  <div className="w-full relative h-full">
                    <div className="pr-1 w-full h-4/5 overflow-y-scroll absolute top-0 flex flex-col-reverse">
                      {comments &&
                        comments?.map((item, index) => (
                          <div key={index}>
                            {item.createdBy !== userId && (
                              <div className="flex mb-5">
                                <Avatar text={item?.createdUserName} showName={false} />
                                <div className="ml-5">
                                  <p className="pb-1">
                                    <span className="font-semibold mr-3">{item?.createdUserName}</span>
                                    <span className="text-xs">
                                      {moment(item?.createdDate).format('MM/DD/YY hh:mm:ss A')}
                                    </span>
                                  </p>
                                  <p className="min-w-[140px] p-2 border rounded">{item?.comment}</p>
                                </div>
                              </div>
                            )}

                            {item.createdBy === userId && (
                              <div className="flex flex-col">
                                <p className="text-xs ml-auto mb-1">
                                  {moment(item.createdDate).format('MM/DD/YYYY hh:mm:ss A')}
                                </p>
                                <p className="w-fit ml-auto p-2 mb-5 text-white bg-blue-800 rounded-b-lg rounded-tr-lg">
                                  {item.comment}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    <div className="absolute bottom-0 w-full">
                      <textarea
                        placeholder="Type a comment..."
                        className="ant-input px-4 py-3 w-full rounded-xl text-gray-600 bg-white border border-solid"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button className="absolute right-2 top-2 bottom-2" onClick={addComment}>
                        <i className="las la-paper-plane la-2x" />
                      </button>
                    </div>
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Log" key="2">
                <div className="h-[400px] overflow-y-scroll">
                  <div className="flex flex-col-reverse">
                    {logs &&
                      logs?.map((item, index) => (
                        <div key={index} className="grid grid-cols-3 gap-5 mb-3 border-b-2 border-gray-100">
                          <div className="col-span-1">
                            <div className="font-bold">{moment(item.createdDate).format('MM/DD/YYYY')}</div>
                            <div>{moment(item.createdDate).format('hh:mm:ss A')}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="font-bold">{item.createdUserName}</div>
                            <div>{item.description}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      {ModalEditTicket()}
    </Spin>
  );
};
export default TicketDetail;
