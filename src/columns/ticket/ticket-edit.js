import React from 'react';
import moment from 'moment';
import axios from 'axios';
import { Message } from 'components';

const Column = ({ t, formatDate, listGender, handleEdit, handleDelete, basicList, userList, isEdit, ticketId }) => {
  return [
    {
      title: 'ID',
      name: 'id',
      tableItem: {
        width: 50,
        // sorter: true,
      },
    },
    {
      title: 'Title',
      name: 'title',
      tableItem: {
        width: 400,
        // sorter: true,
      },
      formItem: {
        rules: [{ type: 'required', readOnly: true }],
        col: 4,
      },
    },
    {
      title: 'Application',
      name: 'clientApp',
      tableItem: {
        width: 400,
        // sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'Client Name',
      name: 'clientName',
      tableItem: {
        width: 400,
        // sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'Create By',
      name: 'createdUserName',
      tableItem: {
        width: 200,
        // sorter: true,
      },
    },
    {
      title: 'Last Updated',
      name: 'modifiedDate',
      tableItem: {
        width: 200,
        // sorter: true,
        render: (text, item) => (item?.modifiedBy !== 0 ? moment(text).format('L') : ''),
      },
    },
    {
      title: 'Modified By',
      name: 'modifiedUserName',
      tableItem: {
        width: 200,
        // sorter: true,
      },
    },
    {
      title: 'Status',
      name: 'status',
      tableItem: {
        width: 200,
        // sorter: true,
        render: (text) => {
          let backgroundColor;
          switch (text) {
            case 'backlog':
              backgroundColor = 'bg-gray-400';
              break;
            case 'waiting':
              backgroundColor = 'bg-sky-800';
              break;
            case 'inprogress':
              backgroundColor = 'bg-sky-400';
              break;
            case 'complete':
              backgroundColor = 'bg-green-700';
              break;

            default:
              backgroundColor = 'bg-gray-400';
              break;
          }

          const css = 'capitalize px-2 py-1 rounded-full	text-white text-center w-full ' + backgroundColor;
          return <div className={css}>{text}</div>;
        },
      },
      formItem: {
        type: 'select',
        list: [
          { label: 'Backlog', value: 'backlog' },
          { label: 'In Progress', value: 'inprogress' },
          { label: 'Waiting', value: 'waiting' },
          { label: 'Complete', value: 'complete' },
        ],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Request by',
      name: 'requestedBy',
      formItem: {
        type: 'select',
        list: userList,
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Merchant Request',
      name: 'merchantId',
      formItem: {
        type: isEdit ? 'hidden' : 'select',
        list: basicList,
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Description',
      name: 'description',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'textarea',
      },
    },
    {
      title: 'Attachment file',
      name: 'file',
      formItem: {
        type: 'upload',
        showBtnDownload: () => false,
        viewGrid: true,
        action: async (file, onUploadProgress) => {
          const bodyFormData = new FormData();
          bodyFormData.append('file', file);
          const { data } = await axios({
            method: 'post',
            url: '/File',
            data: bodyFormData,
            onUploadProgress,
          });
          if (data?.codeStatus === 1) {
            const value = {
              fileId: data?.data?.fileId,
              id: ticketId,
            };
            const res = await axios.post('/Ticket/' + ticketId + '/fileAttach', value);
            if (res?.data?.codeStatus === 1) {
              Message.success({ text: res?.data?.message });
              return { data: { id: res?.data.data } };
            } else Message.error({ text: res?.data?.message });
            return false;
          }
          return data;
        },
        deleteFile: async (id) => {
          const value = {
            id,
          };
          const { data } = await axios('/Ticket/' + ticketId + '/fileAttach', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            data: JSON.stringify(value),
          });
          return data?.data;
        },
      },
    },
    {
      title: '',
      formItem: {
        col: 12,
        render: () => (
          <div className="mt-5">
            <p className="font-semibold">
              Khi có vấn đề về Web admin vui lòng thực hiện 2 thao tác bên dưới, nếu vẫn bị vấn đề thì report qua ticket
              giúp Levinci team
            </p>
            <p className="font-semibold mt-2">A. Clean cache browser</p>
            <p>1. Nhấn Ctrl + Shift + R</p>
            <p>2. Kiểm tra lại issue</p>
            <p className="font-semibold mt-2">B. Sử dụng Tab ẩn danh</p>
            <p>1. Nhấn : Ctrl + Shift + N .</p>
            <p>2. Đăng nhập lại</p>
            <p>3. Kiểm tra lại issue</p>
          </div>
        ),
      },
    },
  ];
};
export default Column;
