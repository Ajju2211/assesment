import React, { useEffect, useMemo } from 'react';
import { Box, DataTable, Button, Text } from 'grommet';
import { useNavigate } from 'react-router-dom';
import useSkipping from '../../components/hooks/useSkipping';
import { useDeleteDishMutation, useGetAllDishesQuery } from '../../services/api';
import FullLoader from "../../components/Loaders/FullLoader"

const ListDish = ({ isManager }) => {
    const defaultLimit = 2;
    const navigate = useNavigate();
    const { skip, skipNext, backward, setSkip, maxSkip, setMaxSkip } = useSkipping(defaultLimit);

    const { data: apiData, isLoading, refetch, isSuccess, isFetching } = useGetAllDishesQuery({ skip, limit: defaultLimit }, {
        refetchOnMountOrArgChange: true,
    });

    const data = useMemo(() => (apiData?.dishes || []), [apiData?.dishes])


    const [deleteDish, { isLoading: isDeleteLoading, }] = useDeleteDishMutation();

    const handleView = (dish) => {
        navigate(`/dishes/${dish.id}`);
    };

    useEffect(() => {
        refetch()
    }, [refetch])

    useEffect(() => {
        if (isSuccess && data.length < defaultLimit) {
            if (data.length === 0) {
                setMaxSkip(Math.max(0, skip - defaultLimit))
            } else {
                setMaxSkip(skip)
            }
        }
    }, [isSuccess, data, setMaxSkip, skip])

    useEffect(() => {

    }, [])

    const handleDeleteDish = async (dishId) => {
        await deleteDish(dishId)
        refetch();
    };

    const dishColumns = [
        { property: 'name', header: 'Dish Name', primary: true },
        { property: 'price', header: 'Price' },
        { property: 'numberOfDishes', header: 'No. of Dishes' },
        { property: 'cuisine', header: 'Cuisine' },
        { property: 'food_for', header: 'Veg/Non-Veg/Egg' },
        {
            header: 'Actions',
            render: (dish) => (
                <Box direction="row" gap="small">
                    <Button label="View" onClick={() => handleView(dish)} />
                    {
                        isManager &&
                        <Button
                            label="Delete dish"
                            onClick={() => handleDeleteDish(dish.id)}
                            color="status-critical"
                        />
                    }
                </Box>
            ),
        },
    ];

    const pageNumber = React.useMemo(() => Math.ceil((skip / defaultLimit) + 1), [
        skip,
        defaultLimit,
    ]);

    const paginationButtons = (
        <Box direction="row" justify="center" gap="small" margin={{ top: 'medium' }}>
            <Button label="Previous" onClick={() => backward()} disabled={skip === 0} />
            <Text>{`Page ${pageNumber}`}</Text>
            <Button
                label="Next"
                onClick={() => skipNext()}
                disabled={isLoading || (skip >= maxSkip && maxSkip > 0)}
            />
        </Box>
    );

    return (
        <Box align="center" pad="large">
            <FullLoader isLoading={isLoading || isDeleteLoading} />
            <Box height="450px" overflow="auto">
                <DataTable columns={dishColumns} data={data} step={10} />
            </Box>
            {paginationButtons}
        </Box>
    );
};

export default ListDish;
