import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { Tabs, Spin, Form as FormAnt } from 'antd';
import './index.less';
import { routerLinks } from 'utils';
import { Button, Title } from 'layouts/components';
import Bank from './bank';
import General from './general';
import Principal from './principal';
import Staff from './staff';
import Subscription from './subscription';
import Category from './category';
import Service from './service/service';
import Product from './product';
import Extra from './extra';
import GiftCart from './gift-cart';
import Invoice from './invoice';
import Device from './device';
import Setting from './setting';
import Activities from './activities';
import { MerchantService } from 'services/merchant';
import { Form, Message, Modal } from 'components';
import moment from 'moment';
import classNames from 'classnames';

const Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const now = new Date();
  const firstDay = moment(new Date(now.getFullYear(), now.getMonth(), 1)).format('MM/DD/YYYY');
  const lastDay = moment(new Date(now.getFullYear(), now.getMonth() + 1, 0)).format('MM/DD/YYYY');
  const [form] = FormAnt.useForm();
  const [filter] = useState(location?.state);

  const [toggleState, setToggleState] = useState('general');
  const [merchant, setMerchant] = useState();
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMerchant = useCallback(async () => {
    const { data } = await MerchantService.getMerchantById(id);
    const stateRes = await MerchantService.getState();
    if (!data) {
      navigate(routerLinks('Merchant'), { state: { ...filter } });
      return;
    }
    data.general = formatPhoneGeneral(data?.general);
    data.principals = formatPhonePrincipals(data?.principals);

    setState(stateRes.data);
    setMerchant(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const oldToggleState = JSON.parse(localStorage.getItem('toggleState'));
    oldToggleState && setToggleState(oldToggleState);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getMerchant();
  }, [getMerchant]);

  const formatPhoneGeneral = (general) => {
    [general.codePhoneBusiness, general.phoneBusiness] = handlePhone(general?.phoneBusiness);
    [general.codePhoneContact, general.phoneContact] = handlePhone(general?.phoneContact);
    return general;
  };

  const formatPhonePrincipals = (principals) => {
    principals =
      principals &&
      principals.map((item) => {
        [item.codeHomePhone, item.homePhone] = handlePhone(item?.homePhone);
        const [code, phone] = handlePhone(item?.mobilePhone);
        item.codeMobilePhone = code;
        item.mobilePhone = phone;
        return item;
      });
    return principals;
  };

  const handlePhone = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length === 0) return ['', phoneNumber];
    let [code, phone] = getInfoPhone(phoneNumber);
    phone = getPhoneOnlyNumber(phone);
    return [code, phone];
  };

  const getInfoPhone = (phone) => {
    let code = '';
    if (phone.indexOf('+1') > -1 && phone.indexOf(' +1') === -1) {
      code = '+1';
      phone = phone.replace('+1', '');
    }
    if (phone.indexOf(' +1') > -1) {
      code = ' +1';
      phone = phone.replace(' +1', '');
    }
    if (phone.indexOf('+84') > -1) {
      code = '+84';
      phone = phone.replace('+84', '');
    }
    return [code, phone];
  };

  const getPhoneOnlyNumber = (phone) => {
    let result = '';
    phone = '' + phone;
    phone = phone.replaceAll('-', '');
    phone = phone.replaceAll('(', '');
    phone = phone.replaceAll(')', '');
    phone = phone.replaceAll(' ', '');
    const str1 = phone.substring(0, 3);
    const str2 = phone.substring(3, 6);
    const str3 = phone.substring(6, phone.length);
    result = result + str1;
    if (phone.length > 3) {
      result = result + ' ' + str2;
    }
    if (phone.length > 6) {
      result = result + '-' + str3;
    }
    return result;
  };

  const handleChangeState = (key) => {
    localStorage.setItem('toggleState', JSON.stringify(key));
    setToggleState(key);
  };

  const handleChange = async () => {
    setIsLoading(true);
    const { data } = await MerchantService.getMerchantById(id);
    data.general = formatPhoneGeneral(data?.general);
    data.principals = formatPhonePrincipals(data?.principals);

    setMerchant(data);
    setIsLoading(false);
  };

  let clickInvoice = () => {};
  let clickBank = () => {};
  let clickPrincipal = () => {};
  let clickStaff = () => {};
  let clickService = () => {};
  let clickExtra = () => {};
  let clickProduct = () => {};

  const objDetail = [
    {
      key: 'general',
      title: 'General',
      content: (
        <General
          id={id}
          merchant={merchant}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          state={state}
          handleChange={handleChange}
          toggleState={toggleState}
        />
      ),
    },
    {
      title: <p onClick={() => clickBank()}>Bank</p>,
      key: 'bank',
      content: (
        <Bank
          merchantId={id}
          bank={merchant?.businessBank}
          handleChange={handleChange}
          clickBank={(func) => {
            clickBank = func;
          }}
        />
      ),
    },
    {
      key: 'principal',
      title: <p onClick={() => clickPrincipal()}>Principal</p>,
      content: (
        <Principal
          id={id}
          toggleState={toggleState}
          principals={merchant?.principals || []}
          handleChange={handleChange}
          state={state}
          merchant={merchant}
          clickPrincipal={(func) => {
            clickPrincipal = func;
          }}
        />
      ),
    },
    {
      title: 'Subscription',
      key: 'subscription',
      content: <Subscription id={id} setToggleState={setToggleState} toggleState={toggleState} merchant={merchant} />,
    },
    {
      title: <p onClick={() => clickStaff()}>Staff</p>,
      key: 'staff',
      content: (
        <Staff
          id={id}
          toggleState={toggleState}
          state={state}
          clickStaff={(func) => {
            clickStaff = func;
          }}
        />
      ),
    },
    {
      title: 'Category',
      key: 'category',
      content: <Category id={id} />,
    },
    {
      title: <p onClick={() => clickService()}>Service</p>,
      key: 'service',
      content: (
        <Service
          id={id}
          merchant={merchant}
          handleChange={handleChange}
          toggleState={toggleState}
          clickService={(func) => {
            clickService = func;
          }}
        />
      ),
    },
    {
      title: <p onClick={() => clickProduct()}>Product</p>,
      key: 'product',
      content: (
        <Product
          id={id}
          clickProduct={(func) => {
            clickProduct = func;
          }}
          toggleState={toggleState}
        />
      ),
    },
    {
      key: 'extra',
      title: <p onClick={() => clickExtra && clickExtra()}>Extra</p>,
      content: (
        <Extra
          id={id}
          clickExtra={(func) => {
            clickExtra = func;
          }}
        />
      ),
    },
    {
      key: 'gift-card',
      title: 'Gift Card',
      content: <GiftCart id={id} />,
    },
    {
      title: <p onClick={() => clickInvoice && clickInvoice()}>Invoice</p>,
      key: 'invoice',
      content: (
        <Invoice
          id={id}
          toggleState={toggleState}
          clickInvoice={(func) => {
            clickInvoice = func;
          }}
        />
      ),
    },
    {
      title: 'Device',
      key: 'device',
      content: <Device id={id} />,
    },
    {
      title: 'Setting',
      key: 'setting',
      content: <Setting id={id} merchant={merchant} handleChange={handleChange} />,
    },
    {
      title: 'Activities',
      key: 'activities',
      content: <Activities id={id} />,
    },
  ];

  const breadcrumbs = [
    {
      name: 'Merchant List',
      path: 'Merchant',
    },
    {
      name: 'Merchant Profile',
    },
  ];

  const handleCloneMerchant = async () => {
    setIsLoading(true);
    const data = await MerchantService.cloneMerchant(merchant?.merchantId);
    if (data?.data) {
      Message.success({ text: data?.message });
    }
    setIsLoading(false);
  };

  const handleDeleteMerchant = async () => {
    setIsLoading(true);
    const data = await MerchantService.deleteMerchant(merchant?.merchantId);
    if (data?.data) {
      Message.success({ text: data?.message });
      navigate(routerLinks('Merchant'), { state: { ...filter } });
    }
    setIsLoading(false);
  };

  const handleExport = async () => {
    setIsLoading(true);
    const value = await form.getFieldValue();
    const params = {
      fromDate: moment(value?.dateRange[0]).format('MM/DD/YYYY'),
      toDate: moment(value?.dateRange[1]).format('MM/DD/YYYY'),
    };
    const data = await MerchantService.exportSettlement(merchant?.merchantId, params);
    if (data?.data) {
      window.open(data?.data?.path);
    }
    setIsLoading(false);
  };

  const isHideServiceTabs = (data, item) => {
    return data && data.type === 'Retailer' && item?.key === 'service';
  };

  const modalRef = useRef();
  const modalExportRef = useRef();

  return (
    <Spin spinning={isLoading}>
      <Title title={'Merchant Profile'} breadcrumbs={breadcrumbs} />
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="mb-5 lg:flex justify-between items-center">
          <span className="text-lg font-bold text-black block lg:mb-0 mb-4">ID : {id}</span>
          <div
            className={classNames('grid grid-cols-2 gap-3 lg:mb-0 mb-4', {
              'lg:grid-cols-3': merchant?.type !== 'Retailer' || !merchant?.isWareHouse,
              'lg:grid-cols-4': merchant?.type === 'Retailer' && merchant?.isWareHouse,
            })}
          >
            {merchant?.type !== 'Retailer' || !merchant?.isWareHouse ? null : (
              <Button type={'ok'} name={'Clone Merchant'} onClick={() => handleCloneMerchant()} />
            )}
            <Button type={'ok'} name={'Delete'} onClick={() => modalRef?.current?.handleShow()} />
            <Button type={'ok'} name={'Export Settlement'} onClick={() => modalExportRef?.current?.handleShow()} />
            <Button
              type={'ok'}
              name={'Back'}
              onClick={() => navigate(routerLinks('Merchant'), { state: { ...filter } })}
            />
          </div>
        </div>

        <Tabs activeKey={toggleState} onChange={handleChangeState}>
          {objDetail.map((item) => {
            return isHideServiceTabs(merchant, item) ? null : (
              <Tabs.TabPane tab={item?.title} key={item?.key}>
                {item?.content}
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
      <Modal
        ref={modalRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        textSubmit={'AGREE'}
        widthModal={400}
        title={() => 'Delete Merchant?'}
        onOk={handleDeleteMerchant}
      >
        <p className="">
          This Merchant will be remove from the app. You can not restore this Merchant, Are you sure you want to do
          this?.
        </p>
      </Modal>
      <Modal
        ref={modalExportRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        textSubmit={'AGREE'}
        widthModal={400}
        title={() => 'EXPORT SETTLEMENT'}
        onOk={handleExport}
      >
        <Form
          columns={[
            {
              title: 'Date Range',
              name: 'dateRange',
              formItem: {
                type: 'date_range',
              },
            },
          ]}
          form={form}
          values={{ dateRange: [firstDay, lastDay] }}
        />
      </Modal>
    </Spin>
  );
};
export default Page;
