import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import moment from 'moment';
import 'moment/locale/vi';

import { keyRefreshToken, keyToken, keyUser } from 'variable';
import NotificationServices from 'services/notifications';

export const AuthContext = React.createContext({
  user: {},
  notificationGlobals: {},
  permission: {},
  title: '',
  formatDate: 'YYYY-MM-DD',
  setTitlePage: () => {},
  login: () => {},
  logout: () => {},
  changeLanguage: () => {},
  changePermission: () => {},
  changeUserInformation: () => {},
  getNotificationsGlobals: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const Global = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(keyUser)));
  const [title, setTitle] = useState('');
  const [locale, set_locale] = useState();
  const [permission, set_permission] = useState({});
  const [formatDate, set_formatDate] = useState('MM-DD-YYYY');
  const [notificationGlobals, setNotifications] = useState({});
  const { t, i18n } = useTranslation();

  const login = (data) => {
    const dataUser = {
      ...data,
      userAdmin: {
        firstName: data?.userAdmin?.firstName,
        lastName: data?.userAdmin?.lastName,
        waUserId: data?.userAdmin?.waUserId,
        imageUrl: data?.userAdmin?.imageUrl,
        roleName: data?.userAdmin?.roleName,
      },
    };
    localStorage.setItem(keyUser, JSON.stringify(dataUser));
    setUser(data);
    localStorage.setItem(keyToken, data.token);
    localStorage.setItem(keyRefreshToken, data.refreshToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(keyUser);
  };

  const getNotificationsGlobals = useCallback(async () => {
    const data = await NotificationServices.getNotifications({ page: '1', row: '10' });
    setNotifications({ data: data?.data, count: data?.count });
  }, []);

  const changeUserInformation = (data) => {
    data = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      waUserId: data?.waUserId,
      imageUrl: data?.imageUrl,
      roleName: data?.roleName,
    };
    localStorage.setItem(
      keyUser,
      JSON.stringify({
        ...user,
        userAdmin: data,
      }),
    );
    setUser({
      ...user,
      userAdmin: data,
    });
    console.log(data);
  };

  const setTitlePage = useCallback(
    (name) => {
      document.title = t(name);
      setTitle(name);
    },
    [t],
  );

  const changeLanguage = useCallback(
    (values) => {
      i18n.changeLanguage(values);
      axios.defaults.headers.common['X-localization'] = values;
      moment.locale(values);
      switch (values) {
        case 'vi':
          set_locale(viVN);
          set_formatDate('MM-DD-YYYY');
          break;
        default:
          set_locale(enUS);
          set_formatDate('MM-DD-YYYY');
      }
    },
    [i18n],
  );

  const changePermission = (value) => {
    set_permission(value);
  };

  const clearTempLocalStorage = () => {
    const arr = [];
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).indexOf('temp-') === 0) {
        arr.push(localStorage.key(i));
      }
    }
    for (let i = 0; i < arr.length; i++) {
      localStorage.removeItem(arr[i]);
    }
  };

  useEffect(() => {
    changeLanguage(localStorage.getItem('i18nextLng'));
    clearTempLocalStorage();
    const token = localStorage.getItem(keyToken);
    if (token) {
      axios.defaults.headers.common.Authorization = 'Bearer ' + token;
    }
  }, [user, changeLanguage]);

  useEffect(() => {
    const token = localStorage.getItem(keyToken);
    if (token) {
      getNotificationsGlobals();
    }
  }, [getNotificationsGlobals, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        notificationGlobals,
        permission,
        title,
        formatDate,
        setTitlePage,
        login,
        logout,
        changeLanguage,
        changePermission,
        changeUserInformation,
        getNotificationsGlobals,
      }}
    >
      <ConfigProvider locale={locale}>{children}</ConfigProvider>
    </AuthContext.Provider>
  );
};
export default Global;
