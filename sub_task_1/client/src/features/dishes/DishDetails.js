import { Edit } from "grommet-icons";
import { Box, Image, DataTable, Text, Heading, Paragraph, Spinner } from "grommet";
// import "./mealDetails.css";
import { useGetDishByIdQuery } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const DishDetails = () => {

    const { id } = useParams()
    const { data, isLoading, refetch, isError } = useGetDishByIdQuery({ id })
    const navigate = useNavigate()

    useEffect(() => {
        // if (isLoading) {
            console.log("hehe")
        refetch()
        // }
    }, [refetch,id])

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
                        <Text weight="bold">Cuisine:</Text> {data.dish_type}
                    </Text>
                    <Text className="wrap">
                        <Text weight="bold">Description:</Text>
                        <Paragraph>{data.description}</Paragraph>
                    </Text>
                </Box>

                <span className="fnt">Ingredients:</span>
                <DataTable columns={columns} data={data.ingredients} />
            </Box>
        </Box>
    );
};

export default DishDetails;
