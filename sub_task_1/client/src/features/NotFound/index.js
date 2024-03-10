import { Box, Button, Heading } from 'grommet'
import React from 'react'
import { Link } from 'react-router-dom'
import "./notfound.css"

const NotFound = () => {
  return (
    <Box background="brand" height="100vh" align="center" justify="around" className="notFound">
      <Heading level={1} size="xlarge" style={{fontSize:"14rem"}}>404</Heading>
      <Heading level={2}>Oops! Something is wrong.</Heading>
      <Box background={"green"} round="xsmall" pad={"small"}><Link to="/"><Button color="light-1" pad={"small"}>Home</Button></Link></Box>
    </Box>
  )
}

export default NotFound