import React, { useState, useEffect } from 'react';
import moment from 'moment';
import AccountService from 'services/accounts';
import { HookDataTable } from 'hooks';
import { ColumnLogs } from 'columns/accounts';
import { DatePicker, Select } from 'antd';
import { Title, Button } from 'layouts/components';

const Logs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState('0');
  const [dateRange, setDateRange] = useState([
    moment().utc().clone().startOf('month'),
    moment().utc().clone().endOf('month'),
  ]);
  let [params, setParams] = useState({
    userId: 0,
    timeStart: moment().utc().clone().startOf('month'),
    timeEnd: moment().utc().clone().endOf('month'),
  });
  const [listUser, setListUser] = useState([]);
  const bread = [
    {
      name: 'Accounts',
    },
    {
      name: 'Logs',
    },
  ];

  useEffect(async () => {
    const { data } = await AccountService.getUsersBrief();
    setListUser(data);
  }, []);

  const [handleLogsTableChange, LogsTable] = HookDataTable({
    id: () => params,
    isLoading,
    setIsLoading,
    showSearch: false,
    showPagination: true,
    columns: ColumnLogs(),
    Get: AccountService.getMerchantLog,
  });
  const onChangeFilter = (userId, dateRange) => {
    params = {
      userId,
      timeStart: dateRange ? dateRange[0] : null,
      timeEnd: dateRange ? dateRange[1] : null,
    };
    setParams(params);
    handleLogsTableChange();
  };
  const onDateRangeChange = (dateRange) => {
    setDateRange(dateRange ? returnMomentDateRange(dateRange[0], dateRange[1]) : []);
  };
  const returnMomentDateRange = (start, finish) => {
    return [moment(start, 'DD/MM/YYYY').utc(), moment(finish, 'DD/MM/YYYY').utc()];
  };
  const onResetFilter = () => {
    setDateRange([moment().utc().clone().startOf('month'), moment().utc().clone().endOf('month')]);
    setUser('0');
    params = {
      userId: '0',
      timeStart: moment().utc().clone().startOf('month'),
      timeEnd: moment().utc().clone().endOf('month'),
    };
    setParams(params);
    handleLogsTableChange();
  };
  return (
    <>
      <Title title="Logs" breadcrumbs={bread} />
      <div className="p-4 shadow rounded-xl bg-gray-50">
        <div className="mb-2 flex items-center">
          <div className="pr-5 flex items-center">
            <p className="mr-2 text-black font-medium w-1/3">Time Range</p>
            <DatePicker.RangePicker
              format="MM/DD/YYYY"
              value={dateRange !== '' ? dateRange : ''}
              onChange={(value) => {
                onDateRangeChange(value);
                onChangeFilter(user, value);
              }}
            />
          </div>
          <div className="mr-5 pr-5 flex items-center col-span-1">
            <p className="mr-2 text-black font-medium">User</p>
            <Select
              className="min-w-[150px]"
              value={user}
              onChange={(value) => {
                setUser(value);
                onChangeFilter(value, dateRange);
              }}
            >
              <Select.Option key="-1" value="0">
                All Users
              </Select.Option>
              {listUser.map((item, index) => (
                <Select.Option key={index} value={item.waUserId}>
                  {item.firstName + ' ' + item.lastName}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Button name="Reset" type="ok" onClick={() => onResetFilter()} />
        </div>
        {LogsTable()}
      </div>
    </>
  );
};

export default Logs;
