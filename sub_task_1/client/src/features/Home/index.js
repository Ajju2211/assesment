import { Box, Carousel, Heading, Image } from 'grommet'
import React from 'react'
import "./homepage.css"


const Home = () => {
    return (
        <Box style={{position:"relative"}}>
            <Box className="background-home">
                <Heading className="overlay-text" level={2} color={"dark-1"}>Welcome to Opstech Food ordering</Heading>
            </Box>
            <Box height="small" width="medium" overflow="hidden" round="large" className="carousel-box">
                <Carousel fill play={1500}>
                    <Image fit="cover" className="carousel-img" src="//images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800" />
                    <Image fit="cover" className="carousel-img" src="//images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800" />
                    <Image fit="cover" className="carousel-img" src="//images.pexels.com/photos/3186654/pexels-photo-3186654.jpeg?auto=compress&cs=tinysrgb&w=800" />
                </Carousel>
            </Box>
        </Box>
    )
}

export default Home