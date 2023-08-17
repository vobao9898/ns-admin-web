import axios from 'axios';
import { Message } from 'components';

export const TicketService = {
  nameLink: 'Ticket',
  getTickets: async (params, idRequest, name) => {
    params = {
      page: params?.page || '1',
      row: params?.perPage || '10',
      keySearch: params?.fullTextSearch || '',
      status: params?.status || 'all',
    };
    try {
      const { data } = await axios.get('/Ticket', { params });
      const total = {
        frontColor: '#000',
        backgroundColor: '#f3f3f4',
        allowActions: { allowCreate: false, allowEdit: true },
        id: '5',
        name: 'Total tickets',
        tasks: [],
      };
      const backlog = {
        frontColor: '#ffffff',
        backgroundColor: '#cccccc',
        allowActions: { allowCreate: false, allowEdit: true },
        id: '1',
        name: name === 'dashboard' ? 'Backlog tickets' : 'Backlog',
        tasks: [],
      };
      const waiting = {
        frontColor: '#ffffff',
        backgroundColor: '#4a90e2',
        allowActions: { allowCreate: false, allowEdit: true },
        id: '2',
        name: name === 'dashboard' ? 'Waiting tickets' : 'Waiting',
        tasks: [],
      };

      const inprogress = {
        frontColor: '#ffffff',
        backgroundColor: '#f5a623',
        allowActions: { allowCreate: false, allowEdit: true },
        id: '3',
        name: name === 'dashboard' ? 'Inprogress tickets' : 'Inprogress',
        tasks: [],
      };

      const complete = {
        frontColor: '#ffffff',
        backgroundColor: '#d0021b',
        allowActions: { allowCreate: false, allowEdit: true },
        id: '4',
        name: name === 'dashboard' ? 'Complete tickets' : 'Complete',
        tasks: [],
      };
      data &&
        data.data &&
        data.data.map((item) => {
          if (name === 'dashboard') total.tasks = [...total.tasks, item];
          if (item.status === 'backlog') backlog.tasks = [...backlog.tasks, item];
          if (item.status === 'waiting') waiting.tasks = [...waiting.tasks, item];
          if (item.status === 'inprogress') inprogress.tasks = [...inprogress.tasks, item];
          if (item.status === 'complete') complete.tasks = [...complete.tasks, item];
          return item;
        });
      const dataStemp = [backlog, waiting, inprogress, complete];
      const dataStemps = [total, backlog, waiting, inprogress, complete];
      return {
        data: name === 'dashboard' ? dataStemps : dataStemp,
        count: data.count,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getTicketById: async (id) => {
    try {
      const { data } = await axios.get('/Ticket/' + id);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getComments: async (id) => {
    try {
      const { data } = await axios.get(`/Ticket/${id}/comment`);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  addComment: async (id, comment) => {
    try {
      const { data } = await axios.post(`/Ticket/${id}/comment`, comment);
      if (data.data) Message.success({ text: data.message });
      else Message.error({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getActivity: async (id) => {
    try {
      const { data } = await axios.get(`/Ticket/${id}/activity`);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getTicketsTable: async (params, id) => {
    const sortValue = params?.sorts ? Object.keys(params?.sorts)[0] : undefined;
    const sortType = params?.sorts ? Object.values(params?.sorts)[0] : undefined;

    params = {
      ...params,
      page: params?.page || '1',
      row: params?.perPage || '10',
      keySearch: params?.fullTextSearch || '',
      sortValue,
      sortType,
      status: id || 'all',
    };
    try {
      const { data } = await axios.get('/Ticket', { params });
      return {
        data: data?.data ? data.data : [],
        count: data?.count,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  changeStatus: async (id, status) => {
    let newStatus = 'backlog';
    switch (status) {
      case 1:
        newStatus = 'backlog';
        break;
      case '2':
        newStatus = 'waiting';
        break;
      case '3':
        newStatus = 'inprogress';
        break;
      case '4':
        newStatus = 'complete';
        break;
      default:
        break;
    }
    try {
      const { data } = await axios.put(`/Ticket/${id}/stateChange`, { status: newStatus });
      if (data.data) Message.success({ text: data.message });
      else Message.error({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  changeStatusTable: async (id, status) => {
    try {
      const { data } = await axios.put(`/Ticket/${id}/stateChange`, { status });
      if (data.data) Message.success({ text: data.message });
      else Message.error({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  createTicket: async (value, merchantId) => {
    const fileIds = value?.ticketAttachFiles?.map((item) => item.fileId);
    const ticket = {
      title: value?.title,
      description: value?.description,
      clientApp: value?.clientApp,
      clientName: value?.clientName,
      status: value?.status,
      requestBy: value?.requestBy,
      merchantId: value?.merchantId ? value?.merchantId : merchantId,
      fileIds,
    };
    try {
      const { data } = await axios.post('/Ticket', ticket);
      if (data.data) Message.success({ text: data.message });
      else Message.error({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  deleteTicket: async (id) => {
    try {
      const { data } = await axios.delete('/Ticket/' + id);
      if (data.data) Message.success({ text: data.message });
      else Message.error({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getBasicListRes: async () => {
    try {
      const { data } = await axios.get('/Merchant/basicList');
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  editTicket: async (value, id) => {
    value = {
      clientApp: value?.clientApp,
      clientName: value?.clientName,
      description: value?.description,
      requestBy: value?.requestedBy,
      status: value?.status,
      title: value?.title,
    };

    try {
      const { data } = await axios.put('/Ticket/' + id, value);
      if (data.data) Message.success({ text: data.message });
      else Message.error({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getUser: async () => {
    try {
      const { data } = await axios.get('/AdminUser', { params: { page: 0 } });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
