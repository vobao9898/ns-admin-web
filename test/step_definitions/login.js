const page = require('../page/login')

Given('Go to Login', () => page.goToLogin())

Then('Display notification successfully', () => page.displayNotificationSuccessfully())
Then('I change page register successfully', () => page.checkIsPageRegister())
Then('Display notification failed', () => page.displayNotificationFailed())
Then('Display 1 error validation message', () => page.displayLengthErrorValidationMessage(1))
Then('Display 2 error validation message', () => page.displayLengthErrorValidationMessage(2))
Then('Display 3 error validation message', () => page.displayLengthErrorValidationMessage(3))
Then('Display 4 error validation message', () => page.displayLengthErrorValidationMessage(4))
Then('Display 5 error validation message', () => page.displayLengthErrorValidationMessage(5))
Then('Display 6 error validation message', () => page.displayLengthErrorValidationMessage(6))
Then('Display 7 error validation message', () => page.displayLengthErrorValidationMessage(7))
Then('Display 8 error validation message', () => page.displayLengthErrorValidationMessage(8))

When('DN_01 - User login successfuly with valid Email and Password without "Remember login" option', () => {
  page.checkIsPageLogin()
  page.fillValueEmail('uh_auto_user01@mailinator.com')
  page.fillValuePassword()
  page.submitFormLogin()
})
When('DN_02 - User login successfuly with valid Email and Password and "Remember login" option', () => {
  page.checkIsPageLogin()
  page.fillValueEmail('uh_auto_user01@mailinator.com')
  page.fillValuePassword()
  page.checkboxItemRemember()
  page.submitFormLogin()
})
When('DN_03 - Check validation text of Email when login with empty Email', () => {
  page.checkIsPageLogin()
  page.fillValuePassword();
  page.submitFormLogin();
})
When('DN_04 - Check validation text of Password when login with empty Password', () => {
  page.checkIsPageLogin()
  page.fillValueEmail('uh_auto_user01@mailinator.com')
  page.submitFormLogin()
})
When('DN_05 - Check validation text of Email and Password when login with empty Email and Password', () => {
  page.checkIsPageLogin()
  page.submitFormLogin()
})
When('DN_06 - User login unsuccessfuly with Email does not exist in the system', () => {
  page.checkIsPageLogin()
  page.fillValueEmail()
  page.fillValuePassword()
  page.submitFormLogin()
})
When('DN_07 - User login unsuccessfuly with invalid Password', () => {
  page.checkIsPageLogin()
  page.fillValueEmail('uh_auto_user01@mailinator.com')
  page.fillValuePassword('Minh1206')
  page.submitFormLogin()
})
When('DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page', () => {
  page.checkIsPageLogin()
  page.changePageRegister()
})
