import axios from 'axios';
import { Message } from 'components';

export const PricingPlanService = {
  getPricingPlans: async (params) => {
    if (params.sorts) {
      for (const key in params.sorts) {
        params.sortType = key;
        params.sortValue = params?.sorts[key].toLowerCase();
      }
    }
    params.row = params?.perPage || '10';
    try {
      const { data } = await axios.get('/package', { params });
      return {
        count: data?.count,
        data: data?.data,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
