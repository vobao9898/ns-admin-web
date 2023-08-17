import React from 'react';
import { useNavigate } from 'react-router';
import { routerLinks } from 'utils';

const Title = ({ title = '', breadcrumbs = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-5 p-4 shadow rounded-xl bg-gray-50 flex items-center justify-between">
      <h2 className="text-black text-2xl font-bold">{title}</h2>
      <div className="flex items-center">
        <p className="cursor-pointer text-md font-bold text-black" onClick={() => navigate(routerLinks('Dashboard'))}>
          App
        </p>
        {breadcrumbs?.map((item, index) => {
          return (
            <div key={index} className="flex items-center">
              <i className="las la-angle-right px-1"></i>
              <p
                className={`
                    cursor-pointer text-md font-bold
                    ${index === breadcrumbs?.length - 1 ? 'text-blue-500' : 'text-black'}
                  `}
                onClick={() => item.path && navigate(routerLinks(item.path))}
              >
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Title;
