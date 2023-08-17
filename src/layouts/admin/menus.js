const Layout = () => [
  {
    icon: 'las la-chart-bar',
    name: 'Dashboard',
    roles: ['Administrator'],
  },
  {
    icon: 'las la-user-plus',
    name: 'Request Management',
    child: [
      {
        icon: 'las la-user-plus',
        name: 'Pending Request',
      },
      {
        icon: 'las la-user-plus',
        name: 'Approved Request',
      },
      {
        icon: 'las la-user-plus',
        name: 'Rejected Request',
      },
    ],
  },
  {
    icon: 'las la-user-circle',
    name: 'Merchant',
  },
  {
    icon: 'las la-user-friends',
    name: 'Consumer',
  },
  {
    icon: 'las la-gift',
    name: 'Gift Card',
    child: [
      {
        icon: 'las la-gift',
        name: 'Template',
      },
    ],
  },
  {
    icon: 'las la-comment-dollar',
    name: 'Pricing Plan',
  },
  // {
  //   icon: 'las la-ticket-alt',
  //   name: 'Ticket',
  // },
  {
    icon: 'las la-store-alt',
    name: 'Market Place',
  },
  {
    icon: 'las la-file-alt',
    name: 'Reports',
    child: [
      {
        icon: 'las la-file-alt',
        name: 'Transactions',
      },
      {
        icon: 'las la-file-alt',
        name: 'Consumer Reload Gift Card',
      },
      {
        icon: 'las la-file-alt',
        name: 'Merchant Batch Settlement',
      },
      {
        icon: 'las la-file-alt',
        name: 'Gift Card Sold',
      },
      {
        icon: 'las la-file-alt',
        name: 'Gift Card Transactions',
      },
    ],
  },
  {
    icon: 'las la-cog',
    name: 'Settings',
    roles: ['Administrator'],
    child: [
      // {
      //   icon: 'las la-file-alt',
      //   name: 'General',
      // },
      // {
      //   icon: 'las la-file-alt',
      //   name: 'SMTP',
      // },
      // {
      //   icon: 'las la-file-alt',
      //   name: 'Twilio',
      // },
      {
        icon: 'las la-file-alt',
        name: 'Maintenance',
      },
    ],
  },
  {
    icon: 'las la-address-book',
    name: 'Accounts',
    child: [
      {
        icon: 'las la-address-book',
        name: 'Users',
      },
      {
        icon: 'las la-address-book',
        name: 'Logs',
      },
      {
        icon: 'las la-user-shield',
        name: 'Roles',
      },
    ],
  },
  {
    icon: 'las la-user',
    name: 'Principal',
  },
];
export default Layout;
