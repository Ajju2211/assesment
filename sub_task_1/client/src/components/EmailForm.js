// EmailForm.js
import React from 'react';
import { Box, TextInput, Button, FormField } from 'grommet';

const EmailForm = ({ onSubmit }) => {

  return (
    <Box>
        <FormField name="username">
        <TextInput
          placeholder="Email or Phone"
          name="username"
        />
      </FormField>
      <FormField name="password">
        <TextInput
          placeholder="Password"
          type="password"
          name="password"
        />
      </FormField>
        <Button type="submit" label="Login" primary onClick={onSubmit}/>
    </Box>
  );
};

export default EmailForm;
