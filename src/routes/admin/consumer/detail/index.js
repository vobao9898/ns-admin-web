import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Tabs } from 'antd';
import { Title, Button } from 'layouts/components';

import General from './general.js';
import Setting from './setting.js';
import Activities from './activities.js';
import Transactions from './transactions.js';
import { UserService } from '../../../../services/user';

const CustomerDetail = ({ location }) => {
  useEffect(() => {}, [location]);
  const { id } = useParams();
  const [data, set_data] = useState();

  useEffect(() => {
    getDetail();
  }, [id]);

  const getDetail = async () => {
    const { data } = await UserService.getById(id);
    data.id = data.userId;
    const [code, phone] = getInfoPhone(data?.phone);
    data.codePhone = code;
    data.phone = convertPhone(phone);
    set_data(data);
  };

  const convertPhone = (phone) => {
    phone = deleteDash(phone);
    return formatPhone(phone);
  };

  const getInfoPhone = (phone) => {
    phone = phone + '';
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

  const deleteDash = (phone) => {
    phone = phone + '';
    phone = phone.replaceAll('(', '');
    phone = phone.replaceAll(')', '');
    phone = phone.replaceAll('-', '');
    return phone;
  };

  const formatPhone = (phone) => {
    phone = phone + '';
    let result = '';
    phone = phone.replaceAll(' ', '');
    phone?.split('')?.map((char, i) => {
      if (i === 2 && phone?.length > 2) {
        result = result + char + ' ';
      } else if (i === 5 && phone?.length > 5) {
        result = result + char + '-';
      } else result = result + char;
      return char;
    });
    result = result.replaceAll(' ', '-');
    return result;
  };

  const objDetail = [
    {
      key: 'General',
      content: <General id={id} getDetail={getDetail} data={data} />,
    },
    {
      key: 'Transactions',
      content: <Transactions id={id} />,
    },
    {
      key: 'Activities',
      content: <Activities id={id} />,
    },
    {
      key: 'Setting',
      content: <Setting id={id} getDetail={getDetail} data={data} />,
    },
  ];

  const bread = [
    {
      name: 'Customer',
      path: 'Consumer',
    },
    {
      name: 'Detail',
    },
  ];

  return (
    <Fragment>
      <Title title="Consumer Detail" breadcrumbs={bread} />
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="mb-5 flex justify-between items-center">
          <span className="text-lg font-semibold text-black">ID : {data?.accountId}</span>
          <Button name="BACK" onClick={() => window.history.back()} />
        </div>

        <Tabs defaultActiveKey={'1'}>
          {objDetail.map((item, index) => (
            <Tabs.TabPane tab={item?.key} key={index + 1}>
              {item?.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </Fragment>
  );
};

export default CustomerDetail;
