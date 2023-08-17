import React, { Fragment } from 'react';
import { Popconfirm, Tooltip } from 'antd';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import ArchiveIcon from 'assets/svg/archive';
import RestoreIcon from 'assets/svg/restore';

const Column = ({
  t,
  handleEdit,
  handleDelete,
  setOldData,
  handleRestoreCategory,
  handleArchiveCategory,
  isWarHouse,
  data,
  form,
  set_data,
  dataIsSubCategory,
  isRetailer,
  isTable,
  set_firstChange
}) => {
  if (isWarHouse && !isTable) {
    if (data?.isSubCategory) {
      return [
        {
          title: 'Category Name',
          name: 'name',
          tableItem: {
            sorter: true,
          },
          formItem: {
            rules: [{ type: 'required' }],
            placeholder: 'Category Name',
          },
        },
        {
          title: 'Parent Name',
          name: 'parentName',
          tableItem: {
            sorter: true,
          },
        },
        {
          title: 'Is Subcategory',
          name: 'isSubCategory',
          formItem: {
            type: 'switchCategory',
            onChange: (value) => {
              const data = form.getFieldValue();
              form.setFieldsValue({ ...data, isSubCategory: value, parentId: null });
              set_data({ ...data, isSubCategory: value, parentId: null });
              set_firstChange(true);
            },
          },
        },
        {
          title: 'Select parent',
          name: 'parentId',
          formItem: {
            disabled: () => !form?.getFieldValue('isSubCategory'),
            rules: [{ type: 'required' }],
            type: 'select',
            list: dataIsSubCategory,
            placeholder: 'Select',
          },
        },
      ];
    } else {
      return [
        {
          title: 'Category Name',
          name: 'name',
          tableItem: {
            sorter: true,
          },
          formItem: {
            rules: [{ type: 'required' }],
            placeholder: 'Category Name',
          },
        },
        {
          title: 'Parent Name',
          name: 'parentName',
          tableItem: {
            sorter: true,
          },
        },
        {
          title: 'Is Subcategory',
          name: 'isSubCategory',
          formItem: {
            type: 'switchCategory',
            onChange: (value) => {
              const data = form.getFieldValue();
              form.setFieldsValue({ ...data, isSubCategory: value, parentId: null });
              set_data({ ...data, isSubCategory: value, parentId: null });
              set_firstChange(true);
            },
          },
        },
      ];
    }
  }
  if (isRetailer || isWarHouse) {
    return [
      {
        title: 'Category Name',
        name: 'name',
        tableItem: {
          sorter: true,
        },
        formItem: {
          rules: [{ type: 'required' }],
        },
      },
      {
        title: 'Parent Name',
        name: 'parentName',
        tableItem: {
          sorter: true,
        },
      },
      {
        title: 'Type',
        name: 'categoryType',
        tableItem: {
          sorter: true,
          render: (text, data) => {
            let statusName;
            switch (data?.categoryType) {
              case 'Service':
                statusName = 'SERVICE';
                break;

              case 'Product':
                statusName = 'PRODUCT';
                break;

              default:
                statusName = '';
                break;
            }
            return statusName;
          },
        },
        formItem: {
          rules: [{ type: 'required' }],
          type: 'select',
          list: [
            { value: 'Product', label: 'PRODUCT' },
            { value: 'Service', label: 'SERVICE' },
          ],
          placeholder: 'Type',
        },
      },
      {
        title: 'Status',
        name: 'isDisabled',
        tableItem: {
          sorter: true,
          render: (text, data) => (data?.isDisabled ? 'Inactive' : 'Active'),
        },
      },
      {
        title: 'Actions',
        tableItem: {
          align: 'center',
          onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
          render: (text, data) => (
            <Fragment>
              {isWarHouse && (
                <>
                  {' '}
                  {data?.isDisabled ? (
                    <Tooltip title={t('Restore')}>
                      <Popconfirm
                        placement="left"
                        title={
                          <div>
                            <strong>Restore this Category?</strong>
                            <div>This category will appear on the app as well as the related lists.</div>
                          </div>
                        }
                        icon={
                          <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                        }
                        onConfirm={() => handleRestoreCategory(data?.id)}
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
                            <strong>Archive this Category?</strong>
                            <div>
                              This category will not appear on the app. You can restore this category by clicking the
                              Restore button.
                            </div>
                          </div>
                        }
                        icon={
                          <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                        }
                        onConfirm={() => handleArchiveCategory(data?.id)}
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
                      onConfirm={() => handleDelete(data.id)}
                      okText={t('components.datatable.ok')}
                      cancelText={t('components.datatable.cancel')}
                    >
                      <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                        <RemoveIcon />
                      </button>
                    </Popconfirm>
                  </Tooltip>
                </>
              )}
            </Fragment>
          ),
        },
      },
    ];
  } else {
    return [
      {
        title: 'Category Name',
        name: 'name',
        tableItem: {
          sorter: true,
        },
        formItem: {
          rules: [{ type: 'required' }],
        },
      },
      {
        title: 'Type',
        name: 'categoryType',
        tableItem: {
          sorter: true,
          render: (text, data) => {
            let statusName;
            switch (data?.categoryType) {
              case 'Service':
                statusName = 'SERVICE';
                break;

              case 'Product':
                statusName = 'PRODUCT';
                break;

              default:
                statusName = '';
                break;
            }
            return statusName;
          },
        },
        formItem: {
          rules: [{ type: 'required' }],
          type: 'select',
          list: [
            { value: 'Product', label: 'PRODUCT' },
            { value: 'Service', label: 'SERVICE' },
          ],
          placeholder: 'Type',
        },
      },
      {
        title: 'Status',
        name: 'isDisabled',
        tableItem: {
          sorter: true,
          render: (text, data) => (data?.isDisabled ? 'Inactive' : 'Active'),
        },
      },
      {
        title: 'Actions',
        tableItem: {
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
                        <strong>Restore this Category?</strong>
                        <div>This category will appear on the app as well as the related lists.</div>
                      </div>
                    }
                    icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                    onConfirm={() => handleRestoreCategory(data?.id)}
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
                        <strong>Archive this Category?</strong>
                        <div>
                          This category will not appear on the app. You can restore this category by clicking the
                          Restore button.
                        </div>
                      </div>
                    }
                    icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                    onConfirm={() => handleArchiveCategory(data?.id)}
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
  }
};
export default Column;
