const common = require('../../common')
const translation = require("../../../public/locales/vi/translation.json");
const { faker } = require('@faker-js/faker');

const Page = {
  clickDropdownProfile: () => common.clickValue({selector: 'section#dropdown-profile'}),
  clickMenuMyProfile: () => common.clickValue({selector: 'li#menu-my-profile'}),
  clickTabPassword: () => common.clickValue({selector: 'span#tab-password'}),
  submitForm: () => common.clickValue({selector: 'button#submit-change-password'}),
  clickLogin: () => common.clickValue({selector: 'button.swal2-confirm'}),
  fillPassword: (value = faker.internet.password(16, false, /[A-Za-z0-9]/, 'Aa0')) =>
      common.fillValue({selector: 'input#password', value}),
  fillPasswordNew: (value = faker.internet.password(16, false, /[A-Za-z0-9]/, 'Aa0')) =>
      common.fillValue({selector: 'input#passwordNew', value}),
  fillPasswordNewConfirm: (value = faker.internet.password(16, false, /[A-Za-z0-9]/, 'Aa0')) =>
      common.fillValue({selector: 'input#confirmpasswordNew', value}),

  displayNameApplication: () => common.waitForText({text: 'Uhouse', selector: '#name-application'}),
  displayTitle: () => common.waitForText({text: translation.columns.admin.profile['User Profile'], selector: '#title'}),
  displayNotification: (text) => common.waitForText({text, selector: '#swal2-title'}),
  displayNotificationSaved: () => Page.displayNotification(translation.components.message.Saved),
}
module.exports = Page
