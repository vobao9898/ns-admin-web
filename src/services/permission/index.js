import axios from 'axios';

import { routerLinks } from 'utils';
import { Message } from 'components';

export const PermissionService = {
  nameLink: 'Permission',

  getPermission: async () => {
    try {
      const { data } = await axios.get(`${routerLinks(PermissionService.nameLink, 'api')}`);
      return data;
    } catch (e) {
      if (e?.response?.data?.message) Message.error({ text: e?.response?.data?.message });
      return false;
    }
  },
  putPermission: async (values) => {
    try {
      values[0].actions.map((i) => {
        delete i?.adminstrator;
        delete i?.manager;
        delete i?.staff1;
        delete i?.staff2;
        return i;
      });
      const { data } = await axios.put(`${routerLinks(PermissionService.nameLink, 'api')}`, values);
      if (data.message) Message.success(data.message);
      return data;
    } catch (e) {
      if (e?.response?.data?.message) Message.error(e?.response?.data?.message);
      return false;
    }
  },
};
