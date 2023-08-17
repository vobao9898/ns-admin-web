export const RolesService = {
  nameLink: 'roles',
  getAllRoles: async () => {
    try {
      console.log('');
      return {
        data: [
          {
            title: 'Dashboard',
            name: 'View Dashboard',
            modulePage: 'Dashboard',
            roleIsActive: true,
          },
          {
            title: 'Request Management',
            name: 'View Request Management',
            modulePage: 'Request Management',
            roleIsActive: true,
          },
        ],
      };
    } catch (e) {
      return e;
    }
  },
};
