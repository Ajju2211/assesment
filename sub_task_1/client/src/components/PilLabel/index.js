import { Box, Button, Text } from 'grommet';
import { Close } from 'grommet-icons';
import React from 'react'

const PillLabel = ({ label, onClose, id }) => {
    return (
        <Box
            direction="row"
            align="center"
            flex={{ grow: 0, shrink: 0 }}
            justify="between"
            pad={{ horizontal: "small", vertical: "0px" }}
            background="rgb(198 242 186)"
            round="medium"
            border={{ color: 'brand', size: 'small' }}
            basis="auto"
            width="max-content"
            height="max-content"
        >
            <Text size="medium">{label}</Text>
            <Button icon={<Close size="15px" />} size="small" onClick={() => onClose(id)} />
        </Box>
    );
};

export default PillLabel