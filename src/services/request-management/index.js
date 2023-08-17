import axios from 'axios';
import moment from 'moment';
import { Message } from 'components';

export const RequestManagementService = {
  getState: async () => {
    try {
      const { data } = await axios.get('/State');
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getPendings: async (params) => {
    params = {
      page: params?.page || '1',
      row: params?.perPage || '10',
      status: params?.status,
      key: params?.fullTextSearch || '',
    };
    try {
      const { data } = await axios.get('/Merchant/pending', {
        params,
      });
      return {
        count: data?.count,
        data: data.data || [],
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getPendingById: async (id) => {
    try {
      const { data } = await axios.get('/Merchant/' + id);
      if (!data?.data) Message.error({ text: data?.message });
      return {
        data: data?.data,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  editPending: async (value, pending, id) => {
    const updatePrincipals =
      value?.principals &&
      value?.principals?.map((item) => {
        return {
          ...item,
          position: item.title,
          ssn: item?.ssn ? item.ssn.replaceAll('-', '') : '',
          homePhone: (item?.codeHomePhone || '+1') + ' ' + item?.homePhone,
          mobilePhone: (item?.codeMobilePhone || '+1') + ' ' + item?.mobilePhone,
          yearAtThisAddress: item.yearAddress,
          dateOfBirth: moment(item.birthDate).format('MM/DD/YYYY'),
          driverLicense: item.driverNumber,
          fileId: item?.imageUrl[0]?.fileId || item?.fileId || 0,
          addressPrincipal: {
            address: item.address,
            city: item.city,
            state: item.stateId,
            zip: item.zip,
          },
        };
      });

    const updateValue = {
      loading: true,
      progress: false,
      progressPrincipal: false,
      isSubmitting: false,
      ID: pending.merchantId,
      businessInfo: {
        question1: pending?.business[0],
        question2: pending?.business[1],
        question3: pending?.business[2],
        question4: pending?.business[3],
        question5: pending?.business[4],
      },
      generalInfo: {
        ...value?.generalInfo,
        generalId: pending?.general.generalId,
        status: pending?.general.status,
        businessAddress: {
          ...value?.generalInfo?.businessAddress,
          state: value?.generalInfo?.businessAddress?.stateId,
        },
        stateId: value?.generalInfo?.businessAddress?.stateId,
        businessPhone: (value?.generalInfo?.codePhoneBusiness || '+1') + ' ' + value?.generalInfo?.phoneBusiness,
        contactPhone: (value?.generalInfo?.codePhoneContact || '+1') + ' ' + value?.generalInfo?.phoneContact,
        merchantId: pending?.merchantId,
        reviewLink: null,
        sendReviewLinkOption: 'manual',
        latitude: null,
        longitude: null,
        businessName: value.generalInfo?.legalBusinessName,
        doingBusiness: value.generalInfo?.doBusinessName,
        email: value?.generalInfo?.emailContact,
        position: value?.generalInfo?.title,
      },
      bankInfo: {
        ...value?.bankInfo,
        fileId: value?.bankInfo?.imageUrl[0]?.fileId,
        bankName: value?.bankInfo?.name,
        businessBankId: pending?.businessBank.businessBankId,
        dda: null,
        oldFiles: null,
        merchantId: pending?.merchantId,
        imageUrl: value?.bankInfo?.imageUrl[0]?.url || value?.bankInfo?.imageUrl,
        imageUrlOldFiles: null,
      },
      principalInfo: updatePrincipals,
      currentRate: {
        TransactionsFee: pending?.transactionsFee,
        DiscountRate: pending?.discountRate,
      },
      packagePricing: '3',
      type: value.type,
      path: '/app/merchants/pending/profile',
    };

    try {
      const { data } = await axios.put('/Merchant/' + id, updateValue);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  updateStatus: async (status, id) => {
    try {
      const { data } = await axios.put('/Merchant/updateStatus/' + id, status);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  rejectPending: async (value, id) => {
    try {
      const { data } = await axios.put('/Merchant/reject/' + id, {
        merchantId: id,
        path: '/app/merchants/pending',
        reason: value.reason,
      });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  acceptPending: async (value, id) => {
    try {
      const { data } = await axios.put('Merchant/approve/' + id, {
        ...value,
        merchantToken: '',
        timezone: '',
        totalAmountLimit: 0,
        pointRate: 0,
        turnAmount: 0,
        isTop: true,
        isTest: true,
        isCashDiscount: true,
        cashDiscountPercent: 0,
        isWareHouse: value?.isWareHouse || false,
        merchantId: id,
        path: '/app/merchants/pending',
      });
      if (data?.data) {
        Message.success({ text: data?.message });
      }
      if (!data?.data) {
        Message.error({ text: data?.message });
      }
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  // Approved
  getApproveds: async (params) => {
    params = {
      page: params?.page || '1',
      row: params?.perPage || '10',
      key: params?.fullTextSearch || '',
      approvedBy: params?.approvedBy || 0,
    };
    try {
      const { data } = await axios.get('/Merchant/search', { params });
      return {
        count: data?.count,
        data: data?.data || [],
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getApprovedById: async (id) => {
    try {
      const { data } = await axios.get('/Merchant/' + id);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  // Rejected
  getRejecteds: async (params) => {
    if (typeof params?.sorts === 'string') {
      params.sorts = JSON.parse(params?.sorts);
    }
    if (params.sorts) {
      for (const key in params.sorts) {
        params.sortValue = key;
        params.sortType = params.sorts[key].toLowerCase();
      }
    }
    params.row = params?.perPage || '10';
    params.key = params?.fullTextSearch || '';
    params.rejectedBy = params?.rejectedBy || 0;
    try {
      const { data } = await axios.get('/Merchant/reject', { params });
      return {
        count: data?.count,
        data: data?.data || [],
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getRejectedById: async (id) => {
    try {
      const { data } = await axios.get('/Merchant/' + id);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  editReject: async (values, id) => {
    values = {
      edit: false,
      emailContact: values?.emailContact,
      legalBusinessName: values?.legalBusinessName,
      tax: values?.tax,
      address: values?.address,
      city: values?.city,
      stateId: values?.stateId,
      phoneBusiness: values?.phoneBusiness,
      zip: values?.zip,
      phoneContact: values?.phoneContact,
      firstName: values?.firstName,
      lastName: values?.lastName,
      title: values?.title,
      doBusinessName: values?.doBusinessName,
      stateName: values?.stateName,
      loading: true,
      dbaAddress: {
        Address: values?.Address,
        City: values?.City,
        State: values?.State,
        Zip: values?.Zip,
      },
      ID: +id - 7,
      merchantId: +id,
      path: '/app/merchants/rejected/profile',
    };
    try {
      const { data } = await axios.put('/general/' + id, values);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  deleteRejected: async (id) => {
    try {
      const { data } = await axios.delete('/Merchant/delete/' + id);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  revert: async (id) => {
    try {
      const { data } = await axios.put('/Merchant/restorepending/' + id);
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
