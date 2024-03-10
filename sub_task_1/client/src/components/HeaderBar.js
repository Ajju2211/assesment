import { Anchor, Avatar, Header, Image, Nav, Menu as GrommetMenu, DropButton, Box } from 'grommet';
import { Home, Login, Menu, Power, User } from 'grommet-icons';
import React from 'react';
import "./HeaderBar.css";
import { useSelector } from 'react-redux';
import { selectUser } from '../features/user/userSlice';
import { Link, useN, useNavigate } from 'react-router-dom';
import { persistor } from '../app/store';
import constants from "../utils/constants.json"

const HeaderBar = ({ user, rolesSet }) => {
  const navigate = useNavigate()
  const handleLogout = () => {
    persistor.purge()
    navigate("/login")
  }
  return (
    <Header
      background="light-3"
      sticky="scrollup"
      pad={{ vertical: 'small', horizontal: 'xsmall' }}
    >
      <Image src="/logo512.png" className="brand-logo" onClick={() => navigate("/")} />
      <Nav align="center" direction="row">
        {
          user && user.isLogged && (
            <Link to="/meals">{rolesSet.has(constants.ROLES.MANAGER) ? "Manage" : "View"} meals</Link>
          )
        }
        {
          (!user || !user.isLogged) ? <Link to="/login">Login</Link> : <GrommetMenu
            label="Profile"
            items={[
              {
                label: 'Profile', icon: <User />, gap: 'small', onClick: () => {
                  navigate("/profile")
                }
              },
              {
                label: 'Logout',
                icon: <Power />,
                onClick: handleLogout,
                reverse: true,
                gap: 'small',
              },
            ]}
          />
        }
        {/* <DropButton
          label="Menu"
          dropContent={
            <Box>
              <Link>Something</Link>
            </Box>
          }
        /> */}
      </Nav>
    </Header>
  );
};

export default HeaderBar;
