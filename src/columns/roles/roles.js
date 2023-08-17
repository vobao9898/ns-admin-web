import React from 'react';
import { Checkbox } from 'antd';

export const columnRoles = (onCheckPermisison) => {
  return [
    {
      name: 'name',
      tableItem: {
        render: (text) => text,
        width: '40%',
      },
    },
    {
      name: 'adminstrator',
      tableItem: {
        render: (text, record) => (
          <Checkbox
            checked={text}
            onChange={(e) => {
              onCheckPermisison(e.target.checked, record.action, 1);
            }}
          />
        ),
      },
    },
    {
      name: 'manager',
      tableItem: {
        render: (text, record) => (
          <Checkbox
            checked={text}
            onChange={(e) => {
              onCheckPermisison(e.target.checked, record.action, 2);
            }}
          />
        ),
      },
    },
    {
      name: 'staff1',
      tableItem: {
        render: (text, record) => (
          <Checkbox
            checked={text}
            onChange={(e) => {
              onCheckPermisison(e.target.checked, record.action, 3);
            }}
          />
        ),
      },
    },
    {
      name: 'staff2',
      tableItem: {
        render: (text, record) => (
          <Checkbox
            checked={text}
            onChange={(e) => {
              onCheckPermisison(e.target.checked, record.action, 4);
            }}
          />
        ),
      },
    },
  ];
};
