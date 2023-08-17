const getCodeAndPhone = (phone) => {
  if (!phone) return [];
  let phoneCod = '';
  let phoneNumber = '';

  phone = phone + '';
  phone.replaceAll(' ', '');
  const listCod = ['+1', '+84'];
  listCod.map((cod) => {
    if (phone.indexOf(cod) > -1) {
      phoneCod = cod;
      phoneNumber = phone.replace(cod, '');
    }
    return cod;
  });
  phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  return [phoneCod, phoneNumber];
};

export default getCodeAndPhone;
