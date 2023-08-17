import { Switch, Form as FormAnt, Spin } from 'antd';
import { Form } from 'components';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { MarketPlaceService } from 'services/market-place';
import { routerLinks, convertFormValue } from 'utils';
import { ColumnsMarketPlace } from 'columns/market-place';
import { Title, Button } from 'layouts/components';

import './index.less';

const MarketPlaceProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = FormAnt.useForm();
  const { state } = useLocation();

  const marketPlace = state?.marketPlace || {};
  marketPlace.fileURL = marketPlace?.fileURL || '';

  const [brand] = useState(marketPlace);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cols = ColumnsMarketPlace({});

  const bread = [
    {
      name: 'Market Place',
      path: 'Market Place',
    },
    {
      name: isEdit ? 'Edit' : 'Detail',
    },
  ];

  const handleEdit = async () => {
    let value = await form.validateFields();
    value = convertFormValue(cols, value, form);

    setIsLoading(true);
    await MarketPlaceService.editBrand(value, id, brand);
    navigate(routerLinks('Market Place'), { state });
  };

  return (
    <Spin spinning={isLoading}>
      <Title title="Market Place" breadcrumbs={bread} />
      <div className="px-4 py-5 rounded-xl shadow bg-gray-50">
        {!isEdit && (
          <>
            <div className="mb-5 flex items-start justify-between">
              <h2 className="w-1/2 text-lg font-semibold text-black">{brand?.name}</h2>
              <Button name="BACK" onClick={() => window.history.back()} />
            </div>
            <div className="flex flex-wrap">
              <div className="w-1/3 mb-5">
                <p className="mb-1 text-base font-medium text-black">Name</p>
                <p className="">{brand?.name}</p>
              </div>
              <div className="w-1/3 mb-5">
                <p className="mb-1 text-base font-medium text-black">URL</p>
                <p className="w-full break-words">{brand?.link}</p>
              </div>
              <div className="w-full mb-5">
                <p className="mb-1 text-base font-medium text-black">Image</p>
                <div className="w-36">
                  <img className="w-full object-cover" src={brand?.fileURL} alt={'market place'} />
                </div>
              </div>
              <div className="w-full mb-5">
                <p className="mb-1 text-base font-medium text-black">Status</p>
                <p className="">{brand?.isDisabled === 0 ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="w-full mb-5 flex">
                <p className="mb-1 text-base font-medium text-black mr-4">On Top</p>
                <Switch checked={brand?.onTop} />
              </div>
            </div>
            <div className="w-fit">
              <Button name="EDIT" type="ok" onClick={() => setIsEdit(true)} />
            </div>
          </>
        )}

        {isEdit && (
          <>
            <Form columns={cols} values={brand} form={form} />
            <div className="flex items-center">
              <Button name="CANCEL" onClick={() => setIsEdit(false)} moreClass="mr-5" />
              <Button name="SAVE" type="ok" onClick={() => handleEdit()} />
            </div>
          </>
        )}
      </div>
    </Spin>
  );
};

export default MarketPlaceProfile;
