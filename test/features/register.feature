Feature: Register
  I want to register new user to systems

  Scenario: DK_01 - Sign up successfully with valid all fields and field Giới tính select Nam
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_01 - Sign up successfully with valid all fields and field Giới tính select Nam
    Then See male in my profile

  Scenario: DK_02 - Sign up successfully with valid all fields and field Giới tính select Nữ
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_02 - Sign up successfully with valid all fields and field Giới tính select Nữ
    Then See female in my profile

  Scenario: DK_04 - Check validation text of "Họ và tên" when register with empty field "Họ và tên"
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_04 - Check validation text of "Họ và tên" when register with empty field "Họ và tên"
    Then Display 1 error validation message

  Scenario: DK_05 - Check validation text of "Email" when register with empty field "Email"
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_05 - Check validation text of "Email" when register with empty field "Email"
    Then Display 1 error validation message

  Scenario: DK_06 - Check validation text of "Mật khẩu" when register with empty field "Mật khẩu"
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_06 - Check validation text of "Mật khẩu" when register with empty field "Mật khẩu"
    Then Display 1 error validation message

  Scenario: DK_07 - Check validation text of "Giới tính" when register with empty field "Giới tính"
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_07 - Check validation text of "Giới tính" when register with empty field "Giới tính"
    Then Display 1 error validation message

  Scenario: DK_08 - Check validation text of "Số cmnd/cccd" when register with empty field "Số cmnd/cccd"
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_08 - Check validation text of "Số cmnd-cccd" when register with empty field "Số cmnd-cccd"
    Then Display 1 error validation message

  Scenario: DK_09 - Check validation text of "Số điện thoại" when register with empty field "Số điện thoại"
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_09 - Check validation text of "Số điện thoại" when register with empty field "Số điện thoại"
    Then Display 1 error validation message

  Scenario: DK_10 - Check validation text of "Ngày sinh" when register with empty field "Ngày sinh"
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_10 - Check validation text of "Ngày sinh" when register with empty field "Ngày sinh"
    Then Display 1 error validation message

  Scenario: DK_11 - Check validation text of "Địa chỉ" when register with empty field "Địa chỉ"
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_11 - Check validation text of "Địa chỉ" when register with empty field "Địa chỉ"
    Then Display 1 error validation message

  Scenario: DK_12 - Check validation text when registered with all fields have special characters
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_12 - Check validation text when registered with all fields have special characters
    Then Display 5 error validation message

  Scenario: DK_13 - Check validation text when registered with all fields have icon
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_13 - Check validation text when registered with all fields have icon
    Then Display 5 error validation message

  Scenario: DK_14 - Check validation text when registered with all fields have space
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_14 - Check validation text when registered with all fields have space
    Then Display 3 error validation message

  Scenario: DK_15 - Check validation text of password when registered with password more than 6 characters without capital letters
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_15 - Check validation text of password when registered with password more than 6 characters without capital letters
    Then Display 1 error validation message

  Scenario: DK_16 - Check validation text of password when registered with password more than 6 characters without numbers
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_16 - Check validation text of password when registered with password more than 6 characters without numbers
    Then Display 1 error validation message

  Scenario: DK_17 - Check validation text when registered with all files are blank
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_17 - Check validation text when registered with all files are blank
    Then Display 8 error validation message

  Scenario: DK_18 - Check validation text of password when registered with 6-character password without capital characters and numbers
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_18 - Check validation text of password when registered with 6-character password without capital characters and numbers
    Then Display 1 error validation message

  Scenario: DK_19 - Check validation text of password when registered with password less than 6 characters
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_19 - Check validation text of password when registered with password less than 6 characters
    Then Display 1 error validation message

  Scenario: DK_20 - Check validation text of password when registered with 6-character password without capital letters
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_20 - Check validation text of password when registered with 6-character password without capital letters
    Then Display 1 error validation message

  Scenario: DK_21 - Check validation text of password when registered with 6-character password without numbers
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_21 - Check validation text of password when registered with 6-character password without numbers
    Then Display 1 error validation message

  Scenario: DK_28 - Check error message display when register with Số cmnd/cccd number already exists in the system
    Given Go to Login
    When DN_08 - Verify can navigate to "Đăng ký" page from link on Sign in page
    When DK_28 - Check error message display when register with Số cmnd-cccd number already exists in the system
    Then Display notification failed
