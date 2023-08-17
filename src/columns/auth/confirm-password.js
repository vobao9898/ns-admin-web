const Column = ({ t }) => {
  return [
    {
      name: 'newPassword',
      title: t('columns.auth.login.New password'),
      formItem: {
        type: 'password',
        placeholder: t('columns.auth.login.Enter new password'),
        rules: [{ type: 'required' }, { type: 'minLength', value: 6 }],
      },
    },
    {
      name: 'confirmPassword',
      title: t('columns.auth.login.Confirm Password'),
      formItem: {
        placeholder: t('columns.auth.login.Confirm Password'),
        type: 'password',
        rules: [{ type: 'required' }, { type: 'minLength', value: 6 }],
      },
    },
  ];
};

export default Column;
