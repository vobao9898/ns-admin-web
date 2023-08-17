import React, { useState, useCallback, useEffect } from 'react';
import { Spin, Tabs } from 'antd';
import { Button, Title } from 'layouts/components';
import Information from './information';
import Logs from './logs';
import Merchants from './merchants';
import classNames from 'classnames';
import { PrincipalService } from 'services/principal';
import { routerLinks } from 'utils';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const Page = () => {
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState('information');
  const [filter] = useState(location?.state);
  const [principal, setPrincipal] = useState();
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPrincipal = useCallback(async () => {
    const data = await PrincipalService.getById(id);
    const stateRes = await PrincipalService.getState();
    if (!data) {
      navigate(routerLinks('Principal'), { state: { ...filter } });
      return;
    }

    formatPhone([data]);

    setState(stateRes.data);
    setPrincipal(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getPrincipal();
    }
  }, [id, getPrincipal]);

  const formatPhone = (principals) => {
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

  const clickPrincipal = () => {};

  const handleChange = async () => {
    setIsLoading(true);
    const data = await PrincipalService.getById(id);
    formatPhone([data]);
    setPrincipal(data);
    setIsLoading(false);
  };

  const objDetail = [
    {
      key: 'information',
      title: <p onClick={() => clickPrincipal()}>Information</p>,
      content: <Information id={id} principal={principal} state={state} handleChange={handleChange} />,
    },
    {
      key: 'merchants',
      title: <p onClick={() => clickPrincipal()}>Merchants</p>,
      content: <Merchants id={id} principal={principal} />,
    },
    {
      key: 'log',
      title: <p onClick={() => clickPrincipal()}>Logs</p>,
      content: <Logs logs={principal?.arrayOldData} />,
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

  // const modalExportRef = useRef();

  const handleChangeState = (key) => {
    localStorage.setItem('toggleState', JSON.stringify(key));
    setToggleState(key);
  };

  const renderFullName = (principal) => {
    if (!principal) return '';
    return `${principal?.firstName} ${principal?.lastName}`;
  };

  const handleExportPrincipal = async () => {
    setIsLoading(true);
    const data = await PrincipalService.exportPrincipalById(id);
    if (data) {
      window.open(data, '_blank');
    }
    setIsLoading(false);
  };

  return (
    <Spin spinning={isLoading}>
      <Title title={'Principal Profile'} breadcrumbs={breadcrumbs} />
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="mb-5 lg:flex justify-between items-center">
          <span className="text-lg font-bold text-black block lg:mb-0 mb-4">{renderFullName(principal)}</span>
          <div className={classNames('grid lg:grid-cols-2 gap-3 lg:mb-0 mb-4')}>
            <Button type={'ok'} name={'Export Principal'} onClick={handleExportPrincipal} />
            <Button
              type={'ok'}
              name={'Back'}
              onClick={() => navigate(routerLinks('Principal'), { state: { ...filter } })}
            />
          </div>
        </div>

        <Tabs activeKey={toggleState} onChange={handleChangeState}>
          {objDetail.map((item) => (
            <Tabs.TabPane tab={item?.title} key={item?.key}>
              {item?.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </Spin>
  );
};
export default Page;
