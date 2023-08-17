import { Popconfirm, Tooltip } from 'antd';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import React, { Fragment } from 'react';
import { Avatar } from 'components';
import { routerLinks } from 'utils';
const Column = ({ t, formatDate, listGender, handleEdit, handleDelete }) => {
  return [
    {
      title: t('Họ và tên'),
      name: 'name',
      tableItem: {
        filter: { type: 'search' },
        sorter: true,
        onCell: (data) => ({
          style: { paddingTop: '0.25rem', paddingBottom: 0 },
          onClick: async () => {},
        }),
        render: (text) =>
          text && (
            <Avatar src="https://hinhanhdep.org/wp-content/uploads/2016/07/anh-avatar-girl-xinh.jpg" text={text} />
          ),
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'vehicles',
      title: t('danh sách xe'),
      formItem: {
        name: 'vehicles',
        type: 'addable',
        text_add: t('Add vehicle'),
        fieldsName: [
          { name: 'vehicleBrand', placeholder: 'Hiệu xe' },
          { name: 'licensePlate', placeholder: 'Biển số xe' },
        ],
      },
    },
    {
      name: 'gender',
      title: 'Gender',
      formItem: {
        type: 'select',
        rules: [{ type: 'required' }],
        list: listGender,
      },
    },
    {
      title: t('Color'),
      name: 'color',
      formItem: {
        type: 'color_button',
        rules: [{ type: 'required' }],
      },
    },
    {
      title: t('Tên tài khoản'),
      name: 'username',
      tableItem: {
        filter: { type: 'search' },
        sorter: true,
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text) =>
          text && (
            <Avatar
              isGroup
              keySrc="avatarPath"
              keyName="fullName"
              text={[
                {
                  fullName: 'Văn A',
                },
                {
                  fullName: 'Quỳnh B',
                },
                {
                  fullName: 'Lê F',
                },
                {
                  fullName: 'Tân C',
                  avatarPath: 'https://hinhanhdep.org/wp-content/uploads/2016/07/anh-avatar-girl-xinh.jpg',
                },
                {
                  fullName: 'Nguyễn D',
                },
              ]}
            />
          ),
      },
      formItem: {
        type: 'textarea',
        rules: [{ type: 'required' }],
      },
    },
    {
      title: t('Thu nhập'),
      name: 'Currency',
      formItem: {
        mask: {
          alias: 'numeric',
          groupSeparator: ',',
          digitsOptional: false,
          prefix: '$ ',
          placeholder: '0',
        },
      },
    },
    {
      title: t('Email'),
      name: 'email',
      tableItem: {
        filter: { type: 'search' },
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }, { type: 'email' }],
      },
    },
    {
      title: t('Trạng thái'),
      name: 'isActive',
      tableItem: {
        sorter: true,
        render: (text) => text && <i className="las la-check-circle la-2x" />,
      },
      formItem: {
        condition: (data) => !!data && data.id,
        type: 'switch',
      },
    },
    {
      title: t('Assign to'),
      name: 'assignTo',
      formItem: {
        rules: [{ type: 'required' }],
        type: 'tag',
        col: 24,
        convert: (data) => (data?.map ? data.map((_item) => _item?.id || _item) : data),
        tag: {
          api: routerLinks('User', 'api') + '/brief',
          params: (form, fullTextSearch, value) => ({
            fullTextSearch,
            filter: { containEmployees: value || [] },
          }),
          avatar: 'avatarPath',
          label: 'fullName',
          value: 'id',
        },
      },
    },
    {
      title: t('Attachment'),
      name: 'attachment',
      formItem: {
        type: 'upload',
      },
    },
    {
      title: t('Hoạt động'),
      tableItem: {
        width: 180,
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <Fragment>
            <Tooltip title={t('routes.admin.Layout.Edit')}>
              <button className="embed border border-gray-300 text-xs rounded-lg mr-2" onClick={() => handleEdit(data)}>
                <EditIcon />
              </button>
            </Tooltip>
            <Tooltip title={t('routes.admin.Layout.Delete')}>
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
            </Tooltip>
          </Fragment>
        ),
      },
    },
  ];
};
export default Column;
