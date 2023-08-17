import axios from 'axios';
import { Message } from 'components';

export const MarketPlaceService = {
  nameLink: 'Market Place',
  getMarketPlaces: async (params, status) => {
    params = {
      ...params,
      key: params?.fullTextSearch || '',
      row: params?.perPage || '10',
      isDisabled: params?.isDisabled || status || '-1',
    };
    try {
      const { data } = await axios.get('/MarketPlace/search', { params });
      return {
        data: data?.data || [],
        count: data?.count,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  createMarket: async (value) => {
    value = {
      name: value?.name,
      link: value?.link,
      onTop: value?.onTop,
      isDisabled: value?.isDisabled === 'active' ? 0 : 1,
      fileId: value?.fileURL[0]?.fileId,
      fileURL: value?.fileURL[0]?.url,
    };
    try {
      const { data } = await axios.post('/MarketPlace', value);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
    }
  },
  editBrand: async (value, id, brand) => {
    value = {
      marketPlaceId: id,
      name: value?.name,
      link: value?.link,
      onTop: value?.onTop,
      isDisabled: value?.isDisabled,
      fileURL: value?.fileURL[0]?.thumbUrl || brand?.fileURL,
      fileId: value?.fileURL[0]?.fileId || brand?.fileId,
    };
    try {
      const { data } = await axios.put('/MarketPlace', value);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
