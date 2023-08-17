const page = require('../page/my_profile')
const pageLogin = require('../page/login')

Given('Go to My profile tab change password', () => {
  page.displayNameApplication();
  page.clickDropdownProfile();
  page.clickMenuMyProfile();
  page.displayTitle();
  page.clickTabPassword();
})

Then('Display notification Saved', () => page.displayNotificationSaved())
Then('Display title My Profile', () => page.displayTitle())

When('CP_01 - Change password successfully with valid password', () => {
  page.fillPassword('Ari123456')
  page.fillPasswordNew('Minh1206')
  page.fillPasswordNewConfirm('Minh1206')
  page.submitForm();
})

When('CP_01.1 - Change password successfully with valid password', () => {
  page.clickLogin()
  pageLogin.checkIsPageLogin()
  pageLogin.fillValueEmail('uh_auto_user01@mailinator.com')
  pageLogin.fillValuePassword('Minh1206')
  pageLogin.submitFormLogin()
})

When('CP_01.2 - Change password successfully with valid password', () => {
  page.fillPassword('Minh1206')
  page.fillPasswordNew('Ari123456')
  page.fillPasswordNewConfirm('Ari123456')
  page.submitForm();
})

When('CP_02 - Check validation text when change password with all empty fields', () => page.submitForm())

When('CP_03 - Check validation text of Mật khẩu hiện tại when change password with empty Mật khẩu hiện tại', () => {
  const password = page.fillPassword()
  page.fillPasswordNew(password)
  page.fillPasswordNewConfirm(password)
  page.submitForm();
})

When('CP_04 - Check validation text of Mật khẩu mới when change password with empty Mật khẩu mới', () => {
  page.fillPassword()
  page.fillPasswordNewConfirm()
  page.submitForm();
})

When('CP_05 - Check validation text of Xác nhận mật khẩu when change password with empty Xác nhận mật khẩu', () => {
  page.fillPassword()
  page.fillPasswordNew()
  page.submitForm();
})

When('CP_06 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with empty Mật khẩu mới, Xác nhận mật khẩu', () => {
  page.fillPassword()
  page.submitForm();
})


When('CP_07 - Check validation text when change password with Mật khẩu mới, Xác nhận mật khẩu aren\'t same', () => {
  page.fillPassword()
  page.fillPasswordNew()
  page.fillPasswordNewConfirm()
  page.submitForm();
})

When('CP_08 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with password more than 6 characters without capital characters', () => {
  page.fillPassword('Minh1206')
  const password = page.fillPasswordNew('ari270418')
  page.fillPasswordNewConfirm(password)
  page.submitForm();
})

When('CP_09 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with password more than 6 characters without numbers', () => {
  page.fillPassword('Minh1206')
  const password = page.fillPasswordNew('Ariariconghoa')
  page.fillPasswordNewConfirm(password)
  page.submitForm();
})

When('CP_10 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with 6-character password without capital characters and numbers', () => {
  page.fillPassword('Minh1206')
  const password = page.fillPasswordNew('ariari')
  page.fillPasswordNewConfirm(password)
  page.submitForm();
})

When('CP_11 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with password less than 6 characters', () => {
  page.fillPassword('Minh1206')
  const password = page.fillPasswordNew('Ari27')
  page.fillPasswordNewConfirm(password)
  page.submitForm();
})

When('CP_12 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with 6-character password without capital characters', () => {
  page.fillPassword('Minh1206')
  const password = page.fillPasswordNew('ari270')
  page.fillPasswordNewConfirm(password)
  page.submitForm();
})

When('CP_13 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with 6-character password without numbers', () => {
  page.fillPassword('Minh1206')
  const password = page.fillPasswordNew('Ariari')
  page.fillPasswordNewConfirm(password)
  page.submitForm();
})
