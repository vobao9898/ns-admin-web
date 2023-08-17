import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Message, Form, Spin } from 'components';

import { routerLinks } from 'utils';
import { ColumnLogin } from 'columns/auth';
import { UserService } from 'services/user';
import { useNavigate } from 'react-router-dom';

const Page = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const submit = async (values) => {
    try {
      setLoading(true);
      const res = await UserService.login({
        ...values,
      });
      console.log('From login:', res, routerLinks('Dashboard'));
      setLoading(false);
      if (res.data) {
        navigate(routerLinks('Verify'), { state: res.data.verifyCodeId });
      } else {
        Message.error({ text: res.message });
      }
    } catch (err) {
      console.log('Error is:', err);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="mb-8">
        <h1 className="intro-x text-4xl mb-3 font-bold">{t('routes.auth.login.title')}</h1>
      </div>
      <Spin spinning={loading}>
        <Form
          className="intro-x"
          columns={ColumnLogin({ t })}
          textSubmit={t('routes.auth.login.Log In')}
          handSubmit={submit}
        />
      </Spin>
    </Fragment>
  );
};

export default Page;
