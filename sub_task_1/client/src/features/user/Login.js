// Login.js
import React, { useState } from "react";
import { Form as GrommetForm, Button, Box, Heading, Card, Text } from "grommet";
import EmailForm from "../../components/EmailForm";
import PhoneForm from "../../components/PhoneForm";

import { Google } from "grommet-icons";
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUser,
} from './userSlice.js';

const Login = () => {
  const [loginType, setLoginType] = useState("local");

  const onSubmit = (data) => {
    if (loginType === "phone") {
      // Handle OTP login logic
      console.log("OTP login:", data);
    } else {
      // Handle email login logic
      console.log("Email login:", data);
      // dispatch(setUser())
      // dispatch(loginWithLocalAsync(data))
    }
  };

  return (
    <Box align="center" justify="center" pad="large">
      <Card background="light-2" pad="medium" width="medium">
        <Heading level={3}>Login {loginType === "phone" ? "/ Signup" : ""}</Heading>

        <GrommetForm onSubmit={onSubmit}>
          {loginType === "phone" && <PhoneForm />}
          {loginType === "local" && <EmailForm  />}
          <ORBreaker />
          <Box margin={{ top: "5px" }} pad={{ left: "medium", right: "medium" }} gap="5px">
            <Button
              type="reset"
              size="small"

              label={
                loginType === "phone" ? "Login with email" : "Login with Phone"
              }
              onClick={() => setLoginType(loginType === "local" ? "phone" : "local")}
            />
            <Button icon={<Google />} type="button" label="Google SignIn" onClick={handleGoogleSigIn} size="small" />
          </Box>
        </GrommetForm>
      </Card>
    </Box>
  );
};

const handleGoogleSigIn = () => {
  window.location.assign("http://localhost:3000/google")
}

const ORBreaker = () => (
  <Box direction="row" align="center" justify="center" pad={{ horizontal: "medium" }}>
    <Box
      flex="grow"
      border={{
        side: "right",
        size: "medium",
        color: "#b4b9bbd9",
        round: "large",
      }}
      height="3px"
      background="#b4b9bbd9"
    />
    <Text margin="small" size="large">
      *OR*
    </Text>
    <Box
      flex="grow"
      border={{
        side: "left",
        size: "medium",
        color: "#b4b9bbd9",
        round: "medium",
      }}
      height="3px"
      background="#b4b9bbd9"
    />
  </Box>

)

export default Login;