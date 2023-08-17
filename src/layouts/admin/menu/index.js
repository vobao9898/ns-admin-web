import { Collapse, Popover } from 'antd';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { routerLinks } from 'utils';
import { useNavigate, useLocation } from 'react-router';
import './index.less';
import listMenu from '../menus';
import { useAuth } from 'globalContext';

const Layout = ({ isCollapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const refMenu = useRef();
  const { user } = useAuth();

  useEffect(() => {
    import('perfect-scrollbar').then(({ default: PerfectScrollbar }) => {
      new PerfectScrollbar(document.getElementById('menu-sidebar'), {
        suppressScrollX: true,
      });
    });
  }, []);

  useEffect(() => {
    if (isCollapsed) {
      refMenu.current.scrollTop = 0;
    }
  }, [isCollapsed]);

  const isHasAccess = (roles, user) => {
    if (roles && Array.isArray(roles) && roles.length) {
      return user && user.userAdmin && user.userAdmin.roleName && roles.find((x) => x === user.userAdmin.roleName);
    }
    return true;
  };

  return (
    <ul className="menu relative h-[calc(100vh-5rem)]" id={'menu-sidebar'} ref={refMenu}>
      {listMenu().map((item, index) => {
        if (!item.child) {
          if (!isHasAccess(item.roles, user)) {
            return null;
          }
          return (
            <li
              className={classNames('flex items-center h-11 m-3 px-2', {
                'bg-white text-blue-500 rounded-2xl': location.pathname === routerLinks(item.name),
                'justify-center': isCollapsed,
              })}
              onClick={() => navigate(routerLinks(item.name))}
              key={index}
            >
              <i className={classNames('text-3xl', item.icon)} />
              <span
                className={classNames('ml-2.5 transition-all duration-300 ease-in-out font-bold', {
                  'opacity-100': !isCollapsed,
                  'opacity-0 text-[0] ml-0': isCollapsed,
                })}
              >
                {item.name}
              </span>
            </li>
          );
        } else {
          if (!isHasAccess(item.roles, user)) {
            return null;
          }
          return isCollapsed ? (
            <Popover
              placement="right"
              trigger={'hover'}
              content={
                <>
                  {item.child.map((subItem, index) => (
                    <li
                      key={index}
                      className="child-item py-2 cursor-pointer"
                      onClick={() => navigate(routerLinks(subItem.name))}
                    >
                      {subItem.name}
                    </li>
                  ))}
                </>
              }
            >
              <li className="flex items-center justify-center h-11 m-3 px-2">
                <i className={classNames('text-3xl block', item.icon)} />
              </li>
            </Popover>
          ) : (
            <li className="my-3">
              <Collapse accordion bordered={false} className="bg-blue-100">
                <Collapse.Panel
                  showArrow={!isCollapsed}
                  header={
                    <div
                      className={classNames('flex items-center text-gray-500', {
                        'justify-center': isCollapsed,
                      })}
                    >
                      <i
                        className={classNames('text-3xl block', item.icon, {
                          'ml-1': !isCollapsed,
                        })}
                      />
                      <span
                        className={classNames('pl-2.5 transition-all duration-300 ease-in-out font-bold', {
                          'opacity-100': !isCollapsed,
                          'opacity-0 text-[0]': isCollapsed,
                        })}
                      >
                        {item.name}
                      </span>
                    </div>
                  }
                >
                  {item.child.map((subItem, index) => (
                    <li
                      key={index}
                      className="child-item py-2 cursor-pointer"
                      onClick={() => navigate(routerLinks(subItem.name))}
                    >
                      {subItem.name}
                    </li>
                  ))}
                </Collapse.Panel>
              </Collapse>
            </li>
          );
        }
      })}
    </ul>
  );
};
export default Layout;
