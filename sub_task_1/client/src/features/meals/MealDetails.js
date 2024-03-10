import { Edit, View } from "grommet-icons";
import { Card, CardHeader, CardBody, Button, Box, Image, DataTable, Text, Heading, TextArea, Paragraph, Spinner } from "grommet";
import "./mealDetails.css";
import { useGetMealByIdQuery } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const MealDetails = () => {

    const { id } = useParams()
    const { data, isLoading, refetch, isError } = useGetMealByIdQuery({ id })
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoading) {
            refetch()
        }
    }, [isLoading, refetch])

    const columns = [
        {
            property: 'name',
            header: <Text>Name</Text>,
            primary: true,
        },
        {
            property: 'quantity',
            header: <Text>Quantity</Text>,
        },
        {
            property: 'units',
            header: <Text>Units</Text>,
        },
    ];

    const ingredients = [
        { name: 'abc', quantity: '1', units: 'kg' },
    ];
    if (isError) {
        return (<Box align="center">
            <Paragraph size="xlarge">Uff something error...</Paragraph>
        </Box>)
    }
    if (!data || isLoading) {
        return (<Box align="center">
            <Spinner />
        </Box>)
    }

    return (
        <Box width={"100%"} align="center">
            <Heading level={4} textAlign="center" style={{ textTransform: "capitalize" }}>
                {data.name}
                <Edit size="20px" />
            </Heading>
            <Box className="box" margin={{ horizontal: "20%" }} border="5px solid black" width="60%">
                <Image
                    fit="cover"
                    width="60%"
                    className="img"
                    src={data.photo}
                />

                <Box className="txt" align="center" justify="center" gap="small">
                    <Text>
                        <Text weight="bold">Price:</Text> {data.price}
                    </Text>
                    <Text>
                        <Text weight="bold">Type:</Text>{data.food_for}
                    </Text>
                    <Text>
                        <Text weight="bold">Cuisine:</Text> {data.cuisine_type}
                    </Text>
                    <Text className="wrap">
                        <Text weight="bold">Description:</Text>
                        <Paragraph>{data.description}</Paragraph>
                    </Text>
                </Box>

                <span className="fnt">Dishes:</span>
                <Box height="medium" className="cards-container" width="100%" overflow="auto" direction="row">
                    {
                        data.dishes.map(dish => (
                            <Card background="light-1" className="myCard" width="medium" margin={{ right: "small" }}>
                                <CardHeader>
                                    <Heading level={5} style={{ textTransform: "capitalize" }}>{dish.name}</Heading>
                                    <Button onClick={() => navigate("/dishes/" + dish.id,)} icon={<View color="brand" />} hoverIndicator />
                                </CardHeader>
                                <CardBody pad="0px">
                                    <Image
                                        fit="contain"
                                        className="cardImg"
                                        width="90%"
                                        height="auto"
                                        src={dish.photo}
                                    />
                                </CardBody>
                            </Card>
                        ))
                    }
                </Box>
                <span className="fnt">Ingredients:</span>
                <DataTable columns={columns} data={ingredients} />
            </Box>
        </Box>
    );
};

export default MealDetails;
