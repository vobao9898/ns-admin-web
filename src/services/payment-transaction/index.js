import axios from 'axios';
import { Message } from 'components';
import { routerLinks } from 'utils';

export const PaymentTransactionService = {
  nameLink: 'PaymentTransaction',
  get: async (params, id) => {
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
      delete params?.sortValue;
      delete params?.sortType;
      delete params?.sorts;

    }
    params.row = params?.perPage || '10';
    params.key = params?.fullTextSearch || '';
    try {
      const { data } = await axios.get(routerLinks(PaymentTransactionService.nameLink, 'api') + '/' + id, {
        params,
      });
      return {
        ...data,
        data: data?.data || [],
      };
    } catch (e) {
      console.log();
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
};
