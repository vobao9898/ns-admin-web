import React from 'react';
import { Switch } from 'antd';
import { checkTextToShort } from 'utils';

const ColumnsMarketPlace = () => {
  return [
    {
      title: 'Name',
      name: 'name',
      tableItem: {
        sort: true,
        width: 100,
        render: (text) => checkTextToShort(text),
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'URL',
      name: 'link',
      tableItem: {
        sort: true,
        width: 100,
        render: (text) => <p className="text-blue-500 hover:">{checkTextToShort(text)}</p>,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
        colTablet: 6,
      },
    },
    {
      title: 'Status',
      name: 'isDisabled',
      tableItem: {
        sort: true,
        width: 100,
        render: (text) => (text === 0 ? 'Active' : 'Inactive'),
      },
      formItem: {
        type: 'select',
        col: 4,
        colTablet: 6,
        list: [
          { label: 'Active', value: 0 },
          { label: 'Inactive', value: 1 },
        ],
      },
    },
    {
      title: 'On Top',
      name: 'onTop',
      tableItem: {
        sort: true,
        width: 100,
        render: (text, item) => <Switch defaultChecked={item.onTop} />,
      },
      formItem: {
        col: 12,
        type: 'switch',
      },
    },
    {
      title: 'Image',
      name: 'fileURL',
      tableItem: {
        width: 100,
        render: (text, item) => (
          <div
            className="w-20 h-20 bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url("${text}")` }}
            alt={text}
          ></div>
        ),
      },
      formItem: {
        rules: [{ type: 'required' }],
        type: 'upload',
        onlyImage: true,
        action: 'File',
        col: 3,
      },
    },
  ];
};

export default ColumnsMarketPlace;
