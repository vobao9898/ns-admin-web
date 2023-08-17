import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'components';

import { useAuth } from 'globalContext';
import { ColumnRejectedRequest } from 'columns/request-management';

import { RequestManagementService } from 'services/request-management';
import { useLocation, useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import { Spin, Select } from 'antd';
import Title from 'layouts/components/title';
import AccountService from 'services/accounts';
import { Button } from 'layouts/components';

const RejectedRequest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(state?.status ? state?.status : 0);
  const [parram, setParram] = useState({ page: '1', perPage: '100', pages: 0 });
  const [dataSelect, setDataSelect] = useState([{ value: 0, label: 'All' }]);

  const configDataSelect = (data) => {
    const dataStemp = [...dataSelect];
    if (data.length > 0) {
      for(const item of data){
        dataStemp.push({ value: item?.waUserId, label: `${item?.firstName} ${item?.lastName}` });
      }
    }
    setDataSelect(dataStemp);
  };

  const loadDataSelect = async () => {
    const res = await AccountService.getUsers({ page: parram.page, perPage: parram.perPage });
    await setParram({ ...parram, pages: res.pages });
    await configDataSelect(res.data);
  };

  useEffect(() => {
    loadDataSelect();
  }, []);

  const bread = [
    {
      name: 'Rejected Request',
    },
  ];
  const dataTableRef = useRef();

  const changeStatus = async (value) => {
    setIsLoading(true);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        rejectedBy: value,
      }));
    setStatus(value);
    setIsLoading(false);
  };

  const handleReset = async () => {
    if (status === 0) return;
    setIsLoading(true);
    dataTableRef?.current?.onChange &&
      (await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        rejectedBy: 0,
      }));
    setStatus(0);
    setIsLoading(false);
  };

  const onScroll = async (event) => {
    const target = event.target;
    const sum = target.scrollHeight - target.scrollTop - target.offsetHeight;
    if (sum < 1) {
      if (parseInt(parram.page) + 1 <= parram.pages) {
        const res = await AccountService.getUsers({ page: parseInt(parram.page) + 1, perPage: parram.perPage });
        configDataSelect(res.data);
        setParram({ ...parram, page: parseInt(parram.page) + 1, pages: res.pages });
      }
    }
  };

  return (
    <Spin spinning={false}>
      <Title title={'Rejected Request'} breadcrumbs={bread} />
      <div className="p-4 shadow rounded-xl bg-gray-50">
        <DataTable
          ref={dataTableRef}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          searchPlaceholder={'Search...'}
          Get={RequestManagementService.getRejecteds}
          columns={ColumnRejectedRequest({ t, formatDate })}
          onRow={(item) => ({
            onClick: () => navigate(`${routerLinks('Rejected Request')}/${item.merchantId}`),
          })}
          subHeader={() => (
            <div className="flex items-center mb-5">
              <div className="flex items-center">
                <h3 className="mr-2">Rejected by: </h3>
                <Select
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
                  style={{ width: '150px' }}
                  value={status}
                  options={dataSelect}
                  onChange={(value) => changeStatus(value)}
                  onPopupScroll={(e) => onScroll(e)}
                ></Select>
              </div>
              <Button name="Reset" type="ok" moreClass="ml-5" onClick={() => handleReset()} />
            </div>
          )}
        />
      </div>
    </Spin>
  );
};

export default RejectedRequest;
