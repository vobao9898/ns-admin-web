import React, { Fragment } from 'react';
import { Tooltip } from 'antd';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import ArchiveIcon from 'assets/svg/archive.js';
import { maskNumber } from 'utils';

const Column = ({ t, handleEdit, handleDelete, handleArchive, category }) => {
  const list =
    category &&
    category
      ?.filter((item) => item?.categoryType === 'Service')
      .map((item) => ({ value: item?.categoryId, label: item?.name }));

  return [
    {
      title: 'Service Name',
      name: 'name',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Image',
      name: 'imageUrl',
      tableItem: {
        sorter: false,
        render: (text, item) => item?.imageUrl && <img src={item?.imageUrl} className="w-6" alt={'Image'} />,
      },
      formItem: {
        type: 'upload',
        action: 'File',
        onlyImage: true,
        col: 3,
        colTablet: 3,
      },
    },
    {
      title: 'Description',
      name: 'description',
      formItem: {
        type: 'textarea',
      },
    },

    {
      title: 'Categories',
      name: 'categoryId',
      tableItem: {
        sorter: true,
        render: (text, item) => item?.categoryName || '',
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 12,
        type: 'select',
        list,
      },
    },
    {
      title: 'Duration',
      name: 'duration',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Duration',
      name: 'duration',
      formItem: {
        type: 'title',
        render: () => <h4 className="font-semibold text-xl text-bblue-500">Duration</h4>,
      },
    },
    {
      title: 'Minutes',
      name: 'duration',
      formItem: {
        rules: [{ type: 'required' }],
        addonBefore: (form) => (
          <p className="text-center" style={{ width: 40 }}>
            Min
          </p>
        ),
        type: 'only_number',
        col: 4,
        colTablet: 12,
      },
    },
    {
      title: 'Open Time',
      name: 'openTime',
      formItem: {
        addonBefore: (form) => (
          <p className="text-center" style={{ width: 40 }}>
            Min
          </p>
        ),
        placeholder: '0',
        type: 'only_number',
        col: 4,
        colTablet: 12,
      },
    },
    {
      title: 'Second Time',
      name: 'secondTime',
      formItem: {
        // mask: {
        //   alias: 'decimal',
        //   prefix: 'Min ',
        //   digitsOptional: true,
        //   placeholder: '0',
        // },
        addonBefore: (form) => (
          <p className="text-center" style={{ width: 40 }}>
            Min
          </p>
        ),
        placeholder: '0',
        type: 'only_number',
        col: 4,
        colTablet: 12,
      },
    },
    {
      title: 'Price',
      name: 'price',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
        addonBefore: (form) => (
          <p className="text-center" style={{ width: 40 }}>
            $
          </p>
        ),
        mask: maskNumber,
        placeholder: '0.00',
        col: 4,
        colTablet: 12,
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
        rules: [{ type: 'required' }, { type: 'select' }],
        type: 'select',
        list: [
          { value: 0, label: 'Active' },
          { value: 1, label: 'Inactive' },
        ],
        col: 4,
        colTablet: 12,
      },
    },
    {
      title: 'Surcharged',
      name: 'supplyFee',
      formItem: {
        addonBefore: (form) => (
          <p className="text-center" style={{ width: 40 }}>
            $
          </p>
        ),
        mask: maskNumber,
        placeholder: '0.00',
        col: 4,
        colTablet: 12,
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
            <Tooltip title={data?.isDisabled === 1 ? 'Restore' : 'Archive'}>
              <button
                className="embed border border-gray-300 text-xs rounded-lg mr-2"
                onClick={() => handleArchive(data)}
              >
                <ArchiveIcon color={data?.isDisabled === 1 ? 'rgba(0,0,255,0.5)' : ''} />
              </button>
            </Tooltip>
            <Tooltip title={t('routes.admin.Layout.Edit')}>
              <button
                className="embed border border-gray-300 text-xs rounded-lg mr-2"
                onClick={() => {
                  data.description = data?.description === null ? '' : data?.description;
                  handleEdit(data);
                }}
              >
                <EditIcon />
              </button>
            </Tooltip>
            <Tooltip title={t('routes.admin.Layout.Delete')}>
              <button
                className="embed border border-gray-300 text-xs rounded-lg mr-2"
                onClick={() => handleDelete(data)}
              >
                <RemoveIcon />
              </button>
            </Tooltip>
          </Fragment>
        ),
      },
    },
  ];
};
export default Column;
