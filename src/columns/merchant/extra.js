import React, { Fragment } from 'react';
import { Popconfirm, Tooltip } from 'antd';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import ArchiveIcon from 'assets/svg/archive.js';
import RestoreIcon from 'assets/svg/restore';
import { linkApi } from 'variable';
import { maskNumber } from 'utils';

const Column = ({ t, handleEdit, handleDelete, handleRestore, handleArchive, setOldData }) => {
  return [
    {
      title: 'Extra Name',
      name: 'name',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
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
      title: 'Price',
      name: 'price',
      tableItem: {
        sorter: true,
        render: (text, item) => '$ ' + text,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
        mask: maskNumber,
      },
    },
    {
      title: 'Surcharged',
      name: 'supplyFee',
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
        mask: maskNumber,
      },
    },
    {
      title: 'Duration',
      name: 'duration',
      tableItem: {
        sorter: true,
        render: (text, item) => text + ' Mins',
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 6,
        mask: {
          alias: 'numeric',
          prefix: 'Mins ',
          digitsOptional: true,
        },
      },
    },
    {
      title: 'Status',
      name: 'isDisabled',
      tableItem: {
        sorter: true,
        render: (text, item) => (item?.isDisabled ? 'Inactive' : 'Active'),
      },
      formItem: {
        rules: [{ type: 'required' }],
        type: 'select',
        list: [
          { value: 0, label: 'Active' },
          { value: 1, label: 'Inactive' },
        ],
        col: 6,
        placeholder: 'Status',
      },
    },
    {
      title: 'Image',
      name: 'fileId',
      tableItem: {
        sorter: true,
        render: (text, item) => (text ? <img src={item?.imageUrl} className="w-10" key={item?.extraId} /> : null),
      },
      formItem: {
        type: 'upload',
        action: linkApi + 'File?category=product',
        onlyImage: true,
        col: 4,
        // rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Action',
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
                      <strong>Restore this Extra?</strong>
                      <div>This extra will appear on the app as well as the related lists.</div>
                    </div>
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handleRestore(data?.id)}
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
                      <strong>Archive this Extra?</strong>
                      <div>
                        This extra will not appear on the app. You can restore this extra by clicking the Restore
                        button.
                      </div>
                    </div>
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handleArchive(data?.id)}
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
                onClick={() => {
                  setOldData(data);
                  handleEdit(data);
                }}
              >
                <EditIcon />
              </button>
            </Tooltip>
            <Tooltip title={t('routes.admin.Layout.Delete')}>
              <Popconfirm
                placement="left"
                title={t('components.datatable.areYouSureWant')}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                onConfirm={() => handleDelete(data?.id)}
                okText={t('components.datatable.ok')}
                cancelText={t('components.datatable.cancel')}
              >
                <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                  <RemoveIcon />
                </button>
              </Popconfirm>
            </Tooltip>
          </Fragment>
        ),
      },
    },
  ];
};

export default Column;
