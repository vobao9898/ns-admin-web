import React, { useState, useEffect } from 'react';
import { Dropdown } from 'antd';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import { useAuth } from 'globalContext';
import logo from 'assets/images/logo.png';
import logoMenu from 'assets/images/logoMenu.png';
import './index.less';
import { routerLinks } from 'utils';
import { Avatar } from 'components';
import Menu from './menu';
import Notification from './notification';

const Layout = ({ children }) => {
  // menuVertical, permission,
  const { user, changeLanguage } = useAuth();
  const navigate = useNavigate();

  const [isCollapsed, set_isCollapsed] = useState(window.innerWidth < 1025);
  const [isDesktop, set_isDesktop] = useState(window.innerWidth > 767);

  useEffect(() => {
    if (window.innerWidth < 1024 && !isCollapsed) {
      setTimeout(() => {
        set_isCollapsed(true);
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    function handleResize() {
      if (window.innerWidth < 1025 && !isCollapsed) {
        set_isCollapsed(true);
      }
      set_isDesktop(window.innerWidth > 767);
    }
    window.addEventListener('resize', handleResize, true);
    changeLanguage('en');

    return () => window.removeEventListener('resize', handleResize, true);
  }, []);

  const Header = ({ isCollapsed, isDesktop }) => (
    <header
      className={classNames(
        'bg-blue-50 w-full header h-20 transition-all duration-300 ease-in-out sticky top-0 block z-20',
        {
          'pl-80': !isCollapsed && isDesktop,
          'pl-32': isCollapsed && isDesktop,
          'pl-28': !isDesktop,
        },
      )}
    >
      <div className="flex items-center justify-end sm:justify-between px-5 h-20">
        <div></div>
        <div className="flex items-center">
          <Notification />
          <Dropdown
            trigger={['hover', 'click']}
            overlay={
              <ul className="bg-blue-50 cursor-pointer">
                <li
                  className="p-2 hover:bg-blue-100"
                  onClick={() =>
                    navigate(routerLinks('Users') + '/' + user?.userAdmin?.waUserId, { state: { isUser: true } })
                  }
                >
                  Profile
                </li>
                <li className="p-2 hover:bg-blue-100" onClick={() => navigate(routerLinks('Login'), { replace: true })}>
                  Sign Out
                </li>
              </ul>
            }
            placement="bottomRight"
          >
            <section className="flex items-center cursor-pointer" id={'dropdown-profile'}>
              <div className="text-right leading-none mr-3 hidden sm:block">
                <div className="font-bold text-black text-lg leading-snug mb-0.5">{user?.name}</div>
                <div className="text-gray-500 font-semibold text-lg">
                  {(user?.userAdmin?.firstName || '') + ' ' + (user?.userAdmin?.lastName || '')}
                </div>
              </div>
              <Avatar src={user?.userAdmin?.imageUrl} size={10} />
            </section>
          </Dropdown>
        </div>
      </div>
    </header>
  );
  return (
    <main>
      <Header isCollapsed={isCollapsed} isDesktop={isDesktop} />
      <div
        className={classNames(
          'flex items-center justify-between text-gray-800 hover:text-gray-500 h-20 fixed top-0 left-0 px-5 font-bold transition-all duration-300 ease-in-out z-20',
          {
            'w-80': !isCollapsed && isDesktop,
            'w-20': isCollapsed,
            'bg-blue-100': isDesktop,
            'bg-blue-50': !isDesktop,
          },
        )}
      >
        <div>
          <a href="/" className="flex items-center">
            {!isCollapsed ? <img className="w-[60%]" src={logo} alt="" /> :<img className="w-[40px] h-[40px]" src={logoMenu} alt="" />}
            {/* <div
              id={'name-application'}
              className={classNames(
                'transition-all duration-300 ease-in-out absolute left-16 w-48 overflow-ellipsis overflow-hidden ml-2',
                {
                  'opacity-100 text-3xl': !isCollapsed && !!isDesktop,
                  'opacity-0 text-[0px] invisible': !!isCollapsed || !isDesktop,
                },
              )}
            >
              Admin
            </div> */}
          </a>
        </div>

        <div
          className={classNames('hamburger', {
            'is-active': (isCollapsed && isDesktop) || (!isCollapsed && !isDesktop),
          })}
          onClick={() => set_isCollapsed(!isCollapsed)}
        >
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </div>
      </div>
      <div
        onMouseEnter={() => {
          const offsetWidth = document.body.offsetWidth;
          document.body.style.overflowY = 'hidden';
          document.body.style.paddingRight = document.body.offsetWidth - offsetWidth + 'px';
        }}
        onMouseLeave={() => {
          document.body.style.overflowY = 'auto';
          document.body.style.paddingRight = '';
        }}
        className={classNames('fixed z-20 top-20 left-0 h-screen bg-blue-100 transition-all duration-300 ease-in-out', {
          'w-80': !isCollapsed,
          'w-20': isCollapsed,
          '-left-20': isCollapsed && !isDesktop,
        })}
      >
        <Menu isCollapsed={isCollapsed} />
      </div>
      <section
        id={'main'}
        className={classNames('px-5 transition-all duration-300 ease-in-out z-10 h-[calc(100vh-5rem)] relative', {
          'ml-80': !isCollapsed && isDesktop,
          'ml-20': isCollapsed && isDesktop,
        })}
      >
        {children}
      </section>
      <div className="hidden h-7 w-7 leading-7" />
    </main>
  );
};
export default Layout;
