import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { routerLinks } from 'utils';
import { useAuth } from 'globalContext';
import { pages } from './pages';

const Layout = ({ layout: Layout, isPublic }) => {
  const auth = useAuth();
  if (isPublic === true || !!auth.user)
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  return <Navigate to="/auth/login" />;
};

const Page = ({ title, roles, component: Comp, ...props }) => {
  const auth = useAuth();

  useEffect(() => {
    auth.setTitlePage(title || '');
  }, [title, auth]);

  const isHasAccess = (roles, user) => {
    return user && user.userAdmin && user.userAdmin.roleName && roles.find((x) => x === user.userAdmin.roleName);
  };

  if (roles && Array.isArray(roles) && roles.length) {
    if (!isHasAccess(roles, auth?.user)) {
      return <Navigate to={routerLinks('Merchant')} />;
    }
  }

  if (typeof Comp === 'string') {
    return <Navigate to={Comp} />;
  }
  return <Comp {...props} />;
};
const Pages = () => (
  <HashRouter>
    <Routes>
      {pages.map(({ layout, isPublic, child }, index) => (
        <Route key={index} element={<Layout layout={layout} isPublic={isPublic} />}>
          {child.map(({ path, title, component, roles }, subIndex) => (
            <Route
              exact
              key={path + subIndex}
              path={path}
              element={<Page title={title} component={component} roles={roles} />}
            />
          ))}
        </Route>
      ))}
    </Routes>
  </HashRouter>
);

export default Pages;
