import React, { useEffect, useRef, useCallback } from 'react';
import { useAuth } from 'globalContext';
import logo from 'assets/images/logoLogin.svg';

import './index.less';

const Layout = ({ children }) => {
  const { changeLanguage, logout } = useAuth();

  const mount = useRef(false);
  const initFunction = useCallback(async () => {
    // if (!!auth.user?.token) {
    //   await UserService.logout();
    // }
    await logout();
    changeLanguage('en');
  }, [logout, changeLanguage]);

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      initFunction();
    }
  }, [mount, initFunction]);

  return (
    <div className="h-screen layout-auth z-10 flex items-center justify-center">
      <div className="container lg:w-3/5 mx-auto flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden flex w-full">
          <div className="w-full flex justify-center flex-col p-10">{children}</div>
          <div className="w-3/5 bg-[#0764b0] p-10 flex justify-center items-center">
            <img src={logo} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Layout;
