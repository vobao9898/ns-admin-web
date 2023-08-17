import React, { useState, Fragment, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'components/form';
import { Message, Wizard } from 'components';
import '../index.less';
import { useAuth } from 'globalContext';
import { ColumnBank, ColumnPricingPlan, ColumnGeneralAdd, ColumnBusiness, ColumnPrincipalAdd } from 'columns/merchant';
import { useNavigate, useLocation } from 'react-router';
import { routerLinks } from 'utils';
import Title from 'layouts/components/title';
import { Form as FormAnt, Spin } from 'antd';
import { Button } from 'layouts/components';
import { MerchantService } from 'services/merchant';

const AddMerchant = ({ location }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatDate, getNotificationsGlobals } = useAuth();
  const [current, setCurrent] = useState(0);
  const [isDesktop, set_isDesktop] = useState(window.innerWidth > 1330);
  const [isLoading, setIsLoading] = useState(false);
  const { state: status } = useLocation();
  const [filter] = useState(status);
  const [packages, setPackages] = useState();

  const [general, setGeneral] = useState();
  const [business, setBusiness] = useState({
    businessInfo: {
      question1: {
        isAccept: false,
      },
      question2: {
        isAccept: false,
      },
      question3: {
        isAccept: false,
      },
      question4: {
        isAccept: false,
      },
      question5: {
        isAccept: false,
      },
    },
  });
  const [bank, setBank] = useState();
  const [principals, setPrincipals] = useState({ principals: [{}] });
  const [pricingPlan, setPricingPlan] = useState();
  const [state, setState] = useState([]);
  const [packageId, setPackageId] = useState();
  const [form] = FormAnt.useForm();

  const getInit = useCallback(async () => {
    const data = await MerchantService.getState();
    const packageRes = await MerchantService.getPackage();
    const datas = packageRes?.data;
    const stemp = [];
    datas?.forEach((item) => {
      if (item?.isDisabled === 0) {
        stemp.push(item);
      }
    });
    setPackages(stemp);
    setState(data?.data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getInit();
    function handleResize() {
      if (window.innerWidth > 1024 && !isDesktop) {
        set_isDesktop(true);
      } else if (window.innerWidth <= 1024 && isDesktop) {
        set_isDesktop(false);
      }
    }
    window.addEventListener('resize', handleResize, true);
    return () => window.removeEventListener('resize', handleResize, true);
  }, [location, isDesktop, getInit]);

  const prev = () => {
    setCurrent(current - 1);
    if (current === 4) {
      const value = form.getFieldsValue('packagePricing');
      setPricingPlan(value);
    }
  };

  const submit = async (values) => {
    if (current === 0) {
      values.codePhoneBusiness = values?.codePhoneBusiness || '+1';
      values.codePhoneContact = values?.codePhoneContact || '+1';
      setGeneral(values);
    }
    if (current === 1) setBusiness({ businessInfo: values?.businessInfo });
    if (current === 2) setBank(values);
    if (current === 3) setPrincipals({ principals: values?.principals });
    if (current < 4) {
      setCurrent(current + 1);
    } else {
      // add , current === 4
      setIsLoading(true);
      const data = await MerchantService.addMerchant(general, business, bank, principals, values);
      if (data?.data) {
        Message.success({ text: data?.message });
        getNotificationsGlobals();
        navigate(routerLinks('Merchant'), { state: { ...filter } });
      } else Message.error({ text: data?.message });
      resetValue();
      setIsLoading(false);
    }
  };

  const resetValue = () => {
    setGeneral();
    setBusiness({
      businessInfo: {
        question1: {
          isAccept: false,
        },
        question2: {
          isAccept: false,
        },
        question3: {
          isAccept: false,
        },
        question4: {
          isAccept: false,
        },
        question5: {
          isAccept: false,
        },
      },
    });
    setBank();
    setPrincipals({ principals: [{}] });
    setPricingPlan();
  };

  const steps = [
    {
      title: 'General Information',
      content: (
        <Fragment>
          <div className="font-bold text-lg mb-4 text-blue-500">General Information</div>
          <Form
            form={form}
            columns={ColumnGeneralAdd({ t, formatDate, state, general, setGeneral })}
            textSubmit={'Next'}
            idSubmit={'submit-form'}
            handSubmit={submit}
            values={general}
          />
        </Fragment>
      ),
    },
    {
      title: 'Business Information',
      content: (
        <>
          <div className="font-bold text-lg mb-4 text-blue-500">Business Information</div>
          <Form
            columns={ColumnBusiness()}
            form={form}
            textSubmit={'Next'}
            idSubmit={'submit-form'}
            handSubmit={submit}
            values={business}
          />
        </>
      ),
    },
    {
      title: 'Bank Information',
      content: (
        <Fragment>
          <div className="font-bold text-lg mb-4 text-blue-500">Bank Information</div>
          <Form
            columns={ColumnBank({ t, formatDate })}
            textSubmit={'Next'}
            idSubmit={'submit-form'}
            handSubmit={submit}
            form={form}
            values={bank}
          />
        </Fragment>
      ),
    },
    {
      title: 'Principal Information',
      content: (
        <Fragment>
          <Form
            columns={ColumnPrincipalAdd({ state, setPrincipals, principals })}
            textSubmit={'Next'}
            idSubmit={'submit-form'}
            handSubmit={submit}
            form={form}
            values={principals}
          />
        </Fragment>
      ),
    },
    {
      title: 'Pricing Plan',
      content: (
        <>
          <div className="font-bold text-lg mb-4 text-blue-500">Package & Pricing</div>
          <Form
            columns={ColumnPricingPlan({ t, formatDate, packageId, packages })}
            textSubmit={'Submit'}
            idSubmit={'submit-form'}
            handSubmit={submit}
            form={form}
            values={pricingPlan}
            packageId={packageId}
            onFirstChange={(data) => {
              if (data?.packagePricing) {
                setPackageId(data?.packagePricing);
                const valueForm = form.getFieldValue();
                form.setFieldValue({ ...valueForm, additionStaff: 0, packagePricing: data?.packagePricing });
                setPricingPlan({ ...pricingPlan, additionStaff: 0, packagePricing: data?.packagePricing });
              }
            }}
          />
        </>
      ),
    },
  ];

  const breadcrumbs = [
    {
      name: 'Merchant List',
      path: 'Merchant',
    },
    {
      name: 'Add Merchant',
      path: 'AddMerchant',
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <Title title={'Merchant List'} breadcrumbs={breadcrumbs} />
      <div className="mb-4 text-lg w-full rounded-xl px-4 py-3 bg-white shadow-md">
        <div className={`w-full flex flex-wrap items-center demo my-5 text-white`}>
          <Wizard steps={steps} current={current} />
        </div>

        <div className="steps-content">
          {steps[current].content}
          <div className="absolute right-0 bottom-0">
            <Fragment>
              {current > 0 && <Button name="Previous" onClick={() => prev()} />}
              <Button
                name="Cancel"
                type="cancel"
                moreClass="ml-2"
                onClick={() => {
                  navigate(routerLinks('Merchant'), { state: { ...filter } });
                  resetValue();
                }}
              />
            </Fragment>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default AddMerchant;
