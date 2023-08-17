import { ColumnsMerchantBatchSettlementDetail } from 'columns/reports';
import { HookDataTable } from 'hooks';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import ReportService from 'services/reports';
import { routerLinks } from 'utils';
import { Title, Button } from 'layouts/components';

const MerchantBatchSettlementDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [filter] = useState(state);
  const { id } = useParams();

  const settlementId = id.split('-')[0];
  const merchantId = id.split('-')[1];

  const [isLoading, setIsLoading] = useState(false);

  const [, MerchantBatchSettlementDetailTable] = HookDataTable({
    columns: ColumnsMerchantBatchSettlementDetail(),
    Get: async () => {
      const data = await ReportService.getBatchById(settlementId);
      return data;
    },
    isLoading,
    setIsLoading,
    showSearch: false,
  });

  const bread = [
    {
      name: 'Reports',
    },
    {
      name: 'Batch',
      path: 'Merchant Batch Settlement',
    },
    {
      name: 'Detail',
    },
  ];

  return (
    <div className="p-4 mb-5 bg-gray-50 col-span-2 row-span-2 grid">
      <Title title="Merchant Batch Settlement" breadcrumbs={bread} />

      <div className="p-4 shadow rounded-xl">
        <div className="flex items-center justify-between">
          <p className="text-lg text-black font-semibold">Merchant ID: {merchantId}</p>
          <Button
            name="BACK"
            onClick={() => navigate(routerLinks('Merchant Batch Settlement'), { state: { ...filter } })}
          />
        </div>
        {MerchantBatchSettlementDetailTable()}
      </div>
    </div>
  );
};

export default MerchantBatchSettlementDetail;
