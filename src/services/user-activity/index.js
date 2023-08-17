import axios from 'axios';
import { Message } from 'components';
import { routerLinks } from 'utils';

export const UserActivityService = {
  nameLink: 'UserActivity',
  get: async (params, id) => {
    params = {
      ...params,
      row: params?.perPage
    };
    try {
      const { data } = await axios.get(routerLinks(UserActivityService.nameLink, 'api') + '/' + id, {
        params,
      });
      return {
        ...data,
        data: data?.data || [],
      };
    } catch (e) {
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
};
