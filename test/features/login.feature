Feature: Login
  I want to login to systems

  Scenario: DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    Then Display notification successfully

  Scenario: DN_02 - User login successfuly with valid Email and Password and "Remember login" option
    Given Go to Login
    When DN_02 - User login successfuly with valid Email and Password and "Remember login" option
    Then Display notification successfully

  Scenario: DN_03 - Check validation text of Email when login with empty Email
    Given Go to Login
    When DN_03 - Check validation text of Email when login with empty Email
    Then Display 1 error validation message

  Scenario: DN_04 - Check validation text of Password when login with empty Password
    Given Go to Login
    When DN_04 - Check validation text of Password when login with empty Password
    Then Display 1 error validation message

  Scenario: DN_05 - Check validation text of Email and Password when login with empty Email and Password
    Given Go to Login
    When DN_05 - Check validation text of Email and Password when login with empty Email and Password
    Then Display 2 error validation message

  Scenario: DN_06 - User login unsuccessfuly with Email does not exist in the system
    Given Go to Login
    When DN_06 - User login unsuccessfuly with Email does not exist in the system
    Then Display notification failed

  Scenario: DN_07 - User login unsuccessfuly with invalid Password
    Given Go to Login
    When DN_07 - User login unsuccessfuly with invalid Password
    Then Display notification failed

  Scenario: DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    Then I change page register successfully
