import React, { useState, Fragment, useRef, useCallback, useEffect } from 'react';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { DataTable, ModalForm } from 'components';

import { useAuth } from 'globalContext';
import { ColumnProduct, ColumnProductDetail } from 'columns/merchant';
import { MerchantService } from 'services/merchant';
import { Button } from 'layouts/components';

const Page = ({ id, clickProduct, toggleState }) => {
  const { t } = useTranslation();
  const { formatDate, permission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [oldData, setOldData] = useState();
  const [category, setCategory] = useState();
  const [detail, setDeail] = useState(null);

  const generalDetails = [
    {
      title: 'Category',
      key: 'categoryName',
    },
    {
      title: 'SKU',
      key: 'sku',
    },
    {
      title: 'Barcode',
      key: 'barCode',
    },
    {
      title: 'Price',
      key: 'priceRange',
    },
    {
      title: 'Total items in stock',
      key: 'quantity',
    },
    {
      title: 'Total items need to order',
      key: 'needToOrder',
    },
    {
      title: 'Description',
      key: 'description',
    },
  ];
  const [isWarHouse, setIsWarHouse] = useState(true);

  const getCategory = useCallback(async () => {
    const params = { page: 0, perPage: 0, isSubCategory: 1, isGetBrief: true, status: 0 };
    const res = await MerchantService.getMerchantById(id);
    if (res?.data?.type === 'Retailer') {
      if (res?.data?.isWareHouse) {
        setIsWarHouse(true);
      } else {
        setIsWarHouse(false);
      }
    } else {
      setIsWarHouse(false);
      delete params?.isSubCategory;
    }
    const { data } = await MerchantService.getCategory(params, id, { type: 'product' });
    setCategory(data);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    getCategory();
  }, [getCategory, toggleState]);

  const handleRestoreProduct = async (id) => {
    await MerchantService.restoreProduct(id);
    dataTableRef?.current?.onChange();
  };
  const handleArchiveProduct = async (id) => {
    await MerchantService.archiveProduct(id);
    dataTableRef?.current?.onChange();
  };

  clickProduct(() => {
    setDeail(null);
    dataTableRef?.current?.onChange();
  });

  const dataTableRef = useRef();
  const dataTableDetailRef = useRef();
  const modalFormRef = useRef();

  return (
    <>
      <ModalForm
        ref={modalFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={900}
        title={(data) => (!data?.id ? 'Add' : 'Edit')}
        GetById={async (productId) => {
          const data = await MerchantService.getProductById(productId);
          const categoryIds = category?.map((item) => item?.categoryId);
          const product =
            categoryIds?.indexOf(data?.data?.categoryId) > -1
              ? data
              : {
                  ...data,
                  data: {
                    ...data?.data,
                    categoryId: undefined,
                  },
                };
          return product;
        }}
        Post={MerchantService.postProduct}
        Put={MerchantService.putProduct}
        parentID={() => ({
          merchantId: id,
          fileId: oldData?.fileId,
        })}
        handleChange={() => dataTableRef?.current?.onChange()}
        columns={ColumnProduct({ t, formatDate, merchantId: id, isWarHouse, category })}
      />

      {detail && (
        <>
          <div className="flex items-center justify-between">
            <h4 className="w-4/5 text-xl font-semibold text-black">{detail?.name}</h4>
            <Button name={'BACK'} onClick={() => setDeail(null)} />
          </div>
          <div className=" my-5">
            <h4 className="text-xl font-semibold text-blue-500 mb-2">General Details</h4>
            <div className="flex">
              <div className="mr-5 w-40 h-40">
                <img className="w-full h-full object-cover" src={detail?.imageUrl || ''} alt="img" />
              </div>
              <div className="">
                {generalDetails?.map((item) => {
                  return (
                    <div className="flex items-center mb-1" key={item?.key}>
                      <p className="mr-5 w-40 text-xs font-bold">{item?.title}</p>
                      <p className="">{detail[item?.key]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <h4 className="text-xl font-semibold text-blue-500 mb-2">Product Versions</h4>
          <DataTable
            ref={dataTableDetailRef}
            save={false}
            xScroll={'100%'}
            showSearch={false}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            Get={MerchantService.getChildByProductParentId}
            id={() => detail?.productId}
            columns={ColumnProductDetail()}
          />
        </>
      )}
      {!detail && (
        <DataTable
          ref={dataTableRef}
          save={false}
          xScroll={'100%'}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          id={() => id}
          Get={MerchantService.getProduct}
          columns={ColumnProduct({
            t,
            formatDate,
            handleEdit: modalFormRef?.current?.handleEdit,
            handleDelete: modalFormRef?.current?.handleDelete,
            handleRestoreProduct,
            handleArchiveProduct,
            setOldData,
            category,
            isWarHouse,
          })}
          onRow={(...params) => ({
            onClick: (e) => {
              if (e?.target?.cellIndex) {
                setDeail(params[0]);
              }
            },
          })}
          rightHeader={
            <Space>
              {!!permission && (
                <Fragment>
                  <Button
                    type={'ok'}
                    name="New Product"
                    onClick={() => {
                      modalFormRef?.current?.handleEdit();
                    }}
                  />
                </Fragment>
              )}
            </Space>
          }
        />
      )}
    </>
  );
};
export default Page;
