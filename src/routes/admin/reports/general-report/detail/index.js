import { DatePicker, Select } from 'antd';
import { Button, Title } from 'layouts/components'
import moment from 'moment';
import { useState, React, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ColumnApprovedMerchantAcount, ColumnUsersDownloadTheApp, ColumnAmountOfHarmonyAppAccount } from 'columns/reports';
import ReportService from 'services/reports';
import { HookDataTable } from 'hooks';
import { routerLinks } from 'utils';

const DetailGeneralReport = (props) => {
  const param = useParams();

  const navigate = useNavigate();

  const [dataTitle, setDataTitle] = useState({});

  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('thisMonth');
  const [groupBy, setGroupBy] = useState('thisMonth');
  const [custom, setCustom] = useState([new Date(year, month, 1), new Date(year, month + 1, 0)]);

  const dataGeneral = [
    {
      name: 'Approved Merchant Accounts',
      title: 'Approved-Merchant-Accounts'
    },
    {
      name: 'Users Download The App',
      title: 'Users-Download-The-App'
    },
    {
      name: 'Amount Of Harmony App Accounts',
      title: 'Amount-Of-Harmony-App-Accounts'
    },
    {
      name: 'Amount Of Harmony App Pay Accounts',
      title: 'Amount-Of-Harmony-App-Pay-Accounts'
    },
    {
      name: 'Amount Of Users Using The Harmony App',
      title: 'Amount-Of-Users-Using-The-Harmony-App'
   },
    {
      name: 'Average Amount Of Time Spent Per User',
      title: 'Average-Amount-Of-Time-Spent-Per-User'
    }
  ]

  const changeTable = useCallback(async (params) => {
    onChange && (await onChange(params));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (paramsTable.filter) {
      setTimeRange(paramsTable?.filter?.quickFilter);
      setGroupBy(paramsTable?.filter?.groupBy);
      if (paramsTable?.filter?.quickFilter === 'custom') {
        setCustom([paramsTable?.filter?.timeStart, paramsTable?.filter?.timeEnd]);
      }
    }
    if(param){
      const dataStemp = dataGeneral.filter((item)=> item.title === param?.title)
      if(dataStemp.length>0){
        setDataTitle(dataStemp[0])
      }
    }
  }, []);

  useEffect(() => {
    paramsTable.filter = {
      quickFilter: timeRange,
      groupBy: groupBy,
    };
    if (timeRange === 'custom') {
      paramsTable.filter = {
        ...paramsTable?.filter,
        timeStart: moment(custom[0]).format('L'),
        timeEnd: moment(custom[1]).format('L'),
      };
    }
    changeTable(paramsTable);
  }, [changeTable, timeRange, custom, groupBy]);

  const resetFilter = () => {
    setTimeRange('thisMonth');
    setCustom([]);
    setGroupBy('thisMonth')
  };

  const handleExport = async () => {
    // setIsLoading(true);
    // const res = await MerchantService.serviceExport(merchant?.merchantId);
    // window.open(res);
    // setIsLoading(false);
  };

  const subHeader = (
    <div className="">
       <div className='flex justify-end'>
       <Button
      name="BACK"
      type="ok"
      onClick={() => navigate(routerLinks('General Report'))}
    />
       </div>
      <div className="mb-5 flex items-end flex-wrap">
        <div className="mr-5 mb-3">
          <p className="mr-2 text-black-500 font-medium mb-2">Time Range</p>
          <Select value={timeRange} onChange={(value) => setTimeRange(value)} className="min-w-[130px]">
            <Select.Option value="today">Today</Select.Option>
            <Select.Option value="yesterday">Yesterday</Select.Option>
            <Select.Option value="thisWeek">This Week</Select.Option>
            <Select.Option value="lastWeek">Last Week</Select.Option>
            <Select.Option value="thisMonth">This Month</Select.Option>
            <Select.Option value="lastMonth">Last Month</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
        </div>
        <div className="mr-5 mb-3">
          <p className="mr-2 text-black-500 font-medium mb-2">Group by</p>
          <Select value={groupBy} onChange={(value) => setGroupBy(value)} className="min-w-[130px]">
            <Select.Option value="today">Today</Select.Option>
            <Select.Option value="yesterday">Yesterday</Select.Option>
            <Select.Option value="thisWeek">This Week</Select.Option>
            <Select.Option value="lastWeek">Last Week</Select.Option>
            <Select.Option value="thisMonth">This Month</Select.Option>
            <Select.Option value="lastMonth">Last Month</Select.Option>
          </Select>
        </div>

        {timeRange === 'custom' && (
          <div className="mr-5 flex items-center mb-3">
            <p className="text-black font-medium mr-2">Group by</p>
            <DatePicker.RangePicker
              defaultValue={[moment(custom[0]), moment(custom[1])]}
              onChange={(e) => setCustom(e)}
              className="w-[260px]"
              format={'MM/DD/YYYY'}
            />
          </div>
        )}

        <div>
        <Button name="Reset" type="ok" onClick={() => resetFilter()} moreClass="lg:ml-auto mb-3" />
        </div>
      </div>
      <div className='flex justify-end'>
       <Button
      name="EXPORT"
      type="ok"
      onClick={() => handleExport()}
    />
       </div>
    </div>
  );

  const column = () =>{
    switch(param.title) {
      case "Users-Download-The-App":
        return ColumnUsersDownloadTheApp();
      case "Amount-Of-Harmony-App-Accounts":
       return ColumnAmountOfHarmonyAppAccount();
      default:
       return ColumnApprovedMerchantAcount();
    }
  }

  const [onChange, TransactionsTable, paramsTable] = HookDataTable({
    columns:  column(),
    Get: async (params, id) => {
      const res = await ReportService.getTransactions(params);
      return res;
    },
    isLoading,
    setIsLoading,
    loadFirst: false,
    subHeader: () => subHeader,
    searchPlaceholder: 'Search...',
    xScroll: '100vw',
    showSearch: false
  });

  const bread = [
    {
      name: 'Reports',
    },
    {
      name: 'General Report',
    },
    {
      name: dataTitle.name ? dataTitle.name : '',
    }
  ];


  return (
    <div className="">
    <Title title="General Report" breadcrumbs={bread} />
    <div className="p-4 rounded-xl shadow bg-gray-50">
        <div className='flex items-center'><div className='ml-2 font-bold text-xl text-blue-700'>{dataTitle.name ? dataTitle.name : ''}</div></div>
        <div className='mt-4'>
        <div className="w-full overflow-hidden">{TransactionsTable()}</div>
        </div>
    </div>
  </div>
  )
}

export default DetailGeneralReport
