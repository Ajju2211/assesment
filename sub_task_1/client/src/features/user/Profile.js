import React, { useEffect, useState } from 'react';
import { Grommet, Box, Card, CardHeader, CardBody, Avatar, Text, Form, FormField, TextInput, Button, Spinner } from 'grommet';
import { useImmer } from 'use-immer';
import { useGetMyProfileQuery } from '../../services/api';

const ProfilePage = ({ user }) => {
  const [editing, setEditing] = useState(false);

  const { data: myProfile, isLoading, isFetching, refetch } = useGetMyProfileQuery()
  useEffect(() => {
    refetch()
  }, [refetch])

  const [formData, updateFormData] = useImmer({
    name: myProfile?.name,
    email: myProfile?.email,
    phoneNumber: myProfile?.phoneNumber,
    password: ""
  });

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    updateFormData((draft) => {
      draft[name] = value;
    });
  };

  const handleSave = () => {
    setEditing(false);
  };
  if (isLoading || isFetching) {
    return <Spinner size="large" />
  }

  return (
    <Grommet>
      <Box align="center" pad="large">
        <Card width="medium" background="light-1" elevation="medium">
          <CardHeader pad="medium">
            <Box align="center" width="100%">
              {myProfile.avatar ? (
                <Avatar size="xlarge" src={myProfile.avatar} />
              ) : (
                <Avatar size="large" background="brand">
                  {myProfile.fullName && myProfile.fullName.slice(0, 2).toUpperCase()}
                </Avatar>
              )}
              {editing ? (
                <TextInput
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter Full name"
                />
              ) : (
                <Text size="xlarge" weight="bold" margin={{ left: 'small' }}>
                  {myProfile.fullName}
                </Text>
              )}
            </Box>
          </CardHeader>
          <CardBody pad="medium">
            <Form>
              <FormField label="Email">
                <Text>{myProfile.email}</Text>
              </FormField>
              <FormField label="Phone Number">
                <Text>{myProfile.phoneNumber}</Text>
              </FormField>
              <FormField label="Password">
                <TextInput
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={!editing}
                  placeholder="Password"
                  type="password"
                />
              </FormField>
              {editing ? (
                <Box direction="row" justify="between" margin={{ top: 'medium' }}>
                  <Button label="Save" onClick={handleSave} primary />
                  <Button label="Cancel" onClick={handleEditToggle} />
                </Box>
              ) : (
                <Button label="Edit" onClick={handleEditToggle} />
              )}
            </Form>
          </CardBody>
        </Card>
      </Box>
    </Grommet>
  );
};

export default ProfilePage;
