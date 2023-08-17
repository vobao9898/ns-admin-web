import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAuth } from 'globalContext';
import { Form, Spin, Message } from 'components';
import { routerLinks } from 'utils';
import { UserService } from 'services/user';
import { ColumnVerify } from 'columns/auth';

const Page = () => {
  const { t } = useTranslation();
  const [mount, setMount] = useState(false);
  const auth = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initFunction = useCallback(async () => {
    await auth.logout();
  }, [auth]);

  useEffect(() => {
    if (!mount) {
      setMount(true);
      initFunction();
    }
  }, [mount, initFunction]);

  const submit = async (values) => {
    try {
      setLoading(true);
      const res = await UserService.verify(
        {
          ...values,
        },
        location.state,
      );

      setLoading(false);
      if (res.data) {
        auth.login(res.data);
        setTimeout(() => {
          navigate('/', { replace: true });
        });
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
        <h1 className="intro-x text-4xl mb-3 font-bold">{t('routes.auth.login.Verify')}</h1>
        <p className={'intro-x'}>Your account will be locked if you don&apos;t verify after 5 times</p>
      </div>
      <Spin spinning={loading}>
        <Form
          className="intro-x"
          columns={ColumnVerify({ t })}
          textSubmit={t('routes.auth.login.Verify')}
          handSubmit={submit}
        />
        <div className="mt-3 intro-x">
          <Link to={routerLinks('Login')}>{t('routes.auth.login.Another account')} ?</Link>
        </div>
      </Spin>
    </Fragment>
  );
};

export default Page;
