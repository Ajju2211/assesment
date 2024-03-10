import React, { useEffect, useMemo } from 'react';
import { Box, DataTable, Button, Text } from 'grommet';
import { useNavigate } from 'react-router-dom';
import useSkipping from '../../components/hooks/useSkipping';
import { useDeleteMealMutation, useGetAllMealsQuery } from '../../services/api';
import FullLoader from "../../components/Loaders/FullLoader"

const MealList = ({ isManager }) => {
    const defaultLimit = 2;
    const navigate = useNavigate();
    const { skip, skipNext, backward, setSkip, maxSkip, setMaxSkip } = useSkipping(defaultLimit);

    const { data: apiData, isLoading, refetch, isSuccess, isFetching } = useGetAllMealsQuery({ skip, limit: defaultLimit }, {
        refetchOnMountOrArgChange: true,
    });


    const data = useMemo(() => (apiData?.meals || []).map(d => ({ ...d, numberOfDishes: d.dishes.length })), [apiData?.meals])
    const [deleteMeal, { isLoading: isDeleteLoading, }] = useDeleteMealMutation();

    const handleView = (meal) => {
        navigate(`/meals/${meal.id}`);
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

    const handleDeleteMeal = async (mealId) => {
        await deleteMeal(mealId)
        refetch();
    };

    const mealColumns = [
        { property: 'name', header: 'Meal Name', primary: true },
        { property: 'price', header: 'Price' },
        { property: 'numberOfDishes', header: 'No. of Dishes' },
        { property: 'cuisine', header: 'Cuisine' },
        { property: 'food_for', header: 'Veg/Non-Veg/Egg' },
        {
            header: 'Actions',
            render: (meal) => (
                <Box direction="row" gap="small">
                    <Button label="View" onClick={() => handleView(meal)} />
                    {isManager && <Button
                        label="Delete Meal"
                        onClick={() => handleDeleteMeal(meal.id)}
                        color="status-critical"
                    />}
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
                <DataTable columns={mealColumns} data={data} step={10} />
            </Box>
            {paginationButtons}
        </Box>
    );
};

export default MealList;
