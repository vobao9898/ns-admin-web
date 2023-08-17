import { Message } from 'components';
import axios from 'axios';
import { routerLinks } from 'utils';
import { keyUser } from 'variable';

export const GiftCardService = {
  nameLink: 'GiftCard',
  getTemplates: async (params) => {
    if (params?.sorts) {
      for (const key in params?.sorts) {
        params.sortType = key;
        params.sortValue = params?.sorts[key].toLowerCase();
      }
    }
    params.row = params?.perPage || '10';
    params.key = params?.fullTextSearch || '';
    try {
      const { data } = await axios.get(routerLinks(GiftCardService.nameLink, 'api'), { params });
      const newData = data?.data?.map((item) => ({
        ...item,
        isDisabled: item?.isDisabled === 0 ? 'active' : 'inactive',
      }));
      return {
        count: data?.count,
        data: data?.data ? newData : [],
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  createTemplate: async (value) => {
    const user = JSON.parse(localStorage.getItem(keyUser));
    console.log(user);
    value = {
      fileId: (value?.imageUrl && value?.imageUrl[0]?.fileId) || 4034,
      giftCardTemplateName: value?.giftCardTemplateName,
      giftCardType: value?.giftCardType,
      isConsumer: value?.isConsumer ? 0 : 1,
      isDisabled: value?.isDisabled,

      // key swagger - nhung ko work
      // "userId": user?.userAdmin?.waUserId,
      // "createdDate": "",
      // "giftCardTemplateId": 0,
      // "imageUrl": value?.imageUrl && value?.imageUrl[0]?.url || ''
    };
    try {
      const { data } = await axios.post(routerLinks(GiftCardService.nameLink, 'api'), value);
      if (data?.data) {
        Message.success({ text: data?.message });
      } else Message.error({ text: data?.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  editTemplate: async (value, id) => {
    value = {
      giftCardTemplateId: id,
      giftCardTemplateName: value?.giftCardTemplateName,
      isDisabled: value?.isDisabled === 'active' ? 0 : 1,
      giftCardType: value?.giftCardType,
      isConsumer: value?.isConsumer ? 1 : 0,
      imageUrl: value?.imageUrl[0]?.url,
      fileId: value?.imageUrl[0]?.fileId || value?.fileId,
    };
    try {
      const { data } = await axios.put(routerLinks(GiftCardService.nameLink, 'api') + '/' + id, value);
      if (data?.data) {
        Message.success({ text: data?.message });
      }
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  updateStatus: async (type, id) => {
    try {
      const { data } = await axios.put('/giftcardtemplate/' + type + '/' + id);
      if (data?.data) {
        Message.success({ text: data?.message });
      }
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
