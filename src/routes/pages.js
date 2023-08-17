import React from 'react';
import { routerLinks } from 'utils';

export const pages = [
  {
    layout: React.lazy(() => import('../layouts/auth')),
    isPublic: true,
    child: [
      {
        path: routerLinks('Login'),
        component: React.lazy(() => import('./auth/login')),
        title: 'Login',
      },
      {
        path: routerLinks('Verify'),
        component: React.lazy(() => import('./auth/verify')),
        title: 'Verify',
      },
    ],
  },
  {
    layout: React.lazy(() => import('../layouts/admin')),
    isPublic: false,
    child: [
      {
        path: routerLinks('Dashboard'),
        component: React.lazy(() => import('./admin/dashboard')),
        title: 'Dashboard',
        roles: ['Administrator'],
      },
      {
        path: routerLinks('User'),
        component: React.lazy(() => import('./admin/user')),
        title: 'User',
      },
      {
        path: routerLinks('Pending Request'),
        component: React.lazy(() => import('./admin/request-management/pending-request')),
        title: 'Pending Request',
      },
      {
        path: routerLinks('Pending Request') + '/:id',
        component: React.lazy(() => import('./admin/request-management/pending-request/profile')),
        title: 'Pending Request Profile',
      },
      {
        path: routerLinks('Approved Request'),
        component: React.lazy(() => import('./admin/request-management/approved-request')),
        title: 'Approved Request',
      },
      {
        path: routerLinks('Approved Request') + '/:id',
        component: React.lazy(() => import('./admin/request-management/approved-request/profile')),
        title: 'Approved Request Profile',
      },
      {
        path: routerLinks('Rejected Request'),
        component: React.lazy(() => import('./admin/request-management/rejected-request')),
        title: 'Rejected Request',
      },
      {
        path: routerLinks('Rejected Request') + '/:id',
        component: React.lazy(() => import('./admin/request-management/rejected-request/profile')),
        title: 'Rejected Request Profile',
      },
      {
        path: routerLinks('Merchant'),
        component: React.lazy(() => import('./admin/merchant')),
        title: 'Merchant',
      },
      {
        path: routerLinks('AddMerchant'),
        component: React.lazy(() => import('./admin/merchant/add/add')),
        title: 'Add Merchant',
      },
      {
        path: routerLinks('Merchant') + '/:id',
        component: React.lazy(() => import('./admin/merchant/profile')),
        title: 'Merchant Detail',
      },
      {
        path: routerLinks('Consumer'),
        component: React.lazy(() => import('./admin/consumer')),
        title: 'Consumer',
      },
      {
        path: routerLinks('Consumer') + '/:id',
        component: React.lazy(() => import('./admin/consumer/detail')),
        title: 'Consumer Detail',
      },
      {
        path: routerLinks('Template'),
        component: React.lazy(() => import('./admin/template')),
        title: 'Template',
      },
      {
        path: routerLinks('Pricing Plan'),
        component: React.lazy(() => import('./admin/pricing-plan')),
        title: 'Pricing Plan',
      },
      {
        path: routerLinks('Ticket') + '/:id',
        component: React.lazy(() => import('./admin/ticket/detail')),
        title: 'Ticket Detail',
      },
      {
        path: routerLinks('Ticket') + '/:id/:merchantID',
        component: React.lazy(() => import('./admin/ticket/detail')),
        title: 'Ticket Detail',
      },
      {
        path: routerLinks('Market Place'),
        component: React.lazy(() => import('./admin/market-place')),
        title: 'Market Place',
      },
      {
        path: routerLinks('Market Place') + '/:id',
        component: React.lazy(() => import('./admin/market-place/profile')),
        title: 'Market Place',
      },
      {
        path: routerLinks('Transactions'),
        component: React.lazy(() => import('./admin/reports/transactions')),
        title: 'Transactions',
      },
      {
        path: routerLinks('Consumer Reload Gift Card'),
        component: React.lazy(() => import('./admin/reports/p2p-gift-card-transactions')),
        title: 'Consumer Reload Gift Card',
      },
      {
        path: routerLinks('Merchant Batch Settlement'),
        component: React.lazy(() => import('./admin/reports/merchant-batch-settlement')),
        title: 'Merchant Batch Settlement',
      },
      {
        path: routerLinks('Merchant Batch Settlement') + '/:id',
        component: React.lazy(() => import('./admin/reports/merchant-batch-settlement/detail')),
        title: 'Merchant Batch Settlement',
      },
      {
        path: routerLinks('Merchant Batch Settlement') + '/close',
        component: React.lazy(() => import('./admin/reports/merchant-batch-settlement/close')),
        title: 'Merchant Batch Settlement',
      },
      {
        path: routerLinks('Gift Card Sold'),
        component: React.lazy(() => import('./admin/reports/gift-card-sold')),
        title: 'Gift Card Sold',
      },
      {
        path: routerLinks('Gift Card Sold') + '/:id',
        component: React.lazy(() => import('./admin/reports/gift-card-sold')),
        title: 'Gift Card Sold',
      },
      // {
      //   path: routerLinks('General'),
      //   component: React.lazy(() => import('./admin/setting/general')),
      //   roles: ['Administrator'],
      //   title: 'General',
      // },
      // {
      //   path: routerLinks('SMTP'),
      //   component: React.lazy(() => import('./admin/setting/SMTP')),
      //   roles: ['Administrator'],
      //   title: 'SMTP',
      // },
      // {
      //   path: routerLinks('Twilio'),
      //   component: React.lazy(() => import('./admin/setting/twilio')),
      //   roles: ['Administrator'],
      //   title: 'Twilio',
      // },
      {
        path: routerLinks('Maintenance'),
        component: React.lazy(() => import('./admin/setting/maintenance')),
        roles: ['Administrator'],
        title: 'Maintenance mode on Portal',
      },
      {
        path: routerLinks('Gift Card Transactions'),
        component: React.lazy(() => import('./admin/reports/gift-card-transactions')),
        title: 'Gift Card Transactions',
      },
      {
        path: routerLinks('Users'),
        component: React.lazy(() => import('./admin/accounts/users')),
        title: 'Users',
      },
      {
        path: routerLinks('Users') + '/:id',
        component: React.lazy(() => import('./admin/accounts/users/profile')),
        title: 'Users',
      },
      {
        path: routerLinks('Users') + '/new',
        component: React.lazy(() => import('./admin/accounts/users/create')),
        title: 'Users',
      },
      {
        path: routerLinks('Logs'),
        component: React.lazy(() => import('./admin/accounts/logs')),
        title: 'Logs',
      },
      {
        path: routerLinks('Roles'),
        component: React.lazy(() => import('./admin/accounts/roles')),
        title: 'Roles',
      },
      {
        path: routerLinks('Principal'),
        component: React.lazy(() => import('./admin/principal')),
        title: 'Principal',
      },
      {
        path: routerLinks('Principal') + '/:id',
        component: React.lazy(() => import('./admin/principal/profile')),
        title: 'Principal Detail',
      },
    ], // 💬 generate link to here
  },
];

export const arrayPaths = [];
pages.map((layout) => {
  const paths = [];
  layout.child.map((page) => {
    paths.push(page.path);
    return page;
  });
  arrayPaths.push(paths);
  return layout;
});
