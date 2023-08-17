import { HookDataTable } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { routerLinks } from 'utils';
import { Title, Button } from 'layouts/components';
import ReportService from 'services/reports';

const GiftCardSoldProfile = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [filter] = useState(state);
  const navigate = useNavigate();

  const [summary, setSumary] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state?.date) {
      window.localStorage.setItem('giftcardsold-date', JSON.stringify(state?.date));
    }
  }, []);

  const [, DetailTable] = HookDataTable({
    columns: [
      {
        title: 'ID',
        name: 'giftCardId',
        tableItem: {
          sorter: true,
          render: (text) => {
            text = '' + text;
            if (text.indexOf('Total') > -1) {
              return <p className="font-bold">{text}</p>;
            }
            return text;
          },
        },
      },
      {
        title: 'Serial',
        name: 'serialNumber',
        tableItem: {
          sorter: true,
        },
      },
      {
        title: 'Value',
        name: 'value',
        tableItem: {
          sorter: true,
          render: (text) => {
            text = '' + text;
            if (text.indexOf('Total') > -1) {
              text = text.replace('Total', '');
              return <p className="font-bold">${text}</p>;
            }
            return <p>${text}</p>;
          },
        },
      },
    ],
    Get: async (params, id) => {
      const res = await ReportService.getGiftCardSoldById(id, params);
      setSumary(res?.summary);
      return res;
    },
    id: () => id,
    isLoading,
    setIsLoading,
    showSearch: false,
    subHeader: () => (
      <div className="flex items-center mb-5">
        <p className="text-black text-sm font-semibold mr-5">Total Row: {summary?.quantity}</p>
        <p className="text-black text-sm font-semibold">Total AMount: {summary?.amount}</p>
      </div>
    ),
  });

  const bread = [
    {
      name: 'Reports',
    },
    {
      name: 'Gift Card Sold',
      path: 'Gift Card Sold',
    },
    {
      name: 'Detail',
    },
  ];

  return (
    <div className="">
      <Title title="Gift Card Sold" breadcrumbs={bread} />

      <div className="mb-5 p-4 shadow rounded-xl bg-gray-50">
        <div className="flex item-center justify-between">
          <h2 className="text-xl font-semibold text-black">Merchant ID: {id}</h2>
          <Button name="BACK" onClick={() => navigate(routerLinks('Gift Card Sold'), { state: { ...filter } })} />
        </div>
        {DetailTable()}
      </div>
    </div>
  );
};

export default GiftCardSoldProfile;
