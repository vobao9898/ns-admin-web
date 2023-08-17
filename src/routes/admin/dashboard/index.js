import React, { useEffect, Fragment, useState } from 'react';
import { echartBar, echartDoughnut } from 'utils';
import { DatePicker, Modal, Select, Spin } from 'antd';
import Export from 'assets/svg/export.svg';
import moment from 'moment';
import DashBoardService from 'services/dashBoard';
import classNames from 'classnames';
import './index.less';
import Check from 'assets/images/check.png';

const Page = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  const [timeRangeMerchant, setTimeRangeMerchant] = useState('thisWeek');
  const [customMerchant, setCustomMerchant] = useState([new Date(year, month, 1), new Date(year, month + 1, 0)]);
  const [dataMerChant, setDataMerchant] = useState([]);

  const [timeRangeAppointment, setTimeRangeAppointment] = useState('today');
  const [customAppointment, setCustomAppointment] = useState([new Date(year, month, 1), new Date(year, month + 1, 0)]);
  const [dataAppointment, setDataAppointment] = useState([]);

  const [timeRangeOrder, setTimeRangeOrder] = useState('today');
  const [customOrder, setCustomOrder] = useState([new Date(year, month, 1), new Date(year, month + 1, 0)]);
  const [dataOrder, setDataOrder] = useState([]);

  const [timeRangeTransaction, setTimeRangeTransaction] = useState('thisWeek');
  const [customTransaction, setCustomTransaction] = useState([new Date(year, month, 1), new Date(year, month + 1, 0)]);
  const [dataTransaction, setDataTransaction] = useState(0);

  const [timeRangeGif, setTimeRangeGif] = useState('today');
  const [customGif, setCustomGif] = useState([new Date(year, month, 1), new Date(year, month + 1, 0)]);
  const [dataGif, setDataGif] = useState(null);

  const [timeRangeConsumer, setTimeRangeConsumer] = useState('today');
  const [customConsumer, setCustomConsumer] = useState([new Date(year, month, 1), new Date(year, month + 1, 0)]);
  const [dataConsumer, setDataConsumer] = useState(null);

  const [isLoadding, setIsLoading] = useState(false);
  const [isState, setIsState] = useState(true);
  const [isExport, setIsExport] = useState(false);
  const [linkExport, setLinkExport] = useState(null);

  const loaddingMerchant = async () => {
    const paramsTable = {};
    paramsTable.filter = {
      quickFilter: timeRangeMerchant,
    };
    if (timeRangeMerchant === 'custom') {
      paramsTable.filter = {
        ...paramsTable?.filter,
        timeStart: moment(customMerchant[0]).format('L'),
        timeEnd: moment(customMerchant[1]).format('L'),
      };
    }
    const res = await DashBoardService.getMerchant(paramsTable);
    const dataStemp = [];
    if (res?.data.data && res?.data?.data?.length > 0) {
      res?.data?.data?.forEach((item) => {
        const currency = item?.value.toString();
        const result = Number(currency.replace(/[^0-9.]+/g, ''));
        dataStemp.push({
          value: result,
          values: result,
          name: item?.label === 'WebApp' ? 'Website/App' : item?.label,
        });
      });
    }
    const resultMerchant = Number(res?.data?.total.replace(/[^0-9.]+/g, ''));
    await setDataMerchant({ data: dataStemp, total: resultMerchant });
    await echartDoughnut({
      id: 'chart3',
      color: ['#2F80ED', '#FBA705', '#EB5757'],
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 15,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: true,
          },
          data: dataStemp,
        },
      ],
    });
  };

  const loaddingOrder = async () => {
    const paramsTable = {};
    paramsTable.filter = {
      quickFilter: timeRangeOrder,
    };
    if (timeRangeOrder === 'custom') {
      paramsTable.filter = {
        ...paramsTable?.filter,
        timeStart: moment(customOrder[0]).format('L'),
        timeEnd: moment(customOrder[1]).format('L'),
      };
    }
    paramsTable.merchantType = 1;
    const res = await DashBoardService.getAppointment(paramsTable);
    const dataStemp = [];
    if (res?.data.data && res?.data?.data?.length > 0) {
      res?.data?.data?.forEach((item) => {
        const currency = item?.value.toString();
        const result = Number(currency.replace(/[^0-9.]+/g, ''));
        dataStemp.push({
          value: result,
          values: result,
          name: item?.label === 'WebApp' ? 'Website/App' : item?.label,
        });
      });
    }
    const resultOrder = Number(res?.data?.total.replace(/[^0-9.]+/g, ''));
    await setDataOrder({ data: dataStemp, total: resultOrder });
    await echartDoughnut({
      id: 'chart2',
      color: ['#34A853', '#4285F4', '#FBA705'],
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 15,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: true,
          },
          data: dataStemp,
        },
      ],
    });
  };

  const loaddingTransaction = async () => {
    const paramsTable = {};
    paramsTable.filter = {
      quickFilter: timeRangeTransaction,
    };
    if (timeRangeTransaction === 'custom') {
      paramsTable.filter = {
        ...paramsTable?.filter,
        timeStart: moment(customTransaction[0]).format('L'),
        timeEnd: moment(customTransaction[1]).format('L'),
      };
    }
    const res = await DashBoardService.getTransaction(paramsTable);
    const dataStemp = [];
    await setDataTransaction(res?.data?.total);
    const label = res?.data?.label;
    if (res?.data.data && res?.data?.data?.length > 0) {
      res?.data?.data?.forEach((item) => {
        // const currency = item?.value.toString();
        // const result = Number(currency.replace(/[^0-9.]+/g, ''));
        if (item?.name === 'harmony') {
          dataStemp.push({
            name: item?.label,
            type: 'bar',
            barWidth: '7px',
            itemStyle: {
              color: '#27AE60',
              borderRadius: 4,
            },
            data: item?.values,
          });
        }
        if (item?.name === 'cash') {
          dataStemp.push({
            name: 'Cash',
            type: 'bar',
            barWidth: '7px',
            itemStyle: {
              color: '#4285F4',
              borderRadius: 4,
            },
            data: item?.values,
          });
        }
        if (item?.name === 'credit_card') {
          dataStemp.push({
            name: 'Credit Card',
            type: 'bar',
            barWidth: '7px',
            itemStyle: {
              color: '#9B51E0',
              borderRadius: 4,
            },
            data: item?.values,
          });
        }
        if (item?.name === 'other') {
          dataStemp.push({
            name: 'Other',
            type: 'bar',
            barWidth: '7px',
            itemStyle: {
              color: '#FBA705',
              borderRadius: 4,
            },
            data: item?.values,
          });
        }
      });
    }

    await echartBar({
      id: 'chart-user',
      label: label,
      series: dataStemp,
    });
  };

  const loaddingAppointment = async () => {
    const paramsTable = {};
    paramsTable.filter = {
      quickFilter: timeRangeAppointment,
    };
    if (timeRangeAppointment === 'custom') {
      paramsTable.filter = {
        ...paramsTable?.filter,
        timeStart: moment(customAppointment[0]).format('L'),
        timeEnd: moment(customAppointment[1]).format('L'),
      };
    }
    paramsTable.merchantType = 0;
    const res = await DashBoardService.getAppointment(paramsTable);
    const dataStemp = [];
    if (res?.data.data && res?.data?.data?.length > 0) {
      res?.data?.data?.forEach((item) => {
        const currency = item?.value.toString();
        const result = Number(currency.replace(/[^0-9.]+/g, ''));
        dataStemp.push({
          value: result,
          values: result,
          name: item?.label === 'WebApp' ? 'Website/App' : item?.label,
        });
      });
    }
    const results = Number(res?.data?.total.replace(/[^0-9.]+/g, ''));
    await setDataAppointment({ data: dataStemp, total: results });
    await echartDoughnut({
      id: 'chart1',
      color: ['#34A853', '#4285F4', '#FBA705'],
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 15,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: true,
          },
          data: dataStemp,
        },
      ],
    });
  };

  const loaddingGif = async () => {
    const paramsTable = {};
    paramsTable.filter = {
      quickFilter: timeRangeGif,
    };
    if (timeRangeGif === 'custom') {
      paramsTable.filter = {
        ...paramsTable?.filter,
        timeStart: moment(customGif[0]).format('L'),
        timeEnd: moment(customGif[1]).format('L'),
      };
    }
    const res = await DashBoardService.getGifCard(paramsTable);
    await setDataGif(res?.data);
  };

  const loaddingConsumer = async () => {
    const paramsTable = {};
    paramsTable.filter = {
      quickFilter: timeRangeConsumer,
    };
    if (timeRangeConsumer === 'custom') {
      paramsTable.filter = {
        ...paramsTable?.filter,
        timeStart: moment(customConsumer[0]).format('L'),
        timeEnd: moment(customConsumer[1]).format('L'),
      };
    }
    const res = await DashBoardService.getConsumer(paramsTable);

    await setDataConsumer(res?.data);
  };

  useEffect(async () => {
    if (isState) {
      setIsLoading(true);
      Promise.all([
        loaddingMerchant(),
        loaddingAppointment(),
        loaddingConsumer(),
        loaddingGif(),
        loaddingOrder(),
        loaddingTransaction(),
      ])
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error(`erors:`, error);
        });

      setIsState(false);
    }
  }, []);

  useEffect(async () => {
    if (!isState) {
      await setIsLoading(true);
      await loaddingMerchant();
      await setIsLoading(false);
    }
  }, [customMerchant, timeRangeMerchant]);

  useEffect(async () => {
    if (!isState) {
      await setIsLoading(true);
      await loaddingAppointment();
      await setIsLoading(false);
    }
  }, [customAppointment, timeRangeAppointment]);

  useEffect(async () => {
    if (!isState) {
      await setIsLoading(true);
      await loaddingOrder();
      await setIsLoading(false);
    }
  }, [customOrder, timeRangeOrder]);

  useEffect(async () => {
    if (!isState) {
      await setIsLoading(true);
      await loaddingTransaction();
      await setIsLoading(false);
    }
  }, [customTransaction, timeRangeTransaction]);

  useEffect(async () => {
    if (!isState) {
      await setIsLoading(true);
      await loaddingGif();
      await setIsLoading(false);
    }
  }, [customGif, timeRangeGif]);

  useEffect(async () => {
    if (!isState) {
      await setIsLoading(true);
      await loaddingConsumer();
      await setIsLoading(false);
    }
  }, [customConsumer, timeRangeConsumer]);

  const handleExport = async (text) => {
    var data = null;

    if (text === 'Appointment') {
      await setIsLoading(true);
      const paramsTable = {};
      paramsTable.filter = {
        quickFilter: timeRangeAppointment,
      };
      if (timeRangeAppointment === 'custom') {
        paramsTable.filter = {
          ...paramsTable?.filter,
          timeStart: moment(customAppointment[0]).format('L'),
          timeEnd: moment(customAppointment[1]).format('L'),
        };
      }
      paramsTable.merchantType = 0;
      const res = await DashBoardService.getExport(paramsTable, 'AdminDashboard/appointment/export');
      data = res?.data;
      await setIsLoading(false);
    }

    if (text === 'Order') {
      await setIsLoading(true);
      const paramsTable = {};
      paramsTable.filter = {
        quickFilter: timeRangeOrder,
      };
      if (timeRangeOrder === 'custom') {
        paramsTable.filter = {
          ...paramsTable?.filter,
          timeStart: moment(customOrder[0]).format('L'),
          timeEnd: moment(customOrder[1]).format('L'),
        };
      }
      paramsTable.merchantType = 1;
      const res = await DashBoardService.getExport(paramsTable, 'AdminDashboard/appointment/export');
      data = res?.data;
      await setIsLoading(false);
    }

    if (text === 'Merchant') {
      await setIsLoading(true);
      const paramsTable = {};
      paramsTable.filter = {
        quickFilter: timeRangeMerchant,
      };
      if (timeRangeMerchant === 'custom') {
        paramsTable.filter = {
          ...paramsTable?.filter,
          timeStart: moment(customMerchant[0]).format('L'),
          timeEnd: moment(customMerchant[1]).format('L'),
        };
      }
      paramsTable.merchantType = 1;
      const res = await DashBoardService.getExport(paramsTable, 'AdminDashboard/merchant/export');
      data = res?.data;
      await setIsLoading(false);
    }

    if (text === 'Consumer') {
      await setIsLoading(true);
      const paramsTable = {};
      paramsTable.filter = {
        quickFilter: timeRangeConsumer,
      };
      if (timeRangeConsumer === 'custom') {
        paramsTable.filter = {
          ...paramsTable?.filter,
          timeStart: moment(customConsumer[0]).format('L'),
          timeEnd: moment(customConsumer[1]).format('L'),
        };
      }

      const res = await DashBoardService.getExport(paramsTable, 'AdminDashboard/consumer/export');
      data = res?.data;
      await setIsLoading(false);
    }

    if (text === 'Gif') {
      await setIsLoading(true);
      const paramsTable = {};
      paramsTable.filter = {
        quickFilter: timeRangeGif,
      };
      if (timeRangeGif === 'custom') {
        paramsTable.filter = {
          ...paramsTable?.filter,
          timeStart: moment(customGif[0]).format('L'),
          timeEnd: moment(customGif[1]).format('L'),
        };
      }
      const res = await DashBoardService.getExport(paramsTable, 'AdminDashboard/giftCard/export');
      data = res?.data;
      await setIsLoading(false);
    }

    if (text === 'Transaction') {
      await setIsLoading(true);
      const paramsTable = {};
      paramsTable.filter = {
        quickFilter: timeRangeTransaction,
      };
      if (timeRangeTransaction === 'custom') {
        paramsTable.filter = {
          ...paramsTable?.filter,
          timeStart: moment(customTransaction[0]).format('L'),
          timeEnd: moment(customTransaction[1]).format('L'),
        };
      }
      const res = await DashBoardService.getExport(paramsTable, 'AdminDashboard/paymentTransaction/export');
      data = res?.data;
      await setIsLoading(false);
    }

    if (data) {
      setLinkExport(data);
      setIsExport(true);
    }
  };

  return (
    <Fragment>
      <Spin spinning={isLoadding}>
        <Modal
          // isLoading={isLoadings}
          // setIsLoading={setIsLoadings}
          open={isExport}
          onCancel={() => setIsExport(false)}
          footer={null}
          width={700}
          title={<div className="text-[20px] text-[#363636] font-semibold">Click below link to download</div>}
        >
          <div className="modalExport">
            <img src={Check} alt="img" />
            {linkExport && linkExport !== '' && <a href={linkExport}>Download link</a>}
          </div>
        </Modal>
        <div className=" text-[24px] text-[#000000] font-[600]">Dashboard</div>
        <div className="mt-[26px] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 pb-[100px] dashboard">
          <div className="mr-0 xl:mr-4 bg-white p-6 rounded-[14px] min-h-[250px]">
            <div className="flex justify-between flex-wrap items-start">
              <div>
                <div className="text-[#363636] text-[36px] font-[600] mr-2 leading-[36px]">
                  {dataAppointment?.total ? dataAppointment?.total : 0}
                </div>
                <div className="mt-[7px] text-[#555555] text-[15px] font-[600] mr-2">Appointment Total</div>
              </div>
              <div className="flex items-center justify-end flex-1 flex-wrap flex-wrap">
                <div className="flex items-center mr-2 mb-1">
                  <Select
                    value={timeRangeAppointment}
                    onChange={(value) => {
                      setTimeRangeAppointment(value);
                    }}
                    className="min-w-[130px]"
                  >
                    <Select.Option value="yesterday">Yesterday</Select.Option>
                    <Select.Option value="today">Today</Select.Option>
                    <Select.Option value="thisWeek">This Week</Select.Option>
                    <Select.Option value="lastWeek">Last Week</Select.Option>
                    <Select.Option value="thisMonth">This Month</Select.Option>
                    <Select.Option value="lastMonth">Last Month</Select.Option>
                    <Select.Option value="custom">Custom</Select.Option>
                  </Select>
                </div>
                {timeRangeAppointment === 'custom' && (
                  <div className="mr-2 flex items-center mb-1">
                    <p className="text-black font-medium mr-1">From To</p>
                    <DatePicker.RangePicker
                      defaultValue={[moment(customAppointment[0]), moment(customAppointment[1])]}
                      onChange={(e) => {
                        if (e) {
                          setCustomAppointment(e);
                        } else {
                          setCustomAppointment([new Date(year, month, 1), new Date(year, month + 1, 0)]);
                        }
                      }}
                      className="w-[240px]"
                      format="MM/DD/YYYY"
                    />
                  </div>
                )}
                <button
                  className="border-[1px] border-[#0A69AD] rounded-[6px] px-[16px] py-[10px] mr-2 mb-1 "
                  onClick={() => handleExport('Appointment')}
                >
                  <div className="flex items-center">
                    <img src={Export}></img>
                    <div className="ml-[3px] leading-[17px] text-[14px] text-[#0A69AD] font-[600]">Export</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex">
              <div className="w-[50%] flex items-center">
                <div className="w-full">
                  {dataAppointment?.data &&
                    dataAppointment?.data?.length > 0 &&
                    dataAppointment?.data?.map((item, index) => {
                      return (
                        <div key={index + 'chartMerchant'} className="flex justify-between">
                          <div className="flex">
                            <div
                              className={classNames('h-[16px] w-[16px] rounded-[4px] mb-[8px]', {
                                'bg-[#27AE60]': item?.name === 'POS' || item?.name === 'Store',
                                'bg-[#4285F4]': item?.name === 'Website/App' || item?.name === 'Website',
                                'bg-[#FBA705]': item?.name === 'Other' || item?.name === 'CallOrder',
                              })}
                            ></div>
                            <div className="ml-2 text-[#363636] font-[400] text-[14px]">{item?.name}</div>
                          </div>
                          <div className="text-[#363636] font-[600] text-[14px]">{item?.values}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="w-[50%] flex justify-end">
                <div className="relative h-[150px] w-[150px]" id="chart1" />
              </div>
            </div>
          </div>
          <div className="mr-0 mt-4 xl:mt-0 xl:mr-4 bg-white p-6 rounded-[14px] min-h-[250px]">
            <div className="flex justify-between flex-wrap items-start">
              <div>
                <div className="text-[#363636] text-[36px] font-[600] mr-2 leading-[36px]">
                  {dataOrder?.total ? dataOrder?.total : 0}
                </div>
                <div className="mt-[7px] text-[#555555] text-[15px] font-[600] mr-2">Order Total</div>
              </div>
              <div className="flex items-center justify-end flex-1 flex-wrap flex-wrap">
                <div className="flex items-center mr-2 mb-1">
                  <Select
                    value={timeRangeOrder}
                    onChange={(value) => {
                      setTimeRangeOrder(value);
                    }}
                    className="min-w-[130px]"
                  >
                    <Select.Option value="yesterday">Yesterday</Select.Option>
                    <Select.Option value="today">Today</Select.Option>
                    <Select.Option value="thisWeek">This Week</Select.Option>
                    <Select.Option value="lastWeek">Last Week</Select.Option>
                    <Select.Option value="thisMonth">This Month</Select.Option>
                    <Select.Option value="lastMonth">Last Month</Select.Option>
                    <Select.Option value="custom">Custom</Select.Option>
                  </Select>
                </div>
                {timeRangeOrder === 'custom' && (
                  <div className="mr-2 flex items-center mb-1">
                    <p className="text-black font-medium mr-1">From To</p>
                    <DatePicker.RangePicker
                      defaultValue={[moment(customOrder[0]), moment(customOrder[1])]}
                      onChange={(e) => {
                        if (e) {
                          setCustomOrder(e);
                        } else {
                          setCustomOrder([new Date(year, month, 1), new Date(year, month + 1, 0)]);
                        }
                      }}
                      className="w-[240px]"
                      format="MM/DD/YYYY"
                    />
                  </div>
                )}
                <button
                  className="border-[1px] border-[#0A69AD] rounded-[6px] px-[16px] py-[10px] mr-2 mb-1 "
                  onClick={() => handleExport('Order')}
                >
                  <div className="flex items-center">
                    <img src={Export}></img>
                    <div className="ml-[3px] leading-[17px] text-[14px] text-[#0A69AD] font-[600]">Export</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex">
              <div className="w-[50%] flex items-center">
                <div className="w-full">
                  {dataOrder?.data &&
                    dataOrder?.data?.length > 0 &&
                    dataOrder?.data?.map((item, index) => {
                      return (
                        <div key={index + 'chartMerchant'} className="flex justify-between">
                          <div className="flex">
                            <div
                              className={classNames('h-[16px] w-[16px] rounded-[4px] mb-[8px]', {
                                'bg-[#27AE60]': item?.name === 'POS' || item?.name === 'Store',
                                'bg-[#4285F4]': item?.name === 'Website/App' || item?.name === 'Website',
                                'bg-[#FBA705]': item?.name === 'Other' || item?.name === 'CallOrder',
                              })}
                            ></div>
                            <div className="ml-2 text-[#363636] font-[400] text-[14px]">{item?.name}</div>
                          </div>
                          <div className="text-[#363636] font-[600] text-[14px]">{item?.values}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="w-[50%] flex justify-end">
                <div className="relative h-[150px] w-[150px]" id="chart2" />
              </div>
            </div>
          </div>
          <div className="mr-0 mt-4  xl:mr-4 bg-white p-6 rounded-[14px] min-h-[280px]">
            <div className="flex justify-between flex-wrap items-start">
              <div>
                <div className="text-[#363636] text-[36px] font-[600] mr-2 leading-[36px]">
                  {dataMerChant?.total ? dataMerChant?.total : 0}
                </div>
                <div className="mt-[7px] text-[#555555] text-[15px] font-[600] mr-2">New Merchant</div>
              </div>
              <div className="flex items-center justify-end flex-1 flex-wrap flex-wrap">
                <div className="flex items-center mr-2 mb-1">
                  <Select
                    value={timeRangeMerchant}
                    onChange={(value) => {
                      setTimeRangeMerchant(value);
                    }}
                    className="min-w-[130px]"
                  >
                    <Select.Option value="yesterday">Yesterday</Select.Option>
                    <Select.Option value="today">Today</Select.Option>
                    <Select.Option value="thisWeek">This Week</Select.Option>
                    <Select.Option value="lastWeek">Last Week</Select.Option>
                    <Select.Option value="thisMonth">This Month</Select.Option>
                    <Select.Option value="lastMonth">Last Month</Select.Option>
                    <Select.Option value="custom">Custom</Select.Option>
                  </Select>
                </div>
                {timeRangeMerchant === 'custom' && (
                  <div className="mr-2 flex items-center mb-1">
                    <p className="text-black font-medium mr-1">From To</p>
                    <DatePicker.RangePicker
                      defaultValue={[moment(customMerchant[0]), moment(customMerchant[1])]}
                      onChange={(e) => {
                        if (e) {
                          setCustomMerchant(e);
                        } else {
                          setCustomMerchant([new Date(year, month, 1), new Date(year, month + 1, 0)]);
                        }
                      }}
                      className="w-[240px]"
                      format="MM/DD/YYYY"
                    />
                  </div>
                )}
                <button
                  className="border-[1px] border-[#0A69AD] rounded-[6px] px-[16px] py-[10px] mr-2 mb-1 "
                  onClick={() => handleExport('Merchant')}
                >
                  <div className="flex items-center">
                    <img src={Export}></img>
                    <div className="ml-[3px] leading-[17px] text-[14px] text-[#0A69AD] font-[600]">Export</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex">
              <div className="w-[50%] flex items-center">
                <div className="w-full">
                  {dataMerChant?.data &&
                    dataMerChant?.data?.length > 0 &&
                    dataMerChant?.data?.map((item, index) => {
                      return (
                        <div key={index + 'chartMerchant'} className="flex justify-between">
                          <div className="flex">
                            <div
                              className={classNames('h-[16px] w-[16px] rounded-[4px] mb-3', {
                                'bg-[#FBA705]': item?.name === 'Pending Request',
                                'bg-[#EB5757]': item?.name === 'Rejected Request',
                                'bg-[#2F80ED]': item?.name === 'Approved Request',
                              })}
                            ></div>
                            <div className="ml-2 text-[#363636] font-[400] text-[14px]">{item?.name}</div>
                          </div>
                          <div className="text-[#363636] font-[600] text-[14px]">{item?.values}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="w-[50%] flex justify-end">
                <div className="relative h-[150px] w-[150px]" id="chart3" />
              </div>
            </div>
          </div>
          <div className="mr-0 mt-4 xl:mr-4 bg-white p-6 rounded-[14px] min-h-[280px]">
            <div className="flex justify-between flex-wrap items-start">
              <div>
                <div className="text-[#363636] text-[36px] font-[600] mr-2 leading-[36px]">
                  {dataConsumer?.totalConsumer ? dataConsumer?.totalConsumer : 0}
                </div>
                <div className="mt-[7px] text-[#555555] text-[15px] font-[600] mr-2">Consumer Total</div>
              </div>
              <div className="flex items-center justify-end flex-1 flex-wrap">
                <div className="flex items-center mr-2 mb-1">
                  <Select
                    value={timeRangeConsumer}
                    onChange={(value) => {
                      setTimeRangeConsumer(value);
                    }}
                    className="min-w-[130px]"
                  >
                    <Select.Option value="yesterday">Yesterday</Select.Option>
                    <Select.Option value="today">Today</Select.Option>
                    <Select.Option value="thisWeek">This Week</Select.Option>
                    <Select.Option value="lastWeek">Last Week</Select.Option>
                    <Select.Option value="thisMonth">This Month</Select.Option>
                    <Select.Option value="lastMonth">Last Month</Select.Option>
                    <Select.Option value="custom">Custom</Select.Option>
                  </Select>
                </div>
                {timeRangeConsumer === 'custom' && (
                  <div className="mr-2 flex items-center mb-1">
                    <p className="text-black font-medium mr-1">From To</p>
                    <DatePicker.RangePicker
                      defaultValue={[moment(customConsumer[0]), moment(customConsumer[1])]}
                      onChange={(e) => {
                        if (e) {
                          setCustomConsumer(e);
                        } else {
                          setCustomConsumer([new Date(year, month, 1), new Date(year, month + 1, 0)]);
                        }
                      }}
                      className="w-[240px]"
                      format="MM/DD/YYYY"
                    />
                  </div>
                )}
                <button
                  className="border-[1px] border-[#0A69AD] rounded-[6px] px-[16px] py-[10px] mr-2 mb-1 "
                  onClick={() => handleExport('Consumer')}
                >
                  <div className="flex items-center">
                    <img src={Export}></img>
                    <div className="ml-[3px] leading-[17px] text-[14px] text-[#0A69AD] font-[600]">Export</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex">
              <div className="w-[50%] flex items-center mr-[10px]">
                <div className="h-[132px] mt-[25px] flex justify-center items-center bg-[#2F80ED] rounded-[17px] w-[100%]">
                  <div>
                    <div className="text-[32px] text-[#FFFFFF] font-[600] leading-[39px] w-[100%] text-center">
                      {dataConsumer?.totalLogin ? dataConsumer?.totalLogin : 0}
                    </div>
                    <div className="text-[14px] text-[#FFFFFF] font-[600] leading-[17px] w-[100%] text-center">
                      Login Total
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[50%] flex items-center ml-[10px]">
                <div className="h-[132px] mt-[25px] flex justify-center items-center bg-[#27AE60] rounded-[17px] w-[100%]">
                  <div>
                    <div className="text-[32px] text-[#FFFFFF] font-[600] leading-[39px] w-[100%] text-center">
                      ${dataConsumer?.totalAmount ? dataConsumer?.totalAmount : 0}
                    </div>
                    <div className="text-[14px] text-[#FFFFFF] font-[600] leading-[17px] w-[100%] text-center">
                      Amount Total
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mr-0 mt-4 xl:mr-4 bg-white p-6 rounded-[14px] min-h-[450px]">
            <div className="flex justify-between flex-wrap items-start">
              <div>
                <div className="text-[#363636] text-[36px] font-[600] mr-2 leading-[36px]">
                  {dataGif?.total ? dataGif?.total : 0}
                </div>
                <div className="mt-[7px] text-[#555555] text-[15px] font-[600] mr-2">Gift Card Total</div>
              </div>
              <div className="flex items-center justify-end flex-1 flex-wrap">
                <div className="flex items-center mr-2 mb-1">
                  <Select
                    value={timeRangeGif}
                    onChange={(value) => {
                      setTimeRangeGif(value);
                    }}
                    className="min-w-[130px]"
                  >
                    <Select.Option value="yesterday">Yesterday</Select.Option>
                    <Select.Option value="today">Today</Select.Option>
                    <Select.Option value="thisWeek">This Week</Select.Option>
                    <Select.Option value="lastWeek">Last Week</Select.Option>
                    <Select.Option value="thisMonth">This Month</Select.Option>
                    <Select.Option value="lastMonth">Last Month</Select.Option>
                    <Select.Option value="custom">Custom</Select.Option>
                  </Select>
                </div>
                {timeRangeGif === 'custom' && (
                  <div className="mr-2 flex items-center mb-1">
                    <p className="text-black font-medium mr-1">From To</p>
                    <DatePicker.RangePicker
                      defaultValue={[moment(customGif[0]), moment(customGif[1])]}
                      onChange={(e) => {
                        if (e) {
                          setCustomGif(e);
                        } else {
                          setCustomGif([new Date(year, month, 1), new Date(year, month + 1, 0)]);
                        }
                      }}
                      className="w-[240px]"
                      format="MM/DD/YYYY"
                    />
                  </div>
                )}
                <button
                  className="border-[1px] border-[#0A69AD] rounded-[6px] px-[16px] py-[10px] mr-2 mb-1 "
                  onClick={() => handleExport('Gif')}
                >
                  <div className="flex items-center">
                    <img src={Export}></img>
                    <div className="ml-[3px] leading-[17px] text-[14px] text-[#0A69AD] font-[600]">Export</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex">
              <div className="w-[50%] flex items-center mr-[10px]">
                <div className="h-[132px] mt-[25px] flex justify-center items-center bg-[#2F80ED] rounded-[17px] w-[100%]">
                  <div>
                    <div className="text-[36px] text-[#FFFFFF] font-[600] leading-[39px] w-[100%] text-center">
                      {dataGif?.totalSold ? dataGif?.totalSold : 0}
                    </div>
                    <div className="text-[14px] text-[#FFFFFF] font-[600] leading-[17px] w-[100%] text-center">
                      Total Sold
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[50%] flex items-center ml-[10px]">
                <div className="h-[132px] mt-[25px] flex justify-center items-center bg-[#FBA705] rounded-[17px] w-[100%]">
                  <div>
                    <div className="text-[36px] text-[#FFFFFF] font-[600] leading-[39px] w-[100%] text-center">
                      {dataGif?.totalUsage ? dataGif?.totalUsage : 0}
                    </div>
                    <div className="text-[14px] text-[#FFFFFF] font-[600] leading-[17px] w-[100%] text-center">
                      Total Usage
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="w-[50%] flex items-center mr-[10px]">
                <div className="h-[132px] mt-[25px] flex justify-center items-center bg-[#2F80ED] rounded-[17px] w-[100%]">
                  <div>
                    <div className="text-[36px] text-[#FFFFFF] font-[600] leading-[39px] w-[100%] text-center">
                      ${dataGif?.amountSold ? dataGif?.amountSold : 0}
                    </div>
                    <div className="text-[14px] text-[#FFFFFF] font-[600] leading-[17px] w-[100%] text-center">
                      Amount Sold
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[50%] flex items-center ml-[10px]">
                <div className="h-[132px] mt-[25px] flex justify-center items-center bg-[#FBA705] rounded-[17px] w-[100%]">
                  <div>
                    <div className="text-[36px] text-[#FFFFFF] font-[600] leading-[39px] w-[100%] text-center">
                      ${dataGif?.amountUsage ? dataGif?.amountUsage : 0}
                    </div>
                    <div className="text-[14px] text-[#FFFFFF] font-[600] leading-[17px] w-[100%] text-center">
                      Amount Usage
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mr-0 mt-4 xl:mr-4 bg-white p-6 rounded-[14px] min-h-[450px]">
            <div className="flex flex-wrap justify-between">
              <div>
                <div className="text-[#363636] text-[36px] font-[600] mr-2 leading-[36px]">${dataTransaction}</div>
                <div className="mt-[7px] text-[#555555] text-[15px] font-[600] mr-2">Payment Transaction</div>
              </div>
              <div className="flex items-center justify-end flex-1 flex-wrap">
                <div className="flex items-center mr-2 mb-1">
                  <Select
                    value={timeRangeTransaction}
                    onChange={(value) => {
                      setTimeRangeTransaction(value);
                    }}
                    className="min-w-[130px]"
                  >
                    <Select.Option value="yesterday">Yesterday</Select.Option>
                    <Select.Option value="today">Today</Select.Option>
                    <Select.Option value="thisWeek">This Week</Select.Option>
                    <Select.Option value="lastWeek">Last Week</Select.Option>
                    <Select.Option value="thisMonth">This Month</Select.Option>
                    <Select.Option value="lastMonth">Last Month</Select.Option>
                    <Select.Option value="custom">Custom</Select.Option>
                  </Select>
                </div>
                {timeRangeTransaction === 'custom' && (
                  <div className="mr-2 flex items-center mb-1">
                    <p className="text-black font-medium mr-1">From To</p>
                    <DatePicker.RangePicker
                      defaultValue={[moment(customTransaction[0]), moment(customTransaction[1])]}
                      onChange={(e) => {
                        if (e) {
                          setCustomTransaction(e);
                        } else {
                          setCustomTransaction([new Date(year, month, 1), new Date(year, month + 1, 0)]);
                        }
                      }}
                      className="w-[240px]"
                      format="MM/DD/YYYY"
                    />
                  </div>
                )}
                <button
                  className="border-[1px] border-[#0A69AD] rounded-[6px] px-[16px] py-[10px] mr-2 mb-1 "
                  onClick={() => handleExport('Transaction')}
                >
                  <div className="flex items-center">
                    <img src={Export}></img>
                    <div className="ml-[3px] leading-[17px] text-[14px] text-[#0A69AD] font-[600]">Export</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="">
              <div className="h-[350px]" id="chart-user" />
            </div>
          </div>
        </div>
      </Spin>
    </Fragment>
  );
};
export default Page;
