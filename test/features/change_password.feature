Feature: Change Password
  I want to change password to systems

  Scenario: CP_01 - Change password successfully with valid password
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_01 - Change password successfully with valid password
    Then Display notification Saved
    When CP_01.1 - Change password successfully with valid password
    When Go to My profile tab change password
    When CP_01.2 - Change password successfully with valid password
    Then Display notification Saved

  Scenario: CP_02 - Check validation text when change password with all empty fields
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_02 - Check validation text when change password with all empty fields
    Then Display 3 error validation message

  Scenario: CP_03 - Check validation text of Mật khẩu hiện tại when change password with empty Mật khẩu hiện tại
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_03 - Check validation text of Mật khẩu hiện tại when change password with empty Mật khẩu hiện tại
    Then Display notification failed

  Scenario: CP_04 - Check validation text of Mật khẩu mới when change password with empty Mật khẩu mới
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_04 - Check validation text of Mật khẩu mới when change password with empty Mật khẩu mới
    Then Display 2 error validation message

  Scenario: CP_05 - Check validation text of Xác nhận mật khẩu when change password with empty Xác nhận mật khẩu
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_05 - Check validation text of Xác nhận mật khẩu when change password with empty Xác nhận mật khẩu
    Then Display 1 error validation message

  Scenario: CP_06 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with empty Mật khẩu mới, Xác nhận mật khẩu
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_06 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with empty Mật khẩu mới, Xác nhận mật khẩu
    Then Display 2 error validation message

  Scenario: CP_07 - Check validation text when change password with Mật khẩu mới, Xác nhận mật khẩu aren't same
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_07 - Check validation text when change password with Mật khẩu mới, Xác nhận mật khẩu aren't same
    Then Display 1 error validation message

  Scenario: CP_08 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with password more than 6 characters without capital characters
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_08 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with password more than 6 characters without capital characters
    Then Display 1 error validation message

  Scenario: CP_09 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with password more than 6 characters without numbers
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_09 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with password more than 6 characters without numbers
    Then Display 1 error validation message

  Scenario: CP_10 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with 6-character password without capital characters and numbers
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_10 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with 6-character password without capital characters and numbers
    Then Display 1 error validation message

  Scenario: CP_11 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with password less than 6 characters
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_11 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with password less than 6 characters
    Then Display 1 error validation message

  Scenario: CP_12 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with 6-character password without capital characters
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_12 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with 6-character password without capital characters
    Then Display 1 error validation message

  Scenario: CP_13 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with 6-character password without numbers
    Given Go to Login
    When DN_01 - User login successfuly with valid Email and Password without "Remember login" option
    When Go to My profile tab change password
    When CP_13 - Check validation text of Mật khẩu mới, Xác nhận mật khẩu when change password with 6-character password without numbers
    Then Display 1 error validation message
