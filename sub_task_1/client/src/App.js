import React, {  useEffect } from "react";
import Login from "./features/user/Login";
import "./App.css";
import Layout from "./components/Layout";
import Profile from "./features/user/Profile";
import RouterCombiner from "./components/Router/RouterCombiner"

import NotFound from "./features/NotFound";
import { BrowserRouter } from "react-router-dom";
import Home from "./features/Home";
import { useSelector } from "react-redux";
import {  selectUser } from "./features/user/userSlice";
import Meals from "./features/meals";
import constants from "./utils/constants.json"
import { useTokenValidateQuery } from "./services/api";
import { logOut } from "./app/store";
import Dishes from "./features/dishes";
import MealDetails from "./features/meals/MealDetails";
import DishDetails from "./features/dishes/DishDetails";

const Routes = [
  {
    path: "/",
    Component: Home,
    Layout: Layout,
    authorisedFor: [constants.ROLES.MANAGER]
  },
  {
    path: "/login",
    Component: Login,
    Layout: Layout,
    exact: true,
    modules: [
      {
        path: "/testing_nested",
        Component: Login,
      }
    ]
  },
  {
    path: "/profile",
    Component: Profile,
    Private: true,
    Layout: Layout
  },
  {
    path: "/meals",
    Component: Meals,
    Private: true,
    Layout: Layout
  },
  {
    path: "/dishes",
    Component: Dishes,
    Private: true,
    Layout: Layout
  },
  {
    path:"meals/:id",
    Component: MealDetails,
    Private: true,
    Layout: Layout
  },
  {
    path:"dishes/:id",
    Component: DishDetails,
    Private: true,
    Layout: Layout
  },
  {
    path: "*",
    Component: NotFound
  }
]

function App() {
  const user = useSelector(selectUser)
  const { refetch } = useTokenValidateQuery()
  useEffect(() => {
    const checkTkn = async () => {
      try {
        const res = await refetch();
        if (res.error != null && res.error.originalStatus === 401) {
          logOut()
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };


    if (user.token !== "" && user.isLogged) {
      checkTkn()
    }
  }, [refetch, user.isLogged, user.token]);
  return (
    <>
      <BrowserRouter>
        <RouterCombiner
          routes={Routes}
          auth={user.isLogged}
          user={user}
        />
      </BrowserRouter>
    </>
  );
}

export default App;
