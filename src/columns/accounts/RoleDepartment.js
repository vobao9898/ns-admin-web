import React, { Fragment } from 'react';
import { Tooltip, Popconfirm, Dropdown, Menu } from 'antd';
import EditIcon from 'assets/svg/edit.js';
import RestoreIcon from 'assets/svg/restore.js';
import ArchiveIcon from 'assets/svg/archive.js';
import { Avatar } from 'components';

const showMember = (text, item) => {
  if (text.length > 5) {
    const menu = (
      <Menu style={{ overflowY: 'scroll', maxHeight: '250px', padding: '20px' }}>
        {text.map((item, index) =>{
          if(index>4){
            return <Menu.Item key={item?.waUserId}>
            <div className="col-span-6 flex">
              <img className="rounded-full object-cover object-center h-8 w-8" src={item?.imageUrl}></img>
              <div className="ml-2 text-lg flex items-center">{`${item?.firstName} ${item?.lastName}`}</div>
            </div>
          </Menu.Item>
          }else{
            return null
          }
        })}
      </Menu>
    );
    return (
      <div className="flex min-w-[28px] min-h-[28px] justify-center" style={{ cursor: 'pointer' }}>
        <Dropdown overlay={menu} style={{ height: '200px', padding: '10px 0' }}>
          <div className="flex items-center" style={{ fontSize: '18px', color: '#3b82f6' }}>{`+${
            text.length - 5
          }`}</div>
        </Dropdown>
      </div>
    );
  } else {
    return null;
  }
};

const showMembers = (text, item) => {
  if (text && text.length) {
    return text.map((items, index) => {
      if (index < 5) {
        return (
          <div key={items.waUserId} className="p-1 flex min-w-[28px] min-h-[28px] justify-center">
            <Avatar src={items.imageUrl} showName={false} />
          </div>
        );
      } else {
        return null;
      }
    });
  } else {
    return null;
  }
};

const Column = ({ t, handleEdit, merchantId, handleRestoreDepartment, handleArchiveDepartment, setOldData }) => {
  return [
    {
      title: 'Department name',
      name: 'departmentName',
      tableItem: {},
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Members',
      name: 'members',
      tableItem: {
        col: 6,
        render: (text, item) => (
          <div className="flex flex-wrap">
            {showMembers(text, item)}
            {showMember(text, item)}
          </div>
        ),
      },
    },
    {
      title: 'No. of members',
      name: 'noOfMembers',
      tableItem: {},
    },

    {
      title: 'Status',
      name: 'isDisabled',
      tableItem: {
        render: (text, item) => (item?.isDisabled ? 'Inactive' : 'Active'),
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
            {data?.isDisabled ? (
              <Tooltip title={t('Restore')}>
                <Popconfirm
                  placement="left"
                  title={
                    <div>
                      <strong>Restore this Department?</strong>
                      <div>This Department will appear on the app as well as the related lists.</div>
                    </div>
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handleRestoreDepartment(data?.departmentId)}
                  okText={t('components.datatable.ok')}
                  cancelText={t('components.datatable.cancel')}
                >
                  <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                    <RestoreIcon />
                  </button>
                </Popconfirm>
              </Tooltip>
            ) : null}
            {!data?.isDisabled ? (
              <Tooltip title={t('Archive')}>
                <Popconfirm
                  placement="left"
                  title={
                    <div>
                      <strong>Archive this Department?</strong>
                      <div>
                        This Department will not appear on the app. You can restore this product by clicking the Restore
                        button.
                      </div>
                    </div>
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handleArchiveDepartment(data?.departmentId)}
                  okText={t('components.datatable.ok')}
                  cancelText={t('components.datatable.cancel')}
                >
                  <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                    <ArchiveIcon />
                  </button>
                </Popconfirm>
              </Tooltip>
            ) : null}
            <Tooltip title={t('routes.admin.Layout.Edit')}>
              <button
                className="embed border border-gray-300 text-xs rounded-lg mr-2"
                onClick={(e) => {
                  handleEdit(data);
                }}
              >
                <EditIcon />
              </button>
            </Tooltip>
            {/* <Tooltip title={t('routes.admin.Layout.Delete')}>
              <Popconfirm
                placement="left"
                title={t('components.datatable.areYouSureWant')}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                onConfirm={() => handleDelete(data.id)}
                okText={t('components.datatable.ok')}
                cancelText={t('components.datatable.cancel')}
              >
                <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                  <RemoveIcon />
                </button>
              </Popconfirm>
            </Tooltip> */}
          </Fragment>
        ),
      },
    },
  ];
};
export default Column;
