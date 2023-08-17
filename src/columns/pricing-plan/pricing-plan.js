
import React, { Fragment } from 'react';
import { Popconfirm, Tooltip } from 'antd';
import EditIcon from 'assets/svg/edit.js';
import ArchiveIcon from 'assets/svg/archive';
import RestoreIcon from 'assets/svg/restore';
import { maskNumber } from 'utils';
const ColumnsPricingPlan = ({t,setOldData, handleEdit, handleRestorePlan, handleArchivePlan}) => {
  return [
    {
      title: 'ID',
      name: 'packageId',
      tableItem: {
        render: (text) => '#' + text,
      },
    },
    {
      title: 'Title',
      name: 'title',
      tableItem: {
        render: (text, item) => {
          return 'Pricing Package ' + item?.packageId;
        },
      },
      // formItem: {
      //   rules: [{ type: 'required' }],
      // },
    },
    {
      title: 'Subtitle',
      name: 'packageName',
      tableItem: {
        render: (text) => text,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Pricing',
      name: 'pricing',
      tableItem: {
        render: (text) => <p>$ {text}</p>,
      },
      formItem: {
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator: (_, value) => {
                if (isNaN(Number(value)) && value) {
                  return Promise.reject(new Error('Please enter only number!'));
                }
                return Promise.resolve();
              },
            }),
          },
        ],
        addonBefore: () => <div className="w-[80px] text-center">$</div>,
        col: 4,
        mask: maskNumber,
      },
    },
    {
      title: 'Status',
      name: 'isDisabled',
      tableItem: {
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
      title: 'Number of staff',
      name: 'staffLimit',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'only_number',
        mask: {
          mask: '[9{}]',
        },
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
                      <strong>Restore this Pricing Plan?</strong>
                      <div>This Pricing Plan will appear on the app as well as the related lists.</div>
                    </div>
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handleRestorePlan(data)}
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
                      <strong>Archive this Pricing Plan?</strong>
                      <div>
                        This Pricing Plan will not appear on the app. You can restore this Pricing Plan by clicking the Restore
                        button.
                      </div>
                    </div>
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handleArchivePlan(data)}
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
          </Fragment>
        ),
      },
    },
  ];
};

export default ColumnsPricingPlan;
