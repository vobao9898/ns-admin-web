import { Title } from 'layouts/components'
import React from 'react'
import {useNavigate } from 'react-router';

import { routerLinks } from 'utils';

const GeneralReport = () => {

  const navigate = useNavigate();

  const bread = [
    {
      name: 'Reports',
    },
    {
      name: 'General Report',
    },
  ];

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

  return (
    <div className="grid h-full">
      <Title title="General Report" breadcrumbs={bread} />
      <div className="p-4 rounded-xl shadow bg-gray-50 h-full">
          <div className='flex items-center'><i className="las la-chart-bar" style={{fontSize:'20px'}}></i><div className='ml-2 font-bold text-xl text-black'>Statistics</div></div>
          <div className='mt-4'>
              {dataGeneral && dataGeneral.map((item)=>{
                return <div key={item?.name} className='flex items-center justify-between border-b-2 mb-5 pb-1 cursor-pointer' onClick={()=> navigate(routerLinks('General Report') + '/' +item.title,{ state: { name: item.name } })}>
                    <div className='text-blue-700 font-bold text-lg'>{item.name}</div>
                    <i className="las la-angle-right flex justify-end" style={{fontSize: '20px'}}></i>
                </div>
              })}
          </div>
      </div>
    </div>
  )
}

export default GeneralReport;
