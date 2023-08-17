import React, { Fragment } from 'react';
import { Tooltip, Popconfirm } from 'antd';
import EditIcon from 'assets/svg/edit.js';
import RestoreIcon from 'assets/svg/restore.js';
import ArchiveIcon from 'assets/svg/archive.js';
import { linkApi } from 'variable';
import { maskNumber } from 'utils';

const Column = ({
  t,
  handleEdit,
  merchantId,
  handleRestoreProduct,
  handleArchiveProduct,
  setOldData,
  isWarHouse = true,
  category,
}) => {
  const list =
    category &&
    category
      ?.filter((item) => item?.categoryType === "Product")
      .map((item) => ({ value: item?.categoryId, label: item?.name }));
  return [
    {
      title: 'Product Name',
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
      name: 'fileId',
      tableItem: {
        sorter: true,
        render: (text, item) => item?.imageUrl && <img src={item?.imageUrl} className="w-10" />,
      },
      formItem: {
        type: 'upload',
        action: linkApi + 'File?category=product',
        multiple: false,
        onlyImage: true,
        showBtnDownload: () => false,
        showBtnDelete: () => false,
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
        render: (text, item) => item?.categoryName,
      },
      formItem: {
        rules: [{ type: 'required' }],
        type: 'select',
        col: 4,
        list,
      },
    },
    {
      title: 'Quantity',
      name: 'quantity',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'BarCode',
      name: 'barCode',
      formItem: {
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                if (value?.length < 6 && value) {
                  return Promise.reject(new Error('Please enter minimum 6 number!'));
                }
                return Promise.resolve();
              },
            }),
          },
        ],
        col: 4,
      },
    },
    {
      title: 'Items In Stock',
      name: 'quantity',
      formItem: {
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                if (value && isNaN(Number(value))) {
                  return Promise.reject(new Error('Please enter only number!'));
                }
                return Promise.resolve();
              },
            }),
          },
        ],
        col: 4,
        addonBefore: () => <div className="w-[80px] text-center">Item</div>,
      },
    },
    {
      title: 'Low Threshold',
      name: 'minThreshold',
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
        addonBefore: () => <div className="w-[80px] text-center">Item</div>,
        col: 4,
      },
    },
    {
      title: 'High Threshold',
      name: 'maxThreshold',
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
        addonBefore: () => <div className="w-[80px] text-center">Item</div>,
        col: 4,
      },
    },
    {
      title: 'Price',
      name: 'price',
      tableItem: {
        sorter: true,
        render: (text, item) => '$' + text,
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
        col: 4,
        placeholder: 'Status',
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
                      <strong>Restore this Product?</strong>
                      <div>This product will appear on the app as well as the related lists.</div>
                    </div>
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handleRestoreProduct(data?.id)}
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
                      <strong>Archive this Product?</strong>
                      <div>
                        This product will not appear on the app. You can restore this product by clicking the Restore
                        button.
                      </div>
                    </div>
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handleArchiveProduct(data?.id)}
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
                  setOldData(data);
                  handleEdit({ id: data?.productId });
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
