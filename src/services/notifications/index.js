import axios from 'axios';
import { Message } from 'components';

const NotificationServices = {
  getNotifications: async (params) => {
    params = {
      page: params?.page || '1',
      row: params?.row || '10',
    };
    try {
      const { data } = await axios.get('/Notification', { params });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
  deleteNotification: async (notificationId) => {
    try {
      const { data } = await axios.delete('/Notification/' + notificationId);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error(e.response.data.message);
      return false;
    }
  },
};

export default NotificationServices;
