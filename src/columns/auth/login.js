const Column = ({ t }) => {
  return [
    {
      name: 'email',
      title: t('columns.auth.login.Username'),
      formItem: {
        placeholder: t('columns.auth.login.Enter Username'),
        rules: [{ type: 'required' }, { type: 'email' }],
      },
    },
    {
      name: 'password',
      title: t('columns.auth.login.password'),
      formItem: {
        placeholder: t('columns.auth.login.Enter Password'),
        type: 'password',
        rules: [{ type: 'required' }, { type: 'minLength', value: 6 }],
      },
    },
  ];
};
export default Column;
