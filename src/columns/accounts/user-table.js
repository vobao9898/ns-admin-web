import React from 'react';
import { Avatar } from 'components';

const ColumnUserTable = () => {
  return [
    {
      title: 'ID',
      name: 'waUserId',
      tableItem: {},
    },
    {
      title: '',
      name: 'imageUrl',
      tableItem: {
        width: 60,
        render: (text, item) => {
          if (item?.fileId !== 2214) {
            return (
              <div className="flex min-w-[28px] min-h-[28px] justify-center">
                <Avatar src={text} text={item.fullName} showName={false} />
              </div>
            );
          }
        },
      },
    },
    {
      title: 'Full name',
      name: 'fullName',
      tableItem: {
        render: (text, item) => item?.firstName + ' ' + item?.lastName,
      },
    },
    {
      title: 'Email',
      name: 'email',
      tableItem: {},
    },
    {
      title: 'Phone',
      name: 'phone',
      tableItem: {
        render: (text, item) => text,
      },
    },
    {
      title: 'Role',
      name: 'roleName',
      tableItem: {},
      formItem: {
        rules: [{ type: 'required' }],
        type: 'select',
        list: [
          { label: 'Administrator', value: 'administrator' },
          { label: 'Manager', value: 'manager' },
          { label: 'Staff Lv1', value: 'lv1' },
          { label: 'Staff Lv2', value: 'lv2' },
        ],
        col: 4,
      },
    },
    {
      title: 'Status',
      name: 'isDisabled',
      tableItem: {
        render: (text) => <p className="capitalize">{text === 0 ? 'Active' : 'Inactive'}</p>,
      },
    },
  ];
};

export default ColumnUserTable;
