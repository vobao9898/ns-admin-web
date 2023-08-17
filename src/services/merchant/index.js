import axios from 'axios';
import { message } from 'antd';
import routerLinks from 'utils/router-links';
import { Message } from 'components';
import moment from 'moment';

export const MerchantService = {
  nameLink: 'Merchant',
  getState: async () => {
    const { data } = await axios.get('/State');
    return data;
  },
  getPackage: async () => {
    const { data } = await axios.get('/Package');
    return data;
  },
  postPackage: async (newMerchant) => {
    const { data } = await axios.post('/Package', newMerchant);
    return data;
  },
  putPackage: async (value, id) => {
    const { data } = await axios.put('/Package/' + id, value);
    return data?.data;
  },
  addMerchant: async (general, business, bank, principals, pricingPlan) => {
    // businessHour: {}, // set theo swagger
    const principalsList =
      principals?.principals &&
      principals?.principals?.map((item) => {
        const newPrincipal = {
          ...item,
          // position: item?.position,
          ssn: item?.ssn?.replaceAll('-', ''),
          title: item?.position,
          dateOfBirth: moment(item?.birthDate).format('MM/DD/YYYY'),
          fileId: item?.imageUrl[0]?.fileId,
          homePhone: (item?.codeHomePhone || '+1') + ' ' + item?.homePhone,
          mobilePhone: (item?.codeMobilePhone || '+1') + ' ' + item?.mobilePhone,
        };
        delete newPrincipal?.position;
        // delete newPrincipal?.title;
        delete newPrincipal?.undefined;
        delete newPrincipal?.codeHomePhone;
        delete newPrincipal?.codeMobilePhone;
        delete newPrincipal?.birthDate;
        delete newPrincipal?.imageUrl;

        return newPrincipal;
      });

    const newMerchant = {
      generalInfo: {
        ...general,
        businessPhone: general?.codePhoneBusiness + ' ' + general?.businessPhone,
        contactPhone: general?.codePhoneContact + ' ' + general?.contactPhone,
      },
      bankInfo: {
        ...bank,
        bankName: bank?.name,
        fileId: bank?.imageUrl[0]?.fileId,
      },
      principalInfo: principalsList,
      businessInfo: {
        question1: {
          ...business?.businessInfo?.question1,
          question: 'Has Merchant been previously identified by Visa/Mastercard Risk Programs?',
        },
        question2: {
          ...business?.businessInfo?.question2,
          question:
            'Has Merchant or any associated principal and/or owners disclosed below filed bankruptcy or been subject to any involuntary bankruptcy?',
        },
        question3: {
          ...business?.businessInfo?.question3,
          question: 'Will product(s) or service(s) be sold outside of US?',
        },
        question4: {
          ...business?.businessInfo?.question4,
          question: 'Has a processor ever terminated your Merchant account?',
        },
        question5: {
          ...business?.businessInfo?.question5,
          question: 'Have you ever accepted Credit/Debit cards before?',
        },
      },
      packagePricing: pricingPlan?.packagePricing,
      packageId: pricingPlan?.packageId,
      type: general?.type,
      // Ko co gia tri o add merchant
      mid: '',
      notes: '',
      terminalInfo: '',
      pricingType: '',
      additionStaff: pricingPlan?.packagePricing !== 3 ? 0 : pricingPlan.additionStaff,
      price: 0,
      currentRate: {
        discountRate: 0,
        transactionsFee: 0,
      },
    };
    delete newMerchant?.generalInfo?.SameAs;
    delete newMerchant?.generalInfo?.type;
    delete newMerchant?.generalInfo?.codePhoneBusiness;
    delete newMerchant?.generalInfo?.codePhoneContact;
    delete newMerchant?.bankInfo?.imageUrl;
    delete newMerchant?.bankInfo?.name;

    const { data } = await axios.post('/Merchant', newMerchant);
    return data;
  },
  cloneMerchant: async (merchantId) => {
    const { data } = await axios.post('/Merchant/clone/' + merchantId);
    return data;
  },
  deleteMerchant: async (merchantId) => {
    const { data } = await axios.delete('/Merchant/delete/' + merchantId);
    return data;
  },
  exportSettlement: async (merchantId, params) => {
    const { data } = await axios.get('/Settlement/export/monthly/' + merchantId, { params });
    return data;
  },
  exportMerchant: async (params) => {
    delete params.page;
    delete params.perPage;
    const { data } = await axios.get('/merchant/export', { params });
    if (!data?.data) {
      Message.error({ text: data?.message });
      return data;
    }
    return data;
  },
  getMerchants: async (params, id) => {
    params = {
      ...params,
      page: params?.page || '1',
      row: params?.perPage || '10',
      key: params?.fullTextSearch || '',
      isDisabled: params?.isDisabled || id?.status || '-1',
      merchantType: params?.merchantType || id?.merchantType || '-1',
      isTest: params?.isTest !== undefined ? params?.isTest : id?.isTest,
    };

    if (params?.sort) {
      if (typeof params?.sort === 'string') {
        params.sort = JSON.parse(params?.sort);
      }
    } else {
      delete params?.sort;
    }

    if (params?.sort && params?.sort?.isDisabled && params?.sort?.expiredDate) {
      params.sort = {
        isDisabled: params?.sort?.isDisabled,
        expiredDate: params?.sort?.expiredDate,
      };
    }

    const { data } = await axios.get('/Merchant/search', { params });

    return {
      data: data?.data || [],
      count: data?.count,
    };
  },
  getMerchantById: async (id) => {
    const { data } = await axios.get('/Merchant/' + id);
    if (!data?.data) {
      Message.error({ text: data?.message });
      return { data: data?.data };
    }
    return {
      data: data?.data,
    };
  },
  editGeneral: async (value, id, parentID, datas) => {
    const formatNumber = (num) => {
      num = num + '';
      if (num[num?.length - 1] === '.') num = num?.substring(0, num?.length - 1);
      if (num[0] === '+') num = num?.substring(1);
      return num;
    };
    value = {
      ...value,
      generalId: datas?.generalId,
      merchantId: datas?.merchantId,
      dbaAddress: {
        Address: value?.Address,
        City: value?.City,
        State: value?.State,
        Zip: value?.Zip,
      },
      phoneBusiness: value?.codePhoneBusiness + ' ' + value?.phoneBusiness,
      phoneContact: value?.codePhoneContact + ' ' + value?.phoneContact,
      longitude: formatNumber(value?.longitude),
      latitude: formatNumber(value?.latitude),
    };
    if (value?.Address) delete value.Address;
    if (value?.City) delete value.City;
    if (value?.Zip) delete value.Zip;
    const { data } = await axios.put('/General/' + datas?.generalId, value);
    if (data?.data) {
      Message.success({ text: data?.message });
    } else {
      Message.error({ text: data?.message });
    }
    return data;
  },
  editBusinessBank: async (newBank, bank, merchantId) => {
    newBank = {
      ...newBank,
      businessBankId: bank?.businessBankId || 0,
      fileId: newBank?.imageUrl[0]?.fileId || bank?.fileId,
      merchantId,
      imageUrl: newBank?.imageUrl[0]?.url || bank?.imageUrl,
      imageUrlOldFiles: [bank?.imageUrl],
      // set theo
      oldFiles: '',
      dda: '',
    };
    const { data } = await axios.put('/Merchant/businessbank/' + bank?.businessBankId, newBank);
    return data?.data;
  },
  editPrincipals: async (value, principalId, parentId, oldData) => {
    value = {
      ...value,
      principalId: oldData?.principalId,
      fileId: value?.imageUrl[0]?.fileId || oldData?.fileId,
      // merchantId: parentId,
      imageUrl: value?.imageUrl[0]?.url,
      state: {
        stateId: +value?.addressPrincipal?.state,
        // set theo swagger
        countryId: 0,
        name: '',
        stateCode: '',
      },
      driverNumber: value?.driverLicense,
      homePhone: value?.codeHomePhone + ' ' + value?.homePhone,
      mobilePhone: value?.codeMobilePhone + ' ' + value?.mobilePhone,
      address: value?.addressPrincipal?.address,
      city: value?.addressPrincipal?.city,
      stateId: value?.addressPrincipal?.state,
      zip: value?.addressPrincipal?.zip,
      yearAddress: value?.yearAtThisAddress,
      arrayOldData: { oldData },
      // theo swagger
      status: 0,
      oldData: '',
      password: '',
      resetPasswordToken: '',
      resetPasswordDate: '',
      newsletterEnable: true,
      stateIssuedName: '',
    };

    delete value?.addressPrincipal;
    delete value?.codeHomePhone;
    delete value?.codeMobilePhone;
    delete value?.driverLicense;
    delete value?.yearAtThisAddress;

    const { data } = await axios.put('/Merchant/principal/' + principalId + '?merchantId=' + parentId, value);
    if (data?.data) {
      Message.success({ text: data?.text });
    } else {
      Message.error({ text: data?.message });
    }
    return data;
  },
  getSubscription: async (id) => {
    const { data } = await axios.get('/Subscription/getbymerchant/' + id);
    return data;
  },
  editSubscription: async (value, id, parentID, oldData) => {
    value = {
      subscriptionId: oldData?.subscriptionId,
      packageId: value?.packageId,
      expiredDate: value?.expiredDate,
      pricingType: value?.pricingType,
      additionStaff: value?.packageId !== 28 ? 0 : value.additionStaff,
    };
    const { data } = await axios.put('/Subscription/' + id, value);
    return data;
  },
  getStaffs: async (params, id) => {
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
    const { data } = await axios.get('/Staff/admin/getbymerchant/' + id, { params });
    return {
      data: data?.data || [],
      count: data?.count,
    };
  },
  getAllStaff: async (params, id) => {
    params = {
      page: '1',
      perPage: '0',
    };
    const { data } = await axios.get('/Staff/admin/getbymerchant/' + id, { params });
    return {
      data: data?.data || [],
    };
  },
  getStaffById: async (id, merchantId) => {
    const { data } = await axios.get('/Staff/' + id + '?merchantId=' + merchantId);
    data.data.productSalaries.commission.value = data?.data?.productSalaries?.commission?.value + '';

    const salaries = data?.data?.salaries;
    salaries.commission.value = salaries?.commission?.value?.map((item) => {
      return {
        commission: item?.commission + '',
        from: item?.from + '',
        to: item?.to + '',
      };
    });
    salaries.perHour.value = salaries?.perHour?.value + '';
    const tipFees = data?.data?.tipFees;
    tipFees.fixedAmount.value = tipFees?.fixedAmount?.value + '';
    tipFees.percent.value = tipFees?.percent?.value + '';
    data.data.salaries = salaries;
    data.data.tipFees = tipFees;
    return data?.data;
  },
  addNewStaff: async (general, workingTime, salary, liscence, categoriesValue, id) => {
    categoriesValue = categoriesValue?.map((item) => {
      item = {
        ...item,
        id: 0,
        staffId: 0,
      };
      item.staffServices = item?.staffServices?.map((staffServices) => {
        staffServices = {
          ...staffServices,
          id: 0,
          staffCategoryId: 0,
          staffId: 0,
        };
        return staffServices;
      });
      return item;
    });
    const newStaff = {
      ...general,
      ...liscence,
      isDisabled: !!general?.isDisabled === 1,
      cellphone: general?.phone ? (general?.codePhone ? general?.codePhone : '+1' + ' ' + general?.phone) : '',
      roles: {
        nameRole: general?.roleName,
        statusRole: '',
      },
      fileId: general?.imageUrl ? general?.imageUrl[0]?.fileId : 0,
      workingTime: {
        Monday: workingTime?.Monday,
        Tuesday: workingTime?.Tuesday,
        Wednesday: workingTime?.Wednesday,
        Thursday: workingTime?.Thursday,
        Friday: workingTime?.Friday,
        Saturday: workingTime?.Saturday,
        Sunday: workingTime?.Sunday,
      },
      tipFee: {
        percent: {
          value: salary?.tipPercent || '0.00',
          isCheck: salary?.isTipPercent || false,
        },
        fixedAmount: {
          value: salary?.tipFixed || '0.00',
          isCheck: salary?.isTipFixed || false,
        },
      },
      salary: {
        commission: {
          isCheck: salary?.isSalaryCommission || false,
          value: salary?.salaryCommission || [{ from: 0, to: 0, salaryPercent: 0, commission: 0 }],
        },
        perHour: {
          isCheck: salary?.isSalaryPerHour || false,
          value: salary?.salaryPerHour || '0.00',
        },
      },
      productSalary: {
        commission: {
          value: salary?.productCommission || '0.00',
          isCheck: salary?.isProductCommission || false,
        },
      },
      cashPercent: salary?.cashPercent,
      merchantId: +id,
      categories: categoriesValue || [],
      isUpload: false,

      // swagger
      status: true,
      birthdate: '0001-01-01T00:00:00',
      gender: null,
      colorCode: '',
      permission: [
        {
          id: 0,
          staffId: 0,
          roleId: 0,
          key: '',
          label: '',
          isChecked: true,
          isDisabled: 0,
          createdDate: '',
          createdBy: 0,
          modifiedDate: '',
          modifiedBy: 0,
        },
      ],
    };

    if (newStaff?.salary?.commission?.value?.length === 0 || !newStaff?.salary?.commission?.value) {
      newStaff.salary.commission.value = [{ from: 0, to: 0, salaryPercent: 0, commission: 0 }];
    }
    newStaff.salary.commission.value = newStaff?.salary?.commission?.value?.map((item) => {
      return {
        ...item,
        from: parseFloat(item?.from) || 0,
        to: parseFloat(item?.to) || 0,
        salaryPercent: parseFloat(item?.salaryPercent) || 0,
        commission: parseFloat(item?.commission) || 0,
      };
    });

    delete newStaff?.codePhone;
    delete newStaff?.phone;
    delete newStaff?.roleName;
    delete newStaff.isUpload;

    const { data } = await axios.post('/Staff', newStaff);
    return data;
  },
  putRefundInvoice: async (id) => {
    const { data } = await axios.put('/checkout/paymentvoidrefundtransaction/' + id, {
      responseData: {},
    });
    if (data.codeNumber === 200) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },
  archive: async (id, merchantId) => {
    const { data } = await axios.put('/Staff/archive/' + id + `?merchantId=${merchantId}`);
    if (!data?.data) {
      Message.error({ text: data?.message });
      return { data: data?.data };
    }
    return data;
  },
  restore: async (id, merchantId) => {
    const { data } = await axios.put('/Staff/restore/' + id + `?merchantId=${merchantId}`);
    if (data.codeNumber === 200) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },
  editStaffGeneral: async (value, id, parentID, oldData) => {
    value = {
      ...oldData,
      ...value,
      cellPhone: (value?.codePhone || '+1') + ' ' + value?.phone,

      fileId: value?.imageUrl[0]?.fileId || oldData?.fileId,
      driverLicense: oldData?.driverLicense,
      professionalLicense: oldData?.professionalLicense,
      workingTime: oldData?.workingTimes,
      tipFee: oldData?.tipFees,
      salary: oldData?.salaries,
      productSalary: oldData?.productSalaries,
      Roles: {
        NameRole: value?.roleName,
        statusRole: '',
      },
      merchantId: parentID,

      // swagger
      socialSecurityNumber: oldData?.ssn,
      status: true,
      birthdate: '0001-01-01T00:00:00',
      gender: null,
      colorCode: oldData?.colorCode,
      permission: oldData?.permission,
    };
    value.staffId = id;
    delete value?.codePhone;
    delete value?.phone;
    delete value?.imageUrl;
    delete value?.roleName;
    const { data } = await axios.put('/Staff/' + id, value);
    return data;
  },
  editWorkingTimes: async (value, staffId, merchantId, staff) => {
    const newStaff = {
      ...staff,
      cellPhone: staff?.codePhone + ' ' + staff?.phone,
      roles: {
        nameRole: staff?.roleName,
        statusRole: '',
      },
      socialSecurityNumber: staff?.ssn,
      productSalary: staff?.productSalaries,
      address: {
        street: staff?.address,
        city: staff?.city,
        state: staff?.stateId,
        zip: staff?.zip,
      },
      salary: staff?.salaries,
      tipFee: staff?.tipFees,
      workingTime: value,
      merchantId,
      birthdate: '0001-01-01T00:00:00',
      gender: null,
      status: true,
    };

    delete newStaff?.roleName;
    delete newStaff?.productSalaries;
    delete newStaff?.salaries;
    delete newStaff?.tipFees;
    delete newStaff?.workingTimes;
    delete newStaff?.codePhone;
    delete newStaff?.ssn;
    delete newStaff?.code;

    // Case salary.commission undifined
    const newSalry = newStaff?.salary?.commission?.value?.map((item) => ({
      ...item,
      commission: item?.commission || '',
    }));
    newStaff.salary.commission.value = newSalry;
    //
    const { data } = await axios.put('/Staff/' + staff?.staffId, newStaff);
    if (data?.data) {
      Message.success({ text: data?.message });
      return data?.data;
    } else {
      Message.error({ text: data?.message });
    }
  },
  editSalary: async (value, staffId, merchantId, staff) => {
    value = {
      ...staff,
      cellPhone: staff?.codePhone + ' ' + staff?.phone,
      MerchantID: +merchantId,
      Roles: {
        NameRole: staff?.roleName,
      },
      address: {
        street: staff?.address,
        city: staff?.city,
        state: staff?.stateId,
        zip: staff?.zip,
      },
      workingTime: staff?.workingTimes,

      productSalary: {
        commission: {
          isCheck: value?.isProductCommission,
          value: value?.productCommission || '0',
        },
      },
      salary: {
        commission: {
          isCheck: value?.isSalaryCommission,
          value: value?.salaryCommission,
        },
        perHour: {
          isCheck: value?.isSalaryPerHour,
          value: value?.salaryPerHour || '0',
        },
      },
      tipFee: {
        fixedAmount: {
          isCheck: value?.isTipFixed,
          value: value?.tipFixed || '0',
        },
        percent: {
          isCheck: value?.isTipPercent,
          value: value?.tipPercent || '0',
        },
      },
      cashPercent: value?.cashPercent || '0',
    };

    // Case commission undifined
    const salalyCommission = value?.salary?.commission?.value?.map((item) => ({
      ...item,
      from: item?.from === '' ? 0 : parseFloat(item?.from),
      to: item?.to === '' ? 0 : parseFloat(item?.to),
      salaryPercent: !item?.salaryPercent || item?.salaryPercent === '' ? 0 : parseFloat(item?.salaryPercent),
      commission: item?.commission === '' ? 0 : parseFloat(item?.commission),
    }));
    value.salary.commission.value = salalyCommission;
    //

    // Phai truyen commission
    // Check cái add nữa là ok
    if (value?.salary?.commission?.value?.length === 0) {
      value.salary.commission.value = [{ from: 0, to: 0, salaryPercent: 0, commission: 0 }];
    }

    const { data } = await axios.put('/Staff/' + staffId, value);
    if (data?.data) {
      Message.success({ text: data?.message });
      return data?.data;
    } else {
      Message.error({ text: data?.message });
      return false;
    }
  },
  editLicense: async (value, staffId, merchantId, staff) => {
    value = {
      ...staff,
      cellPhone: staff?.codePhone + ' ' + staff?.phone,
      merchantId: +merchantId,
      roles: {
        nameRole: staff?.roleName,
      },
      productSalary: staff?.productSalaries,
      address: {
        street: staff?.address,
        city: staff?.city,
        state: staff?.stateId,
        zip: staff?.zip,
      },
      salary: staff?.salaries,
      tipFee: staff?.tipFees,
      workingTime: staff?.workingTimes,
      driverLicense: value?.driverLicense,
      socialSecurityNumber: value?.ssn,
      professionalLicense: value?.professionalLicense,
    };

    const { data } = await axios.put('/Staff/' + staffId, value);
    if (data?.data) {
      Message.success({ text: data?.message });
      return data?.data;
    } else {
      Message.error({ text: data?.message });
      return false;
    }
  },

  get: async (params) => {
    // const { data } = await axios.get(routerLinks(MerchantService.nameLink, "api"), { params });
    return {
      data: [
        {
          id: '524',
          mid: '198919891989',
          dba: 'QUEEN Demo',
          owner: 'mailto:van.vo@levincigroup.com',
          storePhone: '+1 (111) 111-1111',
          contactPhone: '+1 (111) 111-1111',
          status: 'Active',
          expireDate: '05/09/2023 03:07 AM',
        },
        {
          id: '523',
          mid: '198919891989',
          dba: 'QUEEN Demo',
          owner: 'mailto:van.vo@levincigroup.com',
          storePhone: '+1 (111) 111-1111',
          contactPhone: '+1 (111) 111-1111',
          status: 'Active',
          expireDate: '05/09/2023 03:07 AM',
        },
      ],
    };
  },

  getCategory: async (params, id, filter) => {
    if (typeof params?.sorts === 'string') {
      params.sorts = JSON.parse(params?.sorts);
    }
    if (params.sorts) {
      for (const key in params.sorts) {
        params.sortValue = key;
        params.sortType = params.sorts[key].toLowerCase();
      }
    }
    // set 100 tam thoi, chua biet lay all bang key gi
    params.row = params?.perPage || '100';
    params.key = params?.fullTextSearch || '';
    let filters = params?.status !== -1 ? { status: params?.status } : '';
    if (filter) {
      filters = { ...filters, ...filter };
    }
    params = {
      ...params,
      merchantId: id,
      page: params?.page === 0 ? params?.page : params?.page || '1',
      row: params?.perPage === 0 ? params?.perPage : params?.perPage || '10',
      key: params?.fullTextSearch || '',
      filters,
    };

    const { data } = await axios.get('Category/admin/getbymerchant/' + id, { params });
    if (data.data)
      data.data = data.data.map((item) => {
        item.id = item.categoryId;
        return item;
      });
    return data.data
      ? data
      : {
          ...data,
          data: [],
        };
  },
  getAllCategory: async (params, id) => {
    params = {
      page: '0',
      row: '0',
    };
    const { data } = await axios.get('Category/admin/getbymerchant/' + id, { params });
    return data;
  },
  getProduct: async (params, id) => {
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

    const { data } = await axios.get('Product/admin/getbymerchant/' + id, { params });
    if (data.data)
      data.data = data.data.map((item) => {
        item.id = item.productId;
        item.fileId = [
          {
            id: item?.fileId,
            path: item?.imageUrl,
          },
        ];
        return item;
      });

    return data.data
      ? data
      : {
          ...data,
          data: [],
        };
  },
  getChildByProductParentId: async (params, productId) => {
    params.row = params.perPage || '10';
    const { data } = await axios.get('product/' + productId, { params });
    return {
      data: data?.data?.quantities,
      count: data?.data?.quantities?.length,
    };
  },
  getService: async (params, merchantId) => {
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
    params.key = params?.fullTextSearch || '';
    params.row = params?.perPage || '10';

    const { data } = await axios.get('/Service/admin/getbymerchant/' + merchantId, { params });
    return {
      data: data?.data || [],
      count: data?.count,
    };
  },
  getAllService: async (params, merchantId) => {
    params = {
      page: '0',
      row: '0',
    };
    const { data } = await axios.get('/Service/admin/getbymerchant/' + merchantId, { params });
    return {
      data: data?.data || [],
      count: data?.count,
    };
  },
  getDevice: async (merchantId) => {
    const { data } = await axios.get('/Merchant/' + merchantId + '/device-terminal');
    return data.data
      ? data
      : {
          ...data,
          data: [],
        };
  },

  serviceRestore: async (serviceId) => {
    const { data } = await axios.put('/Service/restore/' + serviceId);
    return data;
  },
  serviceArchive: async (serviceId) => {
    const { data } = await axios.put('/Service/archive/' + serviceId);
    return data;
  },
  deleteService: async (serviceId) => {
    const { data } = await axios.delete('/Service/' + serviceId);
    return data;
  },
  getExtraByMerchantId: async (merchantId) => {
    const { data } = await axios.get('/Extra/admin/getbymerchant/' + merchantId);
    return data?.data;
  },
  editService: async (service, merchant, serviceValue, extraValues) => {
    const extras =
      extraValues?.extras &&
      extraValues?.extras.map((item) => ({
        ...item,
        extraId: item?.extraId || undefined,
        merchantId: merchant?.merchantId,
        price: +item?.price,
        imageUrl: '',
        supplyFee: item?.supplyFee || 0,
      }));
    const value = {
      ...serviceValue,
      merchantId: merchant?.merchantId,
      openTime: serviceValue?.openTime || 0,
      secondTime: serviceValue?.secondTime || 0,
      fileId: (serviceValue?.imageUrl && serviceValue?.imageUrl[0]?.fileId) || service?.fileId,
      supplyFee: serviceValue?.supplyFee || 0,
      imageUrl: (serviceValue?.imageUrl && serviceValue?.imageUrl[0]?.url) || service?.imageUrl,
      extras,
      categoryName: serviceValue?.name,
    };
    const { data } = await axios.put('/Service/' + service?.serviceId, value);
    return data;
  },
  addService: async (service, merchant, serviceValue, extraValues) => {
    const extras =
      extraValues?.extras &&
      extraValues?.extras.map((item) => ({
        ...item,
        extraId: item?.extraId || undefined,
        merchantId: merchant?.merchantId,
        price: +item?.price,
        imageUrl: '',
        supplyFee: item?.supplyFee || 0,
      }));

    const value = {
      ...serviceValue,
      merchantId: merchant?.merchantId,
      openTime: serviceValue?.openTime || 0,
      secondTime: serviceValue?.secondTime || 0,
      fileId: (serviceValue?.imageUrl && serviceValue?.imageUrl[0]?.fileId) || service?.fileId,
      supplyFee: serviceValue?.supplyFee || 0,
      imageUrl: (serviceValue?.imageUrl && serviceValue?.imageUrl[0]?.url) || service?.imageUrl,
      extras,
      categoryName: serviceValue?.name,
    };

    const { data } = await axios.post('/Service', value);
    return data;
  },
  serviceExport: async (merchantId) => {
    const { data } = await axios.get('/Service/exportByMerchant/' + merchantId);
    return data?.data;
  },
  getExtra: async (params, id) => {
    if (params?.sorts) {
      if (typeof params?.sorts === 'string') {
        params.sorts = JSON.parse(params?.sorts);
      }
      if (params.sorts) {
        params.sortValue = params?.sorts ? Object.keys(params?.sorts)[0] : undefined;
        params.sortType = params?.sorts ? Object.values(params?.sorts)[0] : undefined;
        delete params.sorts;
      }
    } else {
      delete params?.sortValue;
      delete params?.sortType;
      delete params?.sorts;
    }

    params.row = params?.perPage || '10';
    params.key = params?.fullTextSearch || '';

    const { data } = await axios.get('extra/admin/getbymerchant/' + id, { params });
    if (data.data)
      data.data = data.data
        .filter((item) => item.isDeleted !== 1)
        .map((item) => {
          item.id = item.extraId;
          item.fileId = [
            {
              id: item?.fileId,
              path: item?.imageUrl,
            },
          ];
          return item;
        });
    return data.data
      ? data
      : {
          ...data,
          data: [],
        };
  },
  deleteExtra: async (id) => {
    const { data } = await axios.delete('/extra/' + id);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },
  getGiftCard: async (params, id) => {
    if (params?.sorts) {
      if (typeof params?.sorts === 'string') {
        params.sorts = JSON.parse(params?.sorts);
      }
      if (params.sorts) {
        params.sortValue = params?.sorts ? Object.keys(params?.sorts)[0] : undefined;
        params.sortType = params?.sorts ? Object.values(params?.sorts)[0] : undefined;
        delete params.sorts;
      }
    } else {
      delete params?.sortValue;
      delete params?.sortType;
      delete params?.sorts;
    }
    if (params.perPage) {
      params.row = params.perPage;
      delete params.perPage;
    }

    if (params.fullTextSearch) {
      params.keySearch = params.fullTextSearch;
      // delete params.fullTextSearch;
    }
    const { data } = await axios.get('GiftCardGeneral/admin', {
      params: {
        ...params,
        merchantId: id,
      },
    });

    if (data.data)
      data.data = data.data.map((item) => {
        item.id = item.giftCardGeneralId;
        if (item.merchants) {
          item.merchants = item.merchants.split(',');
          item.merchants = item.merchants.map((i) => parseInt(i));
        }

        return item;
      });

    return data.data
      ? data
      : {
          ...data,
          data: [],
        };
  },
  getGiftCardByGeneral: async (params, id) => {
    if (typeof params?.sorts === 'string') {
      params.sorts = JSON.parse(params?.sorts);
    }
    if (params.sorts) {
      params.sortValue = params?.sorts ? Object.keys(params?.sorts)[0] : undefined;
      params.sortType = params?.sorts ? Object.values(params?.sorts)[0] : undefined;
      delete params.sorts;
    }

    if (params.perPage) {
      params.row = params.perPage || '10';
      // delete params.perPage;
    }

    if (params.fullTextSearch) {
      params.keySearch = params.fullTextSearch;
      // delete params.fullTextSearch;
    }
    params.page = params?.page || '1';
    params.row = params?.row || '10';
    const { data } = await axios.get('giftcard/getByGeneral', {
      params: {
        ...params,
        generalId: id,
      },
    });

    if (data.data)
      data.data = data.data.map((item) => {
        item.id = item.giftCardId;
        if (item.merchants) {
          item.merchants = item.merchants.split(',');
          item.merchants = item.merchants.map((i) => parseInt(i));
        }

        return item;
      });

    return data.data
      ? data
      : {
          ...data,
          data: [],
        };
  },
  getInvoice: async (params) => {
    params.fullTextSearch = params?.key;
    const { data } = await axios.get('Checkout', { params });
    return data.data
      ? data
      : {
          ...data,
          data: [],
        };
  },
  getInvoiceById: async (id, params) => {
    const { data } = await axios.get('Checkout/' + id, { params });
    return data;
  },
  getById: async (id) => {
    const { data } = await axios.get(`${routerLinks(MerchantService.nameLink, 'api')}/${id}`);
    return data;
  },
  getInfoGeneralById: async (id) => {
    const { data } = await axios.get('giftcardlog/' + id);
    return data;
  },
  getProductById: async (id) => {
    const { data } = await axios.get('product/' + id);
    data.data.fileId =
      data.data.fileId !== 0
        ? [
            {
              id: data?.data?.fileId,
              thumbUrl: data?.data?.imageUrl,
            },
          ]
        : [];
    data.data.quantity = data.data.quantity.toString();
    data.data.minThreshold = data.data.minThreshold.toString();
    data.data.maxThreshold = data.data.maxThreshold.toString();

    return data;
  },

  getExtraById: async (id) => {
    const { data } = await axios.get('extra/' + id);
    data.data.fileId =
      data.data.fileId !== 0
        ? [
            {
              id: data?.data?.fileId,
              thumbUrl: data?.data?.imageUrl,
            },
          ]
        : [];
    data.data.duration = data.data.duration.toString();
    // data.data.minThreshold = data.data.minThreshold.toString();
    // data.data.maxThreshold = data.data.maxThreshold.toString();

    return data;
  },

  putProduct: async (values, id, oldData) => {
    if (values.fileId) values.fileId = values?.fileId[0]?.fileId ? values?.fileId[0]?.fileId : values?.fileId[0]?.id;
    values.productId = id;
    values.merchantId = oldData.merchantId;
    values.path = '/app/merchants/profile/product';
    values.minThreshold = values.minThreshold.replace('Item ', '');
    values.maxThreshold = values.maxThreshold.replace('Item ', '');
    values.quantity = values.quantity.replace('Item ', '');
    values.price = values.price.replace('$ ', '');
    values.BarCode = values?.barCode;
    delete values?.barCode;

    const { data } = await axios.put('/product/' + id, values);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  putDevice: async (values, id) => {
    const { data } = await axios.put('/merchant/' + id + '/device-terminal', values);
    if (data.codeNumber === 200) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  putExtra: async (values, id, oldData) => {
    if (values.fileId) values.fileId = values?.fileId[0]?.fileId ? values?.fileId[0]?.fileId : values?.fileId[0]?.id;

    values.merchantId = oldData.merchantId;
    values.duration = values.duration.replace('Item ', '');
    values.price = values.price.replace('$ ', '');
    values.supplyFee = values.supplyFee.replace('$ ', '');
    values.duration = values.duration.replace('Mins ', '');

    const { data } = await axios.put('/extra/' + id, values);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  postProduct: async (values, oldData) => {
    if (values.fileId) values.fileId = values?.fileId[0]?.fileId ? values?.fileId[0]?.fileId : values?.fileId[0]?.id;

    values.merchantId = oldData.merchantId;
    values.path = '/app/merchants/profile/product';
    values.minThreshold = values.minThreshold.replace('Item ', '');
    values.maxThreshold = values.maxThreshold.replace('Item ', '');
    values.quantity = values.quantity.replace('Item ', '');
    values.price = values.price.replace('$ ', '');
    values.BarCode = values?.barCode;

    const { data } = await axios.post('/product', values);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  postCategory: async (values, oldData) => {
    values = {
      ...values,
      merchantId: oldData?.merchantId,
    };
    const { data } = await axios.post('/category', values);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  putCategory: async (values, id, oldData) => {
    values = {
      ...values,
      categoryId: oldData?.categoryId,
      merchantId: oldData?.merchantId,
    };
    const { data } = await axios.put('/category/' + id, values);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  archiveCategory: async (id) => {
    const { data } = await axios.put('/category/archive/' + id);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  restoreCategory: async (id) => {
    const { data } = await axios.put('/category/restore/' + id);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  archiveProduct: async (id) => {
    const { data } = await axios.put('/product/archive/' + id);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  restoreProduct: async (id) => {
    const { data } = await axios.put('/product/restore/' + id);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  archiveExtra: async (id) => {
    const { data } = await axios.put('/extra/archive/' + id);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  restoreExtra: async (id) => {
    const { data } = await axios.put('/extra/restore/' + id);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  deleteGiftCard: async (id) => {
    const { data } = await axios.delete('/GiftCard/' + id);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  deleteCategory: async (id) => {
    const { data } = await axios.delete('/category/' + id);
    if (data.data) Message.error({ text: data.message });
    else Message.success({ text: data.message });
    return data;
  },

  getExportCategory: async (id) => {
    const { data } = await axios.get('/category/export/' + id);
    if (!data.data) Message.error({ text: data.message });
    return data;
  },

  getExportExtra: async (id) => {
    const { data } = await axios.get('/extra/export/' + id);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  getExportGiftCard: async (id) => {
    const { data } = await axios.get('GiftCard/getByGeneral/export/excel', {
      params: {
        generalId: id,
      },
    });
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  postGiftCard: async (values, oldData) => {
    values.merchantId = oldData.merchantId;
    values.path = '/app/merchants/profile/gift-card';
    values.amount = values.amount.replace('$ ', '');
    if (values.merchants) values.merchants = values.merchants.toString();

    const { data } = await axios.post('/GiftCard/general', values);
    if (data?.codeNumber === 200) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  putGiftCard: async (values, id, oldData) => {
    values.merchantId = oldData.merchantId;
    values.path = '/app/merchants/profile/gift-card';
    values.amount = values.amount.replace('$ ', '');
    if (values.merchants) values.merchants = values.merchants.toString();
    values.giftCardGeneralId = id;

    const { data } = await axios.put('/giftcard/update/' + id, values);
    if (data?.codeNumber === 200) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },

  post: async (values) => {
    const { data } = await axios.post(routerLinks(MerchantService.nameLink, 'api'), values);
    if (data.message) message.success(data.message);
    return data;
  },

  put: async (values, id) => {
    const { data } = await axios.put(`${routerLinks(MerchantService.nameLink, 'api')}/${id}`, values);
    if (data.message) message.success(data.message);
    return data;
  },
  delete: async (id) => {
    const { data } = await axios.delete(`${routerLinks(MerchantService.nameLink, 'api')}/${id}`);
    if (data.message) message.success(data.message);
    return data;
  },
  brief: async (params) => {
    const { data } = await axios.get(`${routerLinks(MerchantService.nameLink, 'api')}/brief`, { params });
    return data;
  },
  editBooking: async (value, id, merchant) => {
    const newMerchant = {
      ...merchant,
      onlineBookingTime: value,
    };
    const { data } = await axios.put('/Merchant/updatesetting/' + id, newMerchant);
    if (data?.data) {
      Message.success({ text: data?.message });
      return data?.data;
    } else {
      Message.error({ text: data?.message });
    }
  },
  editSetting: async (values, merchantId, parentID, oldData) => {
    values = {
      ...values,
      merchantToken: oldData?.merchantToken,
      totalAmountLimit: +oldData?.totalAmountLimit,
      cashDiscountPercent: +values?.cashDiscountPercent,
      discountRate: +values?.discountRate,
      pointRate: +values?.pointRate,
      isWareHouse: values?.isWareHouse || false,
      transactionsFee: +values?.transactionsFee,
      turnAmount: +values?.turnAmount,
      timezone: '',
    };
    const { data } = await axios.put('/Merchant/updatesetting/' + merchantId, values);
    if (!data?.data) {
      Message.error({ text: data?.message });
    } else Message.success({ text: data?.message });
    return data;
  },
  activeSetting: async (merchantId) => {
    const { data } = await axios.put('/Merchant/enable/' + merchantId);
    return data;
  },
  inactiveSetting: async (values, id, parentID, oldData) => {
    const { data } = await axios.delete('/Merchant/' + parentID, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(values),
    });
    if (data?.data) Message.success({ text: data?.message });
    return data;
  },
  downloadCustomerTemplate: async () => {
    const { data } = await axios.get('/Customer/import/template', {
      responseType: 'blob',
    });
    return data;
  },
  generateBookingLink: async (id) => {
    const { data } = await axios.get('/Merchant/bookingLink/' + id);
    if (!data?.data) Message.error({ text: data?.message });
    return data?.data;
  },
  generateCallerLink: async (id) => {
    const { data } = await axios.get('/Merchant/callerIDLink/' + id);
    if (!data?.data) Message.error({ text: data?.message });
    return data?.data;
  },

  getActivity: async (params, id) => {
    params = {
      page: params?.page || '1',
      row: params?.perPage || '10',
    };
    const { data } = await axios.get('/MerchantActivity/' + id, { params });
    if (!data?.data) {
      Message.error({ text: data?.message });
      return false;
    }
    return {
      data: data?.data || [],
      count: data?.count,
    };
  },
  getPrincipalByKey: async (params) => {
    const { data } = await axios.get('merchant/principal/getbykey', { params });
    return data?.data;
  },
  getTicket: async (params, id) => {
    params = {
      page: params?.page || '1',
      row: params?.perPage || '10',
      keySearch: params?.fullTextSearch || '',
      status: params?.status || 'all',
    };

    const { data } = await axios.get('Ticket/getbymerchant/' + id, { params });
    // if (data.data)
    //   data.data = data.data.map((item) => {
    //     item.id = item.categoryId;
    //     return item;
    //   });
    return data.data
      ? data
      : {
          ...data,
          data: [],
        };
  },

  getPin: async (merchantId, pincode, staffId) => {
    const params = {
      pincode,
      id: staffId || 0,
    };
    const { data } = await axios.get(`Staff/checkPincode/${merchantId}`, {
      params,
    });
    return data;
  },

  getZipCode: async (params) => {
    const { data } = await axios.get('/State/getcityandstatebyzipcode', { params });
    if(data?.data?.stateId === 0){
      return null;
    }
    return data?.data;
  },

  getSubscriptionGetHistory: async (params, id) => {
    if (typeof params?.sorts === 'string') {
      params.sorts = JSON.parse(params?.sorts);
    }
    if (params.sorts) {
      for (const key in params.sorts) {
        params.sortValue = key;
        params.sortType = params.sorts[key].toLowerCase();
      }
    } else {
      delete params?.sortType;
      delete params?.sortValue;
    }
    params = {
      ...params,
      page: params?.page || '1',
      row: params?.perPage || '10',
    };
    const { data } = await axios.get('Subscription/getHistory/' + id, { params });
    return {
      data: data?.data || [],
      count: data?.count,
    };
  },
  getExportSubscription: async (id) => {
    const { data } = await axios.get('/Subscription/history/export/' + id);
    if (data.data) Message.success({ text: data.message });
    else Message.error({ text: data.message });
    return data;
  },
  changePricipal: async (merchantId, newPrincipalId, currentPricipalId) => {
    let url = `/Merchant/${merchantId}/changePrincipal/${newPrincipalId}`;
    if (currentPricipalId) {
      url = `${url}?currentPrincipalId=${currentPricipalId}`;
    }
    const { data } = await axios.put(url);
    if (data?.data) {
      Message.success({ text: data?.message });
      return data?.data;
    } else {
      Message.error({ text: data?.message });
    }
    return data;
  },
  generatePortalLink: async (id) => {
    const { data } = await axios.get('/Merchant/portalLoginLink/' + id);

    if (data?.codeNumber !== 200) Message.error({ text: data?.message });

    let url = '';

    if (data && data.data && data.data.url && data.data.tokenReport) {
      url = `${data.data.url}&tokenReport=${data.data.tokenReport}`;
    }

    return url;
  },
};
