import { Box, Layer, Spinner } from 'grommet'
import React from 'react'

const FullLoader = ({isLoading}) => {
    if(!isLoading){
        return <></>
    }
    return (
        <Layer
            full
            background="rgba(0, 0, 0, 0)"
            animate={false}
        >
            <Box fill background="rgba(0, 0, 0, 0.2)">
                <Box align="center" justify="center" fill>
                    <Spinner size="large" color="rgba(140,190,10,1)" />
                </Box>
            </Box>
        </Layer>
    )
}

export default FullLoader