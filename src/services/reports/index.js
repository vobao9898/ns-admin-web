import axios from 'axios';
import { Message } from 'components';
import moment from 'moment';

const ReportService = {
  getBasic: async () => {
    try {
      const { data } = await axios.get('/Merchant/basicList');
      return data?.data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDevice: async (id) => {
    try {
      const { data } = await axios.get(`/Merchant/${id}/device-terminal`);
      return data?.data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getSettlementWaiting: async (params) => {
    try {
      params = { ...params, sn: params?.sn ? params.sn : 'null' };
      const { data } = await axios.get('/Settlement/getdatawaiting', { params });
      return data?.data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getTransactions: async (params) => {
    if (params?.filter) {
      params = {
        ...params,
        quickFilter: params?.filter?.quickFilter,
        status: params?.filter?.status,
        amountFrom: params?.filter?.amountFrom,
        amountTo: params?.filter?.amountTo,
        timeStart: params?.filter?.timeStart,
        timeEnd: params?.filter?.timeEnd,
      };
    }
    if (params?.sorts) {
      if (typeof params?.sorts === 'string') {
        params.sorts = JSON.parse(params?.sorts);
      }
      if (params.sorts) {
        for (const key in params.sorts) {
          params.sortValue = key;
          params.sortType = params.sorts[key].toLowerCase();
        }
      }
    } else {
      delete params?.sortValue;
      delete params?.sortType;
      delete params?.sorts;
    }
    params.row = params?.perPage || '10';
    params.key = params?.fullTextSearch || '';

    try {
      const { data } = await axios.get('/PaymentTransaction/search', { params });
      if (data?.data) {
        data.data = [
          ...data.data,
          {
            createDate: 'Total Transaction: ' + data?.count,
            amount: 'Total' + data?.summary?.amount,
          },
        ];
      }
      return {
        count: data?.count,
        data: data?.data || [],
        summary: data?.summary,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getTransactionsGiftCard: async (params, status) => {
    params.quickFilter = params?.quickFilter || status?.quickFilter || 'thisMonth';
    params.timeStart = params?.timeStart || status?.timeStart;
    params.timeEnd = params?.timeEnd || status?.timeEnd;

    if (params?.timeStart) {
      params.timeStart = params?.timeStart && moment(params?.timeStart)?.format('L');
      params.timeEnd = params?.timeEnd && moment(params?.timeEnd)?.format('L');
    }

    if (params?.quickFilter !== 'all') {
      params.timeStart = '';
      params.timeEnd = '';
    }

    params.amountFrom = params?.amountFrom || status?.amountFrom;
    params.amountTo = params?.amountTo || status?.amountTo;
    if (params?.amountFrom === 0 && params?.amountTo === 2000) {
      params.amountFrom = '-1';
      params.amountTo = '-1';
    }

    params.row = params?.perPage || '10';
    params.key = params?.fullTextSearch || '';
    try {
      const { data } = await axios.get('/P2PGiftCard/transaction', { params });
      return {
        ...data,
        data: data?.data || [],
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  closeSettlement: async (settlementWaiting, terminal, note, currentObj) => {
    const value = {
      ...settlementWaiting,
      note,
      // responseData: {},
      // businessName: 'string',
      // doBusinessName: 'string',
      TerminalId: terminal?.terminalId,
      chekout: settlementWaiting?.checkout,
      discount: settlementWaiting?.discount,
      isConnectPax: settlementWaiting?.isConnectPax,
      merchantId: currentObj?.merchant,
      otherPayment: settlementWaiting?.otherPayment,
      otherPaymentStatistic: settlementWaiting?.otherPaymentStatistic,
      paymentByCash: settlementWaiting?.paymentByCash,
      paymentByCashStatistic: settlementWaiting?.paymentByCashStatistic,
      paymentByCreditCard: settlementWaiting?.paymentByCreditCard,
      paymentByHarmony: settlementWaiting?.paymentByHarmony,
      paymentTerminal: settlementWaiting?.paymentTerminal,
      total: settlementWaiting?.total,
    };
    try {
      const { data } = await axios.post('/Settlement/', value);
      if (data.codeNumber !== 200) Message.error({ text: data.message });
      else Message.success({ text: data.message });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getMerchantBatchSettlements: async (params) => {
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
    params.key = params?.fullTextSearch || null;
    try {
      const { data } = await axios.get('/Settlement', { params });
      data?.data.push({
        settlementId: -1,
        settlementDate: 'Total Transaction: ' + data?.count,
        paymentByHarmony: data?.summary?.paymentByHarmony,
        paymentByCreditCard: data?.summary?.paymentByCreditCard,
        paymentByCash: data?.summary?.paymentByCash,
        paymentByGiftcard: data?.summary?.paymentByGiftcard,
        otherPayment: data?.summary?.otherPayment,
        discount: data?.summary?.discount,
        total: data?.summary?.total,
      });
      return {
        ...data,
        data: data?.data || [],
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getBatchById: async (id) => {
    try {
      const { data } = await axios.get('/Settlement/' + id);
      data?.data.push({
        transactionId: -1,
        amount: data?.summary?.totalAmount,
      });
      return { ...data, data: data?.data };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getGiftCardSolds: async (params, status) => {
    if (params?.sorts) {
      if (typeof params?.sorts === 'string') {
        params.sorts = JSON.parse(params?.sorts);
      }
      if (params.sorts) {
        for (const key in params.sorts) {
          params.sortValue = key;
          params.sortType = params.sorts[key].toLowerCase();
        }
      }
    } else {
      delete params?.sortValue;
      delete params?.sortType;
      delete params?.sorts;
    }

    params.quickFilter = params?.quickFilter || status || 'thisMonth';
    if (params?.quickFilter !== 'custom') {
      params.timeStart = '';
      params.timeEnd = '';
    }
    params.key = params?.fullTextSearch || '';
    params.row = params?.perPage || '10';
    try {
      const { data } = await axios.get('/GiftCard/sold', { params });
      if (data?.data) {
        data.data = [
          ...data.data,
          {
            date: 'Total Transaction: ' + data?.count,
            quantity: 'Total Quantity: ' + data?.summary?.quantity,
            amount: 'Total Amount: $' + data?.summary?.amount,
          },
        ];
      }
      return {
        data: data?.data || [],
        count: data?.count,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getGiftCardSoldById: async (id, params) => {
    const date = JSON.parse(window.localStorage.getItem('giftcardsold-date'));
    params = {
      date,
      page: params?.page || '1',
      row: params?.perPage || '10',
    };
    try {
      const { data } = await axios.get('/GiftCard/sold/' + id, { params });
      if (data?.data) {
        data.data = [
          ...data.data,
          {
            giftCardId: 'Total Row: ' + data?.count,
            value: 'Total' + data?.summary?.amount,
          },
        ];
      }
      return {
        data: data?.data || [],
        count: data?.count,
        summary: data?.summary,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getGiftCardTransactions: async (params, type) => {
    params.page = params?.page || '1';
    params.row = params?.perPage || '10';
    params.key = params?.fullTextSearch || '';
    params.quickFilter = params?.quickFilter || 'thisMonth';
    params.type = type;

    const url = `/GiftCard/giftCardTransaction`;
    const config = {
      params,
    };

    const { data } = await axios.get(url, config);

    if (data?.codeNumber !== 200) {
      Message.error({ text: data?.message });
    }

    return {
      data: data?.data || [],
      count: data?.count,
    };
  },
  exportGiftCardTransactions: async (params, type) => {
    params.page = params?.page || '1';
    params.row = params?.perPage || '10';
    params.key = params?.fullTextSearch || '';
    params.quickFilter = params?.quickFilter || 'thisMonth';
    params.exportType = params?.exportType || 'excel';
    params.type = type;

    const url = `/GiftCard/export/giftCardTransaction`;
    const config = {
      params,
    };

    const { data } = await axios.get(url, config);

    if (data?.codeNumber !== 200) {
      Message.error({ text: data?.message });
    }

    return data?.data;
  },
  transactionRefund: async (id) => {
    const { data } = await axios.put(`/PaymentTransaction/refund/${id}`);

    if (data && data.codeNumber === 200) {
      Message.success({ text: data?.message || 'Success.' });
      return data?.data;
    }

    Message.error({ text: data?.message });

    return null;
  },
};

export default ReportService;
