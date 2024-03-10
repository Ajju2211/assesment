import React, { useState } from 'react';
import {
  Button,
  Box,
  Card,
} from 'grommet';
import  './Layout.css';
import Header from './HeaderBar';

export const Layout = ({children, user, rolesSet}) => {
  return (
    <Box className='layout'>
        <Header user={user} rolesSet={rolesSet}/>
          {children}
      </Box>
  );
};


export default Layout