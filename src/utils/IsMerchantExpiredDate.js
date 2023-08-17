function dateIsValid(date) {
  return date instanceof Date && !isNaN(date);
}

const DURATION_ABOUT_TO_EXPIRE = 14 * 24 * 60 * 60 * 1000; // 14 DAYS

const Util = (expiredDate) => {
  if (expiredDate === null) return false;

  const isValid = dateIsValid(new Date(expiredDate));

  if (!isValid) return false;

  const expiredTime = new Date(expiredDate).getTime();

  const nowTime = new Date().getTime();

  if (expiredTime - DURATION_ABOUT_TO_EXPIRE <= nowTime) return true;

  return false;
};

export default Util;
