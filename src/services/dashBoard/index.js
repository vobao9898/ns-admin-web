import axios from 'axios';
import { Message } from 'components';

const DashBoardService = {
  getMerchant: async (params) => {
    if (params?.filter) {
      params = {
        ...params,
        ...params?.filter,
      };
    }

    try {
      const { data } = await axios.get('/AdminDashboard/merchant', { params });
      return {
        count: data?.count,
        data: data?.data || [],
        summary: data?.summary,
      };
    } catch (e) {
      return false;
    }
  },

  getAppointment: async (params) => {
    if (params?.filter) {
      params = {
        ...params,
        ...params?.filter,
      };
    }

    try {
      const { data } = await axios.get('/AdminDashboard/appointment', { params });
      return {
        count: data?.count,
        data: data?.data || [],
        summary: data?.summary,
      };
    } catch (e) {
      return false;
    }
  },

  getTransaction: async (params) => {
    if (params?.filter) {
      params = {
        ...params,
        ...params?.filter,
      };
    }

    try {
      const { data } = await axios.get('/AdminDashboard/paymentTransaction', { params });
      return {
        count: data?.count,
        data: data?.data || [],
        summary: data?.summary,
      };
    } catch (e) {
      return false;
    }
  },

  getGifCard: async (params) => {
    if (params?.filter) {
      params = {
        ...params,
        ...params?.filter,
      };
    }

    try {
      const { data } = await axios.get('/AdminDashboard/giftCard', { params });
      return {
        count: data?.count,
        data: data?.data || [],
        summary: data?.summary,
      };
    } catch (e) {
      return false;
    }
  },

  getConsumer: async (params) => {
    if (params?.filter) {
      params = {
        ...params,
        ...params?.filter,
      };
    }

    try {
      const { data } = await axios.get('/AdminDashboard/consumer', { params });
      return {
        count: data?.count,
        data: data?.data || [],
        summary: data?.summary,
      };
    } catch (e) {
      return false;
    }
  },

  getExport: async (params, link) => {
    if (params?.filter) {
      params = {
        ...params,
        ...params?.filter,
      };
    }
    params.type = 'csv';
    const { data } = await axios.get(link, { params });
    if (!data.data) Message.error({ text: data.message });
    return data;
  },
};

export default DashBoardService;
