const Util = (name, type) => {
  const array = {
    Login: '/auth/login',
    Dashboard: '/dashboard',
    GiftCard: '/GiftCardTemplate',
    Template: '/gift-card/template',
    Verify: '/auth/verify',
    User: '/user',
    'Request Management': '/request',
    'Pending Request': '/request/pending-request',
    'Approved Request': '/request/approved-request',
    'Rejected Request': '/request/rejected-request',
    Merchant: '/',
    AddMerchant: '/merchant/add',
    MerchantProfile: '/merchant/profile',
    Consumer: '/consumer',
    'Pricing Plan': '/pricing-plan',
    Ticket: '/ticket',
    TicketDetail: '/ticket/detail',
    'Market Place': '/market-place',
    Reports: '/reports',
    Settings: '/Settings',
    General: '/Settings/General',
    SMTP: '/Settings/SMTP',
    Twilio: '/Settings/Twilio',
    Maintenance: '/Settings/maintenance',
    Transactions: '/reports/transactions',
    'P2P Gift Card Transactions': '/reports/p2p-gift-card-transactions',
    'Merchant Batch Settlement': '/reports/merchant-batch-settlement',
    'Consumer Reload Gift Card': '/reports/consumer-reload-gift-card',
    'Gift Card Sold': '/reports/gift-card-sold',
    'Gift Card Transactions': '/reports/gift-card-transactions',
    Accounts: '/accounts',
    Users: '/accounts/account-users',
    Logs: '/accounts/logs',
    Roles: '/accounts/roles',
    Principal: '/principal',
  }; // 💬 generate link to here

  const apis = {
    Dashboard: '/dashboard',
    'Pending Request': '/pending-request',
    'Approved Request': '/approved-request',
    'Rejected Request': '/rejected-request',
    Merchant: '/merchant',
    Consumer: '/consumer',
    PaymentTransaction: '/PaymentTransaction',
    UserActivity: '/UserActivity',
    Template: '/template',
    GiftCard: '/GiftCardTemplate',
    'Pricing Plan': '/pricing-plan',
    'Market Place': '/market-place',
    Transactions: '/transactions',
    'General Report': '/General-report',
    'P2P Gif tCard Transactions': '/p2p-gift-card-transactions',
    'Merchant Batch Settlement': '/merchant-batch-settlement',
    'Gift Card Sold': '/gift-card-sold',
    Users: '/account-users',
    Logs: '/logs',
    Roles: '/roles',
    AdminUser: '/AdminUser',
    User: '/User',
    Ticket: '/ticket',
    Permission: '/permission',
  }; // 💬 generate api to here

  switch (type) {
    case 'api':
      return apis[name];
    default:
      return array[name];
  }
};
export default Util;
