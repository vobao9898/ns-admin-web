const common = require('../../common')
const translation = require("../../../public/locales/vi/translation.json");
const { faker } = require('@faker-js/faker');

const Page = {
  goToYopmail: () => common.amOnPage({url: 'https://yopmail.com/en/'}),

  submitFormRegister: () => common.clickValue({selector: 'button#button-register'}),
  goToLinkActive: () => common.clickValue({selector: '#mail a', iframe: '#ifmail', nextTab: true}),

  fillValueName: (value = faker.name.firstName() + ' '+ faker.name.lastName()) =>
    common.fillValue({selector: 'input#name', value}),
  fillValueNameCustom: (value = '') =>
    Page.fillValueName(faker.name.firstName() + ' '+ faker.name.lastName() + value),

  fillValueEmail: (value = faker.internet.email(faker.name.firstName(), faker.name.lastName(), 'yopmail.com').toLowerCase()) =>
    common.fillValue({selector: 'input#email', value}),
  fillValueEmailCustom: (value = '') =>
    Page.fillValueEmail(faker.internet.email(faker.name.firstName(), faker.name.lastName(), 'yopmail.com').toLowerCase() + value),

  fillValuePassword: (value = faker.internet.password(16, false, /[A-Za-z0-9]/, 'Aa0')) =>
    common.fillValue({selector: 'input#password', value}),
  fillValueBrith: (value = '12-06-1998') => common.fillValue({selector: 'input#dateOfBirth', value}),

  fillValueGender: (value = translation.columns.auth.register.Female) =>
    common.selectItems({selector: 'input#gender', value}),
  fillValueGenderMale: (value = '') => Page.fillValueGender(translation.columns.auth.register.Male + value),

  fillValueIdentity: (value = faker.phone.phoneNumber('############')) =>
    common.fillValue({selector: 'input#identityCard', value}),
  fillValueIdentityCustom: (value = '') =>
    Page.fillValueIdentity(faker.phone.phoneNumber('###########') + value),

  fillValuePhone: (value = faker.phone.phoneNumber('############')) =>
    common.fillValue({selector: 'input#phoneNumber', value}),
  fillValuePhoneCustom: (value = '') =>
    Page.fillValuePhone(faker.phone.phoneNumber('############') + value),

  fillValueAddress: (value = faker.address.streetAddress(true)) =>
    common.fillValue({selector: 'input#address', value}),
  fillValueAddressCustom: (value = '') =>
    Page.fillValueAddress(faker.address.streetAddress(true) + value),

  fillValueYopmail: (value = '') => common.fillValue({selector: 'input.ycptinput', value, keyboardKey:'Enter'}),

  registerSuccess: () => {
    common.waitForText({text: translation.routes.auth.register['Confirm your email'], selector: '#swal2-title'})
  },
  seeEmailUHouse: () => common.waitForText({text: 'UHOUSE', iframe: '#ifinbox'}),
  seeMaleInMyProfile: () => {
    common.waitForText({text: translation.columns.auth.register.Male, selector: '.ant-select-selection-item'})
  },
  seeFemaleInMyProfile: () => {
    common.waitForText({text: translation.columns.auth.register.Female, selector: '.ant-select-selection-item'})
  },
}
module.exports = Page
