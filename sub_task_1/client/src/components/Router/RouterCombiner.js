import React, { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";

const ComponentWithLayout = React.memo(({ Layout, Component, ...props }) => (
  <Layout {...props}>
    <Component {...props} />
  </Layout>
));

const isAuthorised = (authorisedFor = [], rolesSet) => {
  if (authorisedFor.length < 1) {
    return true
  }
  return authorisedFor.some(role => rolesSet.has(role))
}

const defaultLayout = ({ children }) => <>{children}</>

const RouterCombiner = ({ routes, auth, user, ...extraCombinedParams }) => {
  const rolesSet = useMemo(() => new Set(user.roles || []), [user.roles])
  const RoutesMap = useMemo(() => {
    const rootProps = { auth, user,rolesSet, ...extraCombinedParams, ...extraCombinedParams.extras };

    const generateRoute = (props) => (
      props.Private ? (
        <Route
          {...props}
          element={props.auth && isAuthorised(props.authorisedFor, props.rolesSet) ? props.element : <Navigate to="/login" />}
        />
      ) : <Route {...props} />
    );

    const routeElements = routes.map(
      ({ Private, authorisedFor, exact = true, Layout = defaultLayout, modules, Component, path }) => {
        const componentProps = { ...rootProps, ...extraCombinedParams.extras };

        const mainRoute = generateRoute({
          key: path,
          exact,
          element: <ComponentWithLayout Layout={Layout} Component={Component} {...componentProps} />,
          path,
          auth,
          rolesSet,
          authorisedFor,
          Private
        });

        if (!modules) {
          return mainRoute;
        }

        const moduleRoutes = modules.map((childrenProps) =>
          generateRoute({
            key: childrenProps.path,
            exact: childrenProps.exact,
            generateRoute,
            auth,
            rolesSet,
            authorisedFor,
            Private,
            element: (
              <ComponentWithLayout
                Layout={Layout}
                Component={childrenProps.Component}
                {...componentProps}
                {...childrenProps.extras}
              />
            ),
            path: path + childrenProps.path,
          })
        );

        return [mainRoute, ...moduleRoutes];
      }
    );

    return routeElements.flat();
  }, [auth, user, extraCombinedParams, routes, rolesSet]);

  return <Routes>{RoutesMap}</Routes>;
};

const routeType = PropTypes.shape({
  Private: PropTypes.bool,
  exact: PropTypes.bool,
  Layout: PropTypes.elementType,
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      exact: PropTypes.bool,
      Component: PropTypes.elementType.isRequired,
      extras: PropTypes.object,
    })
  ),
  Component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
});

RouterCombiner.propTypes = {
  routes: PropTypes.arrayOf(routeType).isRequired,
  auth: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default RouterCombiner;
