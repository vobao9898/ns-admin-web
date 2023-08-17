const common = require('../../common')
const variable = require('../../common/variable.js')
const translation = require("../../../public/locales/vi/translation.json");
const { faker } = require('@faker-js/faker');

const Page = {
  goToLogin: () => common.amOnPage({url: variable.baseUrl + '/#/auth/login'}),

  fillValueEmail: (value = faker.internet.email()) => common.fillValue({selector: 'input#username', value}),
  fillValuePassword: (value = 'Ari123456') => common.fillValue({selector: 'input#password', value}),

  submitFormLogin: () => common.clickValue({selector: 'button#btnLogin'}),
  changePageRegister: () => common.clickValue({selector: 'a#button-register'}),

  checkboxItemRemember: () => common.checkboxItem({selector: 'input#isRemember'}),

  checkIsPageLogin: () => common.waitForText({text: translation.routes.auth.login['Log In'], selector: '#title-login'}),
  checkIsPageRegister: () => common.waitForText({text: translation.routes.auth.register.title, selector: '#title-register'}),
  displayNotification: (text) => common.waitForText({text, selector: '#swal2-title'}),

  displayNotificationSuccessfully: () => Page.displayNotification(translation.components.message.Success),
  displayNotificationFailed: () => Page.displayNotification(translation.components.message.Fail),

  displayLengthErrorValidationMessage: (length = 4) =>
    common.waitNumberOfVisibleElements({selector: '.ant-form-item-explain-error', length})
}
module.exports = Page
