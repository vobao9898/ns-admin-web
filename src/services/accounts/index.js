import axios from 'axios';
import { Message } from 'components';
import moment from 'moment';

const AccountService = {
  getStates: async () => {
    try {
      const { data } = await axios.get('/State');
      const states = data.data.map((item) => ({ label: item?.name, value: item?.stateId }));
      return { data: states };
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  getUsers: async (params, status) => {
    params = {
      page: params?.page || '1',
      row: params?.perPage || '10',
      key: params?.fullTextSearch || '',
      isDisabled: status,
      isGetBrief: params?.isGetBrief || false,
    };
    try {
      const { data } = await axios.get('/AdminUser', { params });
      return {
        data: data?.data || [],
        count: data?.count,
        pages: data?.pages,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getUsersBrief: async (params) => {
    params = {
      page: '0',
    };
    try {
      const { data } = await axios.get('/AdminUser', { params });
      return {
        data: data?.data || [],
        count: data?.count,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getUserById: async (id) => {
    try {
      const { data } = await axios.get('/AdminUser/' + id);
      return data?.data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  editUser: async (value, id) => {
    try {
      const { data } = await axios.put('/AdminUser/' + id, value);
      if (data.data) {
        Message.success({ text: data.message });
      }
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  createUser: async (value) => {
    try {
      value.code = value?.code || '+1';
      value = {
        ...value,
        birthDate: moment(value?.birthDate).format('L'),
        waRoleId: value?.waRoleId,
        fileId: value?.fileId ? value?.fileId[0].fileId : 0,
        zip: 'string',
        phone: value?.code + ' ' + value?.phone,
      };
      const { data } = await axios.post('/AdminUser', value);
      if (data.data) Message.success({ text: data.message });
      else Message.error({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  enableUser: async (id) => {
    try {
      const { data } = await axios.put('/AdminUser/enable/' + id);
      if (data.data) Message.success({ text: data.message });
      else Message.error({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  disableUser: async (id) => {
    try {
      const { data } = await axios.delete('/AdminUser/' + id);
      if (data.data) Message.success({ text: data.message });
      else Message.error({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  changePassword: async (value, id) => {
    try {
      const { data } = await axios.put('/AdminUser/changepassword/' + id, value);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getMerchantLog: async (params, filterParams) => {
    try {
      const { data } = await axios.get('/MerchantApprovalLog', {
        params: {
          row: params?.perPage,
          ...params,
          ...filterParams,
          timeEnd: filterParams.timeEnd ? new Date(filterParams.timeEnd) : null,
          timeStart: filterParams.timeStart ? new Date(filterParams.timeStart) : null,
        },
      });
      return {
        data: data?.data ? data?.data : [],
        count: data?.count,
      };
    } catch (e) {
      console.log(e);
      if (e.response?.data?.message) Message.error({ text: e.response?.data?.message });
      return false;
    }
  },
  getDepartment: async (params) => {
    params = {
      key: params?.fullTextSearch || '',
    };
    try {
      const { data } = await axios.get('/Department', { params });
      return {
        data: data?.data || [],
        count: data?.count,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  createDepartment: async (value) => {
    try {
      value = {
        ...value,
        departmentName: value?.departmentName,
        memberIds: value?.members,
      };
      console.log(value);
      const { data } = await axios.post('/Department', value);
      if (data.data) Message.success({ text: data.message });
      else Message.error({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  editDepartment: async (value, id) => {
    value = {
      departmentName: value?.departmentName,
      memberIds: value?.members,
    };
    const { data } = await axios.put('/Department/' + id, value);
    return data;
  },
  editDepartmentArchive: async (id) => {
    const { data } = await axios.put('/Department/archive/' + id);
    return data;
  },
  editDepartmentRestore: async (id) => {
    const { data } = await axios.put('/Department/restore/' + id);
    return data;
  },
};

export default AccountService;
