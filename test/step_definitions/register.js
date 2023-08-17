const page = require('../page/register')
const pageLogin = require('../page/login')
const pageMyProfile = require('../page/my_profile')

When('See male in my profile', () => page.seeMaleInMyProfile());
When('See female in my profile', () => page.seeFemaleInMyProfile());

When('DK_01 - Sign up successfully with valid all fields and field Giới tính select Nam', () => {
  page.fillValueName();
  const email = page.fillValueEmail();
  const password = page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
  page.registerSuccess();

  page.goToYopmail();
  page.fillValueYopmail(email);
  page.seeEmailUHouse();
  page.goToLinkActive();

  pageLogin.goToLogin();
  pageLogin.checkIsPageLogin();
  pageLogin.fillValueEmail(email)
  pageLogin.fillValuePassword(password)
  pageLogin.submitFormLogin()

  pageMyProfile.displayNameApplication();
  pageMyProfile.clickDropdownProfile();
  pageMyProfile.clickMenuMyProfile();
  pageMyProfile.displayTitle();
})

When('DK_02 - Sign up successfully with valid all fields and field Giới tính select Nữ', () => {
  page.fillValueName();
  const email = page.fillValueEmail();
  const password = page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGender();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
  page.registerSuccess();

  page.goToYopmail();
  page.fillValueYopmail(email);
  page.seeEmailUHouse();
  page.goToLinkActive();

  pageLogin.goToLogin();
  pageLogin.checkIsPageLogin();
  pageLogin.fillValueEmail(email)
  pageLogin.fillValuePassword(password)
  pageLogin.submitFormLogin()

  pageMyProfile.displayNameApplication();
  pageMyProfile.clickDropdownProfile();
  pageMyProfile.clickMenuMyProfile();
  pageMyProfile.displayTitle();
})

When('DK_04 - Check validation text of "Họ và tên" when register with empty field "Họ và tên"', () => {
  page.fillValueEmail();
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})

When('DK_05 - Check validation text of "Email" when register with empty field "Email"', () => {
  page.fillValueName();
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})
When('DK_06 - Check validation text of "Mật khẩu" when register with empty field "Mật khẩu"', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})

When('DK_07 - Check validation text of "Giới tính" when register with empty field "Giới tính"', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})

When('DK_08 - Check validation text of "Số cmnd-cccd" when register with empty field "Số cmnd-cccd"', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})

When('DK_09 - Check validation text of "Số điện thoại" when register with empty field "Số điện thoại"', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValueAddress();
  page.submitFormRegister();
})
When('DK_10 - Check validation text of "Ngày sinh" when register with empty field "Ngày sinh"', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})
When('DK_11 - Check validation text of "Địa chỉ" when register with empty field "Địa chỉ"', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.submitFormRegister();
})
When('DK_12 - Check validation text when registered with all fields have special characters', () => {
  page.fillValueNameCustom('@');
  page.fillValueEmailCustom('@');
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentityCustom('@');
  page.fillValuePhoneCustom('@');
  page.fillValueAddressCustom('@');
  page.submitFormRegister();
})
When('DK_13 - Check validation text when registered with all fields have icon', () => {
  page.fillValueNameCustom('😏');
  page.fillValueEmailCustom('😏');
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentityCustom('😏');
  page.fillValuePhoneCustom('😏');
  page.fillValueAddressCustom('😏');
  page.submitFormRegister();
})
When('DK_14 - Check validation text when registered with all fields have space', () => {
  page.fillValueNameCustom(' ');
  page.fillValueEmailCustom(' ');
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentityCustom(' ');
  page.fillValuePhoneCustom(' ');
  page.fillValueAddressCustom(' ');
  page.submitFormRegister();
})
When('DK_15 - Check validation text of password when registered with password more than 6 characters without capital letters', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword('ari123456');
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})
When('DK_16 - Check validation text of password when registered with password more than 6 characters without numbers', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword('Ariautouhouse');
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})
When('DK_17 - Check validation text when registered with all files are blank', () => page.submitFormRegister())
When('DK_18 - Check validation text of password when registered with 6-character password without capital characters and numbers', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword('ariari');
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})
When('DK_19 - Check validation text of password when registered with password less than 6 characters', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword('Ari12');
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})
When('DK_20 - Check validation text of password when registered with 6-character password without capital letters', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword('ari123');
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})
When('DK_21 - Check validation text of password when registered with 6-character password without numbers', () => {
  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword('Ariari');
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})

When('DK_28 - Check error message display when register with Số cmnd-cccd number already exists in the system', () => {
  page.fillValueName();
  const email = page.fillValueEmail();
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  const identity = page.fillValueIdentity();
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
  page.registerSuccess();

  page.goToYopmail();
  page.fillValueYopmail(email);
  page.seeEmailUHouse();
  page.goToLinkActive();

  pageLogin.goToLogin();
  pageLogin.changePageRegister()
  pageLogin.checkIsPageRegister()

  page.fillValueName();
  page.fillValueEmail();
  page.fillValuePassword();
  page.fillValueBrith();
  page.fillValueGenderMale();
  page.fillValueIdentity(identity);
  page.fillValuePhone();
  page.fillValueAddress();
  page.submitFormRegister();
})

