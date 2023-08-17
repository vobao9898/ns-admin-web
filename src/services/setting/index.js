import axios from 'axios';
import { Message } from 'components';
// import moment from 'moment';

const SettingService = {
  getTwilio: async () => {
    try {
      const { data } = await axios.get('/AdminSetting/twilio/');
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  putTwilio: async (value) => {
    const { data } = await axios.put('/AdminSetting/twilio/', value);
    return data?.data;
  },
  getSmtp: async () => {
    try {
      const { data } = await axios.get('/AdminSetting/smtp/');
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  putSmtp: async (value) => {
    const { data } = await axios.put('/AdminSetting/smtp/', value);
    return data?.data;
  },
  getGeneral: async () => {
    try {
      const { data } = await axios.get('/AdminSetting/general/');
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  putGeneral: async (value) => {
    const { data } = await axios.put('/AdminSetting/general/', value);
    return data?.data;
  },
  getMaintenance: async () => {
    try {
      const { data } = await axios.get('/AdminSetting/maintenance/');
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  putMaintenance: async (value) => {
    const { data } = await axios.put('/AdminSetting/maintenance?turnOn=' + value?.turnOn, value);
    return data;
  },
};

export default SettingService;
