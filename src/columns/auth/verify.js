const Column = ({ t }) => {
  return [
    {
      name: 'code',
      title: t('columns.auth.login.Verification code'),
      formItem: {
        placeholder: t('columns.auth.login.Verification code'),
        rules: [{ type: 'required' }],
      },
    },
  ];
};
export default Column;
