const Util = (money = 0, currency = '₫', convertInt = true) => {
  if (convertInt) {
    money = parseInt(money, 10);
  }
  return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + currency;
};
export default Util;
