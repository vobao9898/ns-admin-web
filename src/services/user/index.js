import axios from 'axios';

import { routerLinks } from 'utils';
import { Message } from 'components';
import { keyRefreshToken, keyToken } from '../../variable';

export const UserService = {
  nameLink: 'User',
  login: async (values) => {
    const { data } = await axios.post(`${routerLinks('AdminUser', 'api')}/Login`, values);
    return data;
  },
  verify: async (values, id) => {
    const { data } = await axios.post(`${routerLinks('AdminUser', 'api')}/verifycode/${id}`, values);
    return data;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem(keyRefreshToken);
    if (refreshToken) {
      const { data } = await axios.post(
        `${routerLinks('AdminUser', 'api')}/refresh-token`,
        {},
        { params: { refreshToken: 'Bearer ' + refreshToken } },
      );
      axios.defaults.headers.common.Authorization = 'Bearer ' + data.accessToken;
      localStorage.setItem(keyToken, data.accessToken);
      return data;
    }
    return null;
  },
  logout: async () => {
    const { data } = await axios.post(`${routerLinks('AdminUser', 'api')}/log-out`);
    return data;
  },
  get: async (params) => {
    if(params?.sorts){
      if (typeof params?.sorts === 'string') {
        params.sorts = JSON.parse(params?.sorts);
      }
      if (params.sorts) {
        for (const key in params.sorts) {
          params.sortValue = key;
          params.sortType = params.sorts[key].toLowerCase();
        }
      }
    }else{
      delete  params.sortValue;
      delete  params.sortType;
      delete  params.sorts;
    }
    const { data } = await axios.get(routerLinks(UserService.nameLink, 'api'), {
      params,
    });
    return {
      ...data,
      data: data && [...data.data, { ...data.summary, count: data.count, type: 'total' }],
    };
  },
  getById: async (id) => {
    const { data } = await axios.get(`${routerLinks(UserService.nameLink, 'api')}/${id}`);
    return data;
  },
  post: async (values) => {
    const { data } = await axios.post(routerLinks(UserService.nameLink, 'api'), values);
    if (data.message) Message.success({ text: data.message });
    return data;
  },
  put: async (values, id, parentId, oldData) => {
    // Tam thoi khong cho edit phone -> lay phone o oldData

    values.phone = (oldData?.codePhone || '+1') + oldData?.phone;
    values.phone = values?.phone.replaceAll('_', '');
    if (values?.phone[values?.phone?.length - 1] === '-') {
      values.phone = values?.phone.replaceAll('-', '');
    }

    // values.phone = values?.phone.replaceAll(' ', '-');
    const { data } = await axios.put(`${routerLinks(UserService.nameLink, 'api')}/update/${id}`, values);
    if (data.codeStatus) Message.success({ text: data?.message });
    else Message.error({ text: data?.message });
    return data;
  },
  putArchive: async (values, id) => {
    const { data } = await axios.put(`${routerLinks(UserService.nameLink, 'api')}/delete/${id}`, values);
    if (data.message) Message.success({ text: data.message });
    return data;
  },
  putRestore: async (id) => {
    const { data } = await axios.put(`${routerLinks(UserService.nameLink, 'api')}/restore/${id}`);
    if (data.message) Message.success({ text: data.message });
    return data;
  },

  delete: async (id) => {
    const { data } = await axios.delete(`${routerLinks(UserService.nameLink, 'api')}/${id}`);
    if (data.message) Message.success({ text: data.message });
    return data;
  },
};
