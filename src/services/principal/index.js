import axios from 'axios';
import { Message } from 'components';

export const PrincipalService = {
  nameLink: 'Principal',
  getState: async () => {
    const { data } = await axios.get('/State');
    return data;
  },
  getPrincipals: async (params) => {
    if (params?.sort) {
      if (typeof params?.sort === 'string') {
        params.sort = JSON.parse(params?.sort);
      }
      if (params.sort) {
        for (const key in params.sort) {
          params.sortValue = key;
          params.sortType = params.sort[key].toLowerCase();
        }
      }
      delete params.sort;
    } else {
      delete params.sortValue;
      delete params.sortType;
      delete params.sort;
    }
    const { data } = await axios.get('/Principal', { params });
    return {
      data: data?.data || [],
      count: data?.count,
    };
  },
  update: async (value, principalId, parentId, oldData) => {
    value = {
      ...value,
      principalId: oldData?.principalId,
      fileId: value?.imageUrl[0]?.fileId || oldData?.fileId,
      imageUrl: value?.imageUrl[0]?.url,
      driverNumber: value?.driverLicense,
      homePhone: value?.codeHomePhone + ' ' + value?.homePhone,
      mobilePhone: value?.codeMobilePhone + ' ' + value?.mobilePhone,
      address: value?.addressPrincipal?.address,
      city: value?.addressPrincipal?.city,
      stateId: value?.addressPrincipal?.state,
      zip: value?.addressPrincipal?.zip,
      yearAddress: value?.yearAtThisAddress,
      ssn: value && value.ssn ? value.ssn.replaceAll('-', '') : '',
      oldData: '',
    };

    const { data } = await axios.put(`/Principal/${principalId}`, value);

    if (data?.data) {
      Message.success({ text: data?.text });
    } else {
      Message.error({ text: data?.message });
    }

    return data?.data || null;
  },
  create: async (values) => {
    const hPhone = values?.codeHomePhone ? `${values.codeHomePhone} ${values.homePhone}` : `+1 ${values.homePhone}`;
    const mPhone = values?.codeMobilePhone
      ? `${values.codeMobilePhone} ${values.mobilePhone}`
      : `+1 ${values.mobilePhone}`;

    const body = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      title: values?.title,
      ownerShip: values?.ownerShip,
      homePhone: hPhone,
      mobilePhone: mPhone,
      yearAddress: values?.yearAtThisAddress,
      ssn: values && values.ssn ? values.ssn.replaceAll('-', '') : '',
      birthDate: values?.birthDate,
      driverNumber: values?.driverLicense,
      fileId: values?.imageUrl[0]?.fileId,
      city: values?.addressPrincipal?.city,
      stateId: values?.addressPrincipal?.state,
      address: values?.addressPrincipal?.address,
      zip: values?.addressPrincipal?.zip,
      oldData: '',
      email: values?.email,
      stateIssued: values?.stateIssued,
    };

    const { data } = await axios.post(`/Principal/`, body);

    return data;
  },
  getById: async (id) => {
    const { data } = await axios.get(`/Principal/${id}`);
    return data?.data || null;
  },
  getMerchants: async (params, principalId) => {
    let filters =
      params?.isTest === -1 || params?.isTest === '-1'
        ? {}
        : {
            istest: params?.isTest,
          };

    if (params.isDisabled && params.isDisabled !== '-1') {
      filters = {
        ...filters,
        status: params.isDisabled,
      };
    }

    if (params.merchantType && params.merchantType !== '-1') {
      filters = {
        ...filters,
        merchanttype: params.merchantType,
      };
    }

    params = {
      page: params?.page || '1',
      row: params?.perPage || '10',
      filters,
    };

    const { data } = await axios.get(`/Principal/${principalId}/merchants`, { params });
    return {
      data: data?.data || [],
      count: data?.count,
    };
  },
  exportPrincipalById: async (id) => {
    const { data } = await axios.get(`/Principal/exportDetail/${id}?type=pdf`);
    return data?.data;
  },
  briefPrincipal: async (key, merchantId) => {
    const { data } = await axios.get(`/Principal/brief?key=${key}&merchantId=${merchantId}`);
    return data?.data;
  },
};
