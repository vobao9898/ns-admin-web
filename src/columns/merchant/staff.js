import React, { Fragment } from 'react';
import { Tooltip } from 'antd';
import EditIcon from 'assets/svg/edit.js';
import ArchiveIcon from 'assets/svg/archive.js';

const Column = ({ t, handleEdit, handleArchive }) => {
  return [
    {
      title: 'Staff ID',
      name: 'staffId',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Name',
      name: 'name',
      tableItem: {
        sorter: true,
        render: (text, item) => item?.firstName + ' ' + (item?.lastName || ''),
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Display Name',
      name: 'displayName',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Phone',
      name: 'phone',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Email',
      name: 'email',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Role',
      name: 'roleName',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Status',
      name: 'isDisabled',
      tableItem: {
        sorter: true,
        render: (text) => (text === 0 ? 'Active' : 'Inactive'),
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Actions',
      tableItem: {
        width: 180,
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <Fragment>
            <Tooltip title={data?.isDisabled === 0 ? 'Archive' : 'Restore'}>
              <button
                className="embed border text-xs rounded-lg mr-2 text-red-500"
                onClick={() => handleArchive(data?.staffId, data?.isDisabled)}
              >
                <ArchiveIcon color={data?.isDisabled === 1 ? 'rgba(0,0,255,0.5)' : ''} />
              </button>
            </Tooltip>
            <Tooltip title={t('routes.admin.Layout.Edit')}>
              <button
                className="embed border border-gray-300 text-xs rounded-lg mr-2"
                onClick={() => handleEdit(data?.staffId, data)}
              >
                <EditIcon />
              </button>
            </Tooltip>
          </Fragment>
        ),
      },
    },
  ];
};
export default Column;
