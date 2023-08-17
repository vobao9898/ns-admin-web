import React, { Fragment } from 'react';
import { Tooltip } from 'antd';
// import RemoveIcon from 'assets/svg/remove.js';
import moment from 'moment';
import { maskNumber } from 'utils';

const Column = ({ t, formatDate, handleEdit, handleDelete, handleExport, setOldData, setDetailMode }) => {
  return [
    {
      title: 'Gift Card Label',
      name: 'name',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Date Created',
      name: 'createdDate',
      tableItem: {
        sorter: true,
        render: (text, data) => moment(text).format('MM/DD/YYYY'),
      },
    },
    {
      title: 'Value',
      name: 'amount',
      tableItem: {
        sorter: true,
        render: (text, data) => '$ ' + text,
      },
      formItem: {
        rules: [{ type: 'required' }],
        mask: maskNumber,
      },
    },
    {
      title: 'Qty',
      name: 'quantity',
      tableItem: {
        sorter: true,
      },
      formItem: {
        type: 'only_number',
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                if (value && value > 1000) return Promise.reject(new Error('Please enter maximum 1000 number!'));
                return Promise.resolve();
              },
            }),
          },
        ],
      },
    },
    {
      title: 'Merchants can be apply',
      name: 'merchants',
      formItem: {
        type: 'tag',
        convert: (data) => (data?.map ? data.map((_item) => _item?.id || _item) : data),
        tag: {
          api: 'merchant/basicList',
          params: (form, fullTextSearch, value) => ({ businessName: fullTextSearch }),
          // avatar: 'avatarPath',
          label: 'businessname',
          value: 'merchantid',
        },
      },
    },
    {
      title: 'Actions',
      tableItem: {
        width: 180,
        align: 'center',
        onCell: () => ({
          style: { paddingTop: '0.25rem', paddingBottom: '0.25rem' },
        }),
        render: (text, data) => (
          <Fragment>
            <div className="flex items-center justify-center">
              <Tooltip title="Export">
                <button
                  className="embed border border-gray-300 text-xs rounded-lg mr-2 "
                  onClick={(e) => {
                    e.stopPropagation();
                    setOldData(data);
                    handleExport(data?.id);
                  }}
                >
                  <div className="w-[30px] h-[30px] flex items-center justify-center">
                    <i className="las la-file-export text-xl" />
                  </div>
                </button>
              </Tooltip>
              {/* <Tooltip title={t('routes.admin.Layout.Delete')}>
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
              </Tooltip> */}
            </div>
          </Fragment>
        ),
      },
    },
  ];
};
export default Column;
